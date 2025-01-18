import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TreeNavigation } from '../components/TreeNavigation';
import { Editor } from '../components/Editor';
import { Header } from '../components/Header';
import { ThemeCustomizer } from '../components/ThemeCustomizer';
import { FolderType, Theme } from '../types';
import AxiosInstance from '../components/AxiosInstance';
import { toast } from 'react-toastify';

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
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
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
  }, [currentFolder?.content, hasUnsavedChanges]);

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

  const handleSelectItem = async (item: FolderType) => {
    if (hasUnsavedChanges) {
      // const confirmSave = window.confirm('Bạn có muốn lưu thay đổi không?');
      // if (confirmSave) {
      //   await handleSave();
      // }
      await handleSave();
    }
    if (item.isFile) {
      setSelectedPath(item.path);
      setcurrentFolder(item);
      localStorage.getItem(item.path)
        ? ''
        : localStorage.setItem(item.path as string, item.content);
    } else {
      setSelectedPath(false);
    }
    setHasUnsavedChanges(false);
  };
  const handleFolderChange = (content: string) => {
    if (currentFolder?.content !== content) {
      setcurrentFolder({ ...currentFolder, content });
      setHasUnsavedChanges(true);
      localStorage.setItem(
        currentFolder?.path as string,
        currentFolder?.content
      );
    }
  };
  const handleSave = async () => {
    if (!selectedPath) return;
    try {
      await AxiosInstance.post(`folders/update`, {
        path: currentFolder?.path,
        newContent: currentFolder?.content || '',
      });
      setHasUnsavedChanges(false);
      localStorage.removeItem(currentFolder?.path as string);
      // toast.success('Document saved.');
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
  const handleDelete = async (path: string) => {
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
  const handleAddFolder = async (parentPath: string) => {
    try {
      await AxiosInstance.post('folders/create', {
        name: 'New Folder',
        path: `${parentPath}/new_folder`,
        isFile: false,
      });
      // toast.success('Folder created.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to create folder.');
    }
  };
  const handleAddDocument = async (parentPath: string) => {
    try {
      await AxiosInstance.post('folders/create', {
        name: 'New Document',
        path: `${parentPath}/new_document.txt`,
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
      />
      <div className="flex flex-1 overflow-hidden" onMouseMove={resizeSidebar}>
        <aside
          className=" bg-white border-r overflow-auto relative"
          style={{ width: sidebarWidth, backgroundColor: theme.sidebar }}
        >
          <ThemeCustomizer theme={theme} onChange={setTheme} />
          {folders && (
            <TreeNavigation
              folder={folders}
              selectedPath={selectedPath}
              onSelectItem={handleSelectItem}
              onToggleFolder={setSelectedPath}
              onRename={handleRename}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onAddFolder={handleAddFolder}
              onAddDocument={handleAddDocument}
              showDeleted={showDeleted}
              onChangeIcon={handleChangeIcon}
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
        <main className="flex-1 bg-white">
          {selectedPath && selectedPath !== false && !showDeleted ? (
            <Editor
              currentFolder={currentFolder}
              onChange={handleFolderChange}
              onSave={handleSave}
              hasUnsavedChanges={hasUnsavedChanges}
              theme={theme}
            />
          ) : showDeleted ? (
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
                            (item.isFile ? 'bi-file-earmark-text' : 'bi-folder')
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
          ) : (
            <div className="text-center mt-20">Select a document to edit</div>
          )}
        </main>
      </div>
    </div>
  );
}
