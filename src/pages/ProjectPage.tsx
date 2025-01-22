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

const owner = 'john_doe';
export function ProjectPage() {
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

  // const [currentFolderPath, setCurrentFolderPath] =
  //   useState<string>('/john_doe/my_docs');
  // console.log(folders);
  useEffect(() => {
    loadFolders();
  }, [folders]);
  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(
        `folders/${nameFolder}/${owner}`
      );
      setFolders(response.data);
    } catch (error) {
      // toast.error('Failed to load folders.');
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

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.ctrlKey && e.key === 's') {
  //       e.preventDefault();
  //       handleSave();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [selectedPath, currentFolder?.content, hasUnsavedChanges]);
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
    if (currentFolder?.content !== content) {
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
        newContent: currentFolder.content || '',
        newSummary: currentFolder.summary || '',
        newNote: currentFolder.note || '',
      });
      setHasUnsavedChanges(false);
      localStorage.removeItem(currentFolder.path as string);
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
    // Cập nhật currentFolder với summary và note mới
    // const updatedFolder = {
    //   ...currentFolder,
    //   summary: summary,
    //   note: note,
    // };
    // setcurrentFolder(updatedFolder);
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

  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      style={{ backgroundColor: theme.background }}
    >
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
      <div className="flex flex-1 overflow-hidden" onMouseMove={resizeSidebar}>
        <aside
          className=" bg-gray-50 border-r overflow-auto relative"
          style={{ width: sidebarWidth, backgroundColor: theme.sidebar }}
        >
          {/* <ThemeCustomizer theme={theme} onChange={setTheme} /> */}

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
        <main
          className={`flex-1 bg-white transition-[margin-right] duration-300 ${
            isNoteBarOpen ? 'mr-[200px]' : 'mr-0'
          }`}
        >
          {!showDeleted && !showCoarkBoard ? (
            <Editor
              currentFolder={currentFolder}
              onChange={handleFolderChange}
              onSave={handleSave}
              hasUnsavedChanges={hasUnsavedChanges}
              theme={theme}
            />
          ) : showDeleted ? (
            <div className="p-4">
              <div className="p-4 ">
                <h2 className="text-lg font-semibold mb-4">Trash</h2>
                {folders ? (
                  <ul
                    className="space-y-2 overflow-y-auto"
                    style={{ maxHeight: '500px' }}
                  >
                    {getDeletedItems(folders).map((item) => (
                      <li
                        key={item.path}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md hover:shadow"
                      >
                        <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                          <i
                            className={`${
                              item.icon ||
                              (item.isFile
                                ? 'bi-file-earmark-text'
                                : 'bi-folder')
                            } text-gray-500`}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-black">
                              {item.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {getPathAsString(item.path)}
                            </span>
                          </div>
                        </div>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(item.path)}
                        >
                          Delete
                        </button>

                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => handleRestore(item.path)}
                        >
                          Restore
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">Trash is empty</div>
                )}
              </div>
            </div>
          ) : showCoarkBoard ? (
            <Corkboard
              items={findItemByPath(folders, selectedPath)?.children}
              onSelectNote={handleSelectNote}
              // currentFolder={currentFolder}
              onSelectItem={handleSelectItem}
            />
          ) : (
            <div className="text-center mt-20">Select a document to edit</div>
          )}
        </main>

        <Notebar
          isOpen={isNoteBarOpen}
          currentFolder={currentFolder}
          onChange={handleNoteSummaryChange}
        />
      </div>
    </div>
  );
}
