import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { TreeNavigation } from '../components/TreeNavigation';
import { Editor } from '../components/Editor';
import { Header } from '../components/Header';
import { ThemeCustomizer } from '../components/ThemeCustomizer';
import { FolderType, Theme } from '../types';
import AxiosInstance from '../components/AxiosInstance';
import { toast } from 'react-toastify';
import { Corkboard } from '../components/Corkboard';
import { Notebar } from '../components/Notebar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { compressHTML } from '../utils/compression';
import { TrashComponent } from '../components/Trash';

export function ProjectPage() {
  const owner = useSelector(
    (state: RootState) => state.auth.tokenPayload.username
  );
  const location = useLocation();
  const { nameFolder } = location.state || {};
  const [folders, setFolders] = useState<FolderType | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | boolean>(false);
  const [currentFolder, setcurrentFolder] = useState<FolderType>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [theme, setTheme] = useState<Theme>({
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    sidebar: '#f3f4f6',
  });
  const [sidebarWidth, setSidebarWidth] = useState(180);
  const [isResizing, setIsResizing] = useState(false);
  const [showCoarkBoard, setShowCoarkBoard] = useState<any>();
  const [viewMode, setViewMode] = useState<'editor' | 'corkboard'>('editor');
  const [isNoteBarOpen, setIsNoteBarOpen] = useState(false);
  const [baseContent, setBaseContent] = useState('');

  useEffect(() => {
    loadFolders();
  }, [nameFolder]);
  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(`folders/${nameFolder}/`);
      setFolders(response.data);

      // Cập nhật lại currentFolder nếu đang được chọn
      if (currentFolder?.path) {
        const updatedFolder = findItemByPath(response.data, currentFolder.path);
        setcurrentFolder(updatedFolder || currentFolder);
      }
    } catch (error) {
      toast.error('Failed to load folders.');
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        handleSave();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [
    currentFolder?.content,
    currentFolder?.summary,
    currentFolder?.note,
    hasUnsavedChanges,
  ]);

  const handleSelectNote = async (
    selectedNotePath: string,
    isDoubleClick: boolean
  ) => {
    if (isDoubleClick) {
      setShowCoarkBoard(false);
    }
    setcurrentFolder(findItemByPath(folders, selectedNotePath));
  };
  const handleSelectItem = async (item: FolderType) => {
    if (hasUnsavedChanges) {
      await handleSave();
    }
    if (item.isFile) {
      setShowCoarkBoard(false);
      setSelectedPath(item.path);
      setcurrentFolder(item);
      localStorage.getItem(item.path)
        ? ''
        : localStorage.setItem(item.path as string, item.content);
    } else {
      setSelectedPath(item.path);
      setShowCoarkBoard(true);
      setcurrentFolder(item);
    }
    setHasUnsavedChanges(false);
  };

  const handleFolderChange = (content: string) => {
    // Sử dụng currentContent với giá trị mặc định là ""
    const currentContent = currentFolder?.content || '';
    if (currentContent !== content) {
      setcurrentFolder({ ...currentFolder, content });
      setHasUnsavedChanges(true);
      localStorage.setItem(
        currentFolder?.path as string,
        JSON.stringify({ ...currentFolder, content })
      );
    }
  };

  const handleSave = async () => {
    if (!selectedPath || !currentFolder) return;

    try {
      await AxiosInstance.post(`folders/update`, {
        path: currentFolder.path,
        newContent: currentFolder.content || '', // Gửi cả giá trị rỗng
        // ... các trường khác
        newSummary: currentFolder.summary || '',
        newNote: currentFolder.note || '',
      });
      setHasUnsavedChanges(false);
      localStorage.removeItem(currentFolder.path as string);
      await loadFolders(); // Load lại dữ liệu từ server
    } catch (error) {
      toast.error('Failed to save document.');
    }
  };

  const handleRename = async (path: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    try {
      await AxiosInstance.post('folders/update', { path, newName });
      toast.success(`Renamed to ${newName}`);
      loadFolders();
    } catch (error) {
      toast.error('Rename failed.');
    }
  };
  const handleRemove = async (path: string) => {
    try {
      await AxiosInstance.post('folders/remove', { path });
      // toast.success('Deleted successfully.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to remove.');
    }
  };
  const handleRestore = async (path: string) => {
    try {
      await AxiosInstance.post('folders/restore', { path });
      // toast.success('Restored successfully.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to restore.');
    }
  };
  const handleAddFolder = async (path: string, name: string) => {
    try {
      await AxiosInstance.post('folders/create', {
        name: name,
        path: `${path}/${transformString(name)}`,
        isFile: false,
      });
      // toast.success('Folder created.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to create folder.');
    }
  };
  const handleAddDocument = async (path: string, name: string) => {
    // console.log(parentPath);
    try {
      await AxiosInstance.post('folders/create', {
        name: name,
        path: `${path}/${transformString(name)}.txt`,
        isFile: true,
      });
      // toast.success('Document created.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to create document.');
    }
  };
  const handleChangeIcon = async (path: string, iconName: string) => {
    AxiosInstance.post(`folders/update`, {
      path: path,
      newIcon: iconName,
    });
    console.log(iconName);
  };
  const getDeletedItems = (folder: FolderType): FolderType[] => {
    const deletedItems: FolderType[] = [];

    const traverse = (node: FolderType) => {
      if (node.deleted) {
        deletedItems.push(node);
      }

      if (node.children) {
        Object.values(node.children).forEach(traverse);
      }
    };

    traverse(folder);
    return deletedItems;
  };
  function getPathAsString(path: string): string {
    const pathComponents = path.split('/').filter((component) => component);
    return pathComponents.join(' > ');
  }
  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);
  const resizeSidebar = (e: React.MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX - document.body.offsetLeft;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    }
  };
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', resizeSidebar);
      document.addEventListener('mouseup', stopResizing);
    } else {
      document.removeEventListener('mousemove', resizeSidebar);
      document.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      document.removeEventListener('mousemove', resizeSidebar);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  // const getCurrentFolderItems = useCallback(() => {
  //   const folder = findItemByPath(folders, currentFolderPath);
  //   return folder?.children || {};
  // }, [folders, currentFolderPath]);

  // const handleCorkboardSelect = (path: string) => {
  //   setSelectedPath(path);
  //   const item = findItemByPath(folders, path);
  //   if (item?.isFile) {
  //     setCurrentContent(item.content || '');
  //   }
  // };

  // const handleCorkboardDoubleClick = (path: string) => {
  //   const item = findItemByPath(folders, path);
  //   if (item?.isFile) {
  //     setViewMode('editor');
  //   } else {
  //     setCurrentFolderPath(path);
  //   }
  // };

  const findItemByPath = (
    root: FolderType,
    path: string
  ): FolderType | null => {
    if (root.path === path) return root;
    if (!root.children) return null;

    for (const child of Object.values(root.children)) {
      const found = findItemByPath(child, path);
      if (found) return found;
    }
    return null;
  };
  const transformString = (input: string) => {
    let upperCaseString = input.toLowerCase();
    let transformedString = upperCaseString.replace(/\s+/g, '_');
    return transformedString;
  };

  const handleDelete = async (path: string) => {
    try {
      await AxiosInstance.delete('folders/delete', { data: { path } });
      // toast.success('Deleted successfully.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to delete.');
    }
    console.log(path);
  };

  const handleNoteSummaryChange = (summary: string, note: string) => {
    const updatedFolder = {
      ...currentFolder,
      summary,
      note,
    };
    setcurrentFolder(updatedFolder);

    setHasUnsavedChanges(true);
    // Lưu vào localStorage nếu cần
    localStorage.setItem(
      currentFolder?.path as string,
      JSON.stringify({ ...currentFolder, summary, note })
    );
  };

  const saveRevision = async (title: string) => {
    try {
      const compressed = compressHTML(currentFolder?.content);

      const res = await AxiosInstance.post(`revisions/`, {
        content: Array.from(compressed),
        author: owner,
        title: title || currentFolder?.name, // Sử dụng tiêu đề mới hoặc tên thư mục nếu không có
        path: currentFolder?.path,
      });

      // console.log(res);
      // setNewRevision({ title: '', isEditing: false }); // Reset trạng thái sau khi lưu
      // await loadRevision(); // Tải lại danh sách revisions
    } catch (err) {
      console.error('Error saving revision:', err);
    }
  };
  const deleteRevision = (_id: string) => {
    AxiosInstance.delete(`revisions/${_id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const rollbackRevision = async (content: string) => {
    setcurrentFolder({ ...currentFolder, content: content });
    setHasUnsavedChanges(true);
  };

  // ProjectPage.jsx
  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <Header
        onNewFolder={() => handleAddFolder(selectedPath || `/${owner}`)}
        onNewDocument={() => handleAddDocument(selectedPath || `/${owner}`)}
        currentFolder={currentFolder}
        onToggleTrash={() => setShowDeleted(!showDeleted)}
        showTrash={showDeleted}
        toggleNotebar={() => setIsNoteBarOpen((prev) => !prev)}
        showCoarkBoard={showCoarkBoard}
        onSelectItem={handleSelectItem}
        selectedPath={selectedPath}
        folders={folders}
        findItemByPath={findItemByPath}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigator */}
        <aside
          className="bg-gray-50 border-r overflow-auto relative"
          style={{ width: sidebarWidth, backgroundColor: theme.sidebar }}
        >
          {folders && (
            <TreeNavigation
              folder={folders}
              selectedPath={selectedPath}
              onSelectItem={handleSelectItem}
              onToggleFolder={setSelectedPath}
              onRename={handleRename}
              onRemove={handleRemove}
              onRestore={handleRestore}
              onAddFolder={handleAddFolder}
              onAddDocument={handleAddDocument}
              showDeleted={showDeleted}
              onChangeIcon={handleChangeIcon}
              onDelete={handleDelete}
            />
          )}
          <div
            onMouseDown={startResizing}
            className="resizer position-absolute top-0 end-0 h-100"
            style={{
              width: '5px',
              cursor: 'col-resize',
              backgroundColor: '#f1f1f1',
            }}
          />
        </aside>

        {/* Editor */}
        <main
          className={`flex-1 bg-white transition-[margin-right] duration-300 ${
            isNoteBarOpen ? 'mr-[200px]' : 'mr-0'
          }`}
        >
          {!showDeleted && !showCoarkBoard && currentFolder ? (
            <Editor
              currentFolder={currentFolder}
              onChange={handleFolderChange}
              onSave={handleSave}
              hasUnsavedChanges={hasUnsavedChanges}
              theme={theme}
            />
          ) : showDeleted ? (
            <TrashComponent
              folders={folders}
              handleDelete={handleDelete}
              handleRestore={handleRestore}
            />
          ) : showCoarkBoard ? (
            <Corkboard
              items={findItemByPath(folders, selectedPath)?.children}
              onSelectNote={handleSelectNote}
              onSelectItem={handleSelectItem}
              currentFolder={currentFolder}
            />
          ) : (
            <div className="text-center mt-20">Select a document to edit</div>
          )}
        </main>

        {/* Notebar */}
        <Notebar
          isOpen={isNoteBarOpen}
          currentFolder={currentFolder}
          onChange={handleNoteSummaryChange}
          saveRevision={saveRevision}
          deleteRevision={deleteRevision}
          rollbackRevision={rollbackRevision}
        />
      </div>
    </div>
  );
}
