import React, { useState, useCallback, useEffect } from 'react';
import { useBeforeUnload, useLocation } from 'react-router-dom';
import { TreeNavigation } from '../components/TreeNavigation';
import { Editor } from '../components/Editor';
import { Header } from '../components/Header';
import { ThemeCustomizer } from '../components/ThemeCustomizer';
import { FolderType, Theme } from '../types';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import AxiosInstance from '../components/AxiosInstance';
import { toast } from 'react-toastify';
const owner = 'john_doe'
export function ProjectPage() {
  const location = useLocation();
  const { nameFolder } = location.state || {};
  const [showSidebar, setShowSidebar] = useState(true);
  const [folders, setFolders] = useState<FolderType>();

  const [theme, setTheme] = useState<Theme>({
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    sidebar: '#f3f4f6',
  });

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/john_doe/docs']));
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFolders();
  }, [folders]);

  // Tải danh sách folder
  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(`folders/${nameFolder}/${owner}`);
      
      // Extract docs and trash
      // console.log(response)
      const foldersData = response.data; // Assuming docs and trash are at index 8 in the response array
      // const extractedFolders = Object.values(foldersData);
      
      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };
// console.log(folders)

  const findItemByPath = (root: FolderType, path: string): FolderType | null => {
    if (root.path === path) return root;
    if (!root.children) return null;

    for (const child of Object.values(root.children)) {
      const found = findItemByPath(child, path);
      if (found) return found;
    }
    return null;
  };

  const updateItemInTree = (root: FolderType, path: string, updates: Partial<FolderType>): FolderType => {
    if (root.path === path) {
      return { ...root, ...updates };
    }

    if (root.children) {
      const newChildren = { ...root.children };
      Object.keys(newChildren).forEach(key => {
        newChildren[key] = updateItemInTree(newChildren[key], path, updates);
      });
      return { ...root, children: newChildren };
    }

    return root;
  };

  useBeforeUnload(
    useCallback((e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    }, [hasUnsavedChanges])
  );

  const handleToggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleSelectItem = (path: string) => {
    const item = findItemByPath(folders, path);
    if (item && item.isFile) {
      setSelectedPath(path); // Chỉ đặt selectedPath khi chọn tài liệu
      setCurrentContent(item.content || ''); // Tải nội dung tài liệu
    }
  };
  
  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!selectedPath) return;

    setFolders(prev => updateItemInTree(prev, selectedPath, { content: currentContent }));
    setHasUnsavedChanges(false);
  };

  const handleAddFolder = (parentPath: string) => {
    const newName = 'New Folder';
    const newPath = `${parentPath}/new_folder`;
    
    const newFolder = {
      name: newName,
      path: newPath,
      isFile: false,
    };

    // setFolders(prev => updateItemInTree(prev, parentPath, {
    //   children: {
    //     ...prev.children,
    //     [newName]: newFolder
    //   }
    // }));
    // setExpandedFolders(prev => new Set([...prev, parentPath]));
    AxiosInstance.post(`folders/create`, newFolder).then((res)=>console.log(res)).catch((err) => toast.error(`Can't create ${newName}. ${err.response.data.message}`))
  };

  const handleAddDocument = (parentPath: string) => {
    const newName = 'New Document';
    const newPath = `${parentPath}/new_document`;
    
    const newDoc = {
      name: newName,
      path: newPath,
      isFile: 1
    };

    // setFolders(prev => updateItemInTree(prev, parentPath, {
    //   children: {
    //     ...prev.children,
    //     [newName]: newDoc
    //   }
    // }));
    // console.log(newDoc)
    AxiosInstance.post(`folders/create`, newDoc).then((res)=>console.log(res)).catch((err) => toast.error(`Can't create ${newName}. ${err.response.data.message}`))
  };

  const handleDelete =  (path: string, isFile: boolean) => {
    // setFolders(prev => updateItemInTree(prev, path, { deleted: true }));
    // if (selectedPath === path) {
    //   setSelectedPath(null);
    //   setCurrentContent('');
    // }
    // console.log(path)
     AxiosInstance.post(`folders/delete`, {path: path}).then((res)=>console.log(res))
  };

  const handleRestore = (path: string) => {
    // setFolders(prev => updateItemInTree(prev, path, { deleted: false }));
    AxiosInstance.post(`folders/restore`, {path: path}).then((res)=>console.log(res))
  };

  const handleRename = (path: string, newName: string) => {
    const item = findItemByPath(folders, path);
    if (!item) return;

    const newPath = `${item.parentPath}/${newName}${item.isFile ? '.txt' : ''}`;
    setFolders(prev => updateItemInTree(prev, path, { name: newName, path: newPath }));
  };

  const handleChangeIcon = (path: string, icon: string) => {
    setFolders(prev => updateItemInTree(prev, path, { icon }));
  };
// console.log(selectedPath)
  return (
    <div className="flex flex-col h-screen bg-gray-50" style={{ backgroundColor: theme.background }}>
      <Header 
        onNewFolder={() => handleAddFolder(selectedPath)}
        onNewDocument={() => handleAddDocument(selectedPath)}
        selectedPath={selectedPath}
        onToggleTrash={() => setShowDeleted(!showDeleted)}
        showTrash={showDeleted}
      />
      <div className="flex flex-1 overflow-hidden">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-r-md shadow-md z-10"
        >
          {showSidebar ? <i className="bi bi-arrow-left"></i> : <i className="bi bi-arrow-right"></i>}
        </button>
        {showSidebar && (
          <aside className="w-64 bg-white border-r overflow-y-auto" style={{ backgroundColor: theme.sidebar }}>
            <ThemeCustomizer theme={theme} onChange={setTheme} />
            {folders && (
              <TreeNavigation
                folder={folders}
                expandedFolders={expandedFolders}
                selectedPath={selectedPath}
                onToggleFolder={handleToggleFolder}
                onSelectItem={handleSelectItem}
                onFolderSelect={setSelectedPath}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onRename={handleRename}
                onAddFolder={handleAddFolder}
                onAddDocument={handleAddDocument}
                onChangeIcon={handleChangeIcon}
                showDeleted={showDeleted}
              />
            )}
          </aside>
        )}
        <main className="flex-1 overflow-hidden bg-white">
          {selectedPath ? (
            <Editor
              content={currentContent}
              onChange={handleContentChange}
              onSave={handleSave}
              hasUnsavedChanges={hasUnsavedChanges}
              theme={theme}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a document to start editing
            </div>
          )}
        </main>
      </div>
    </div>
  );
}