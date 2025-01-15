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

  // State quản lý thư mục và giao diện
  const [folders, setFolders] = useState<FolderType | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | boolean>(false);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  // Chủ đề giao diện
  const [theme, setTheme] = useState<Theme>({
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    sidebar: '#f3f4f6',
  });

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(
        `folders/${nameFolder}/${owner}`
      );
      setFolders(response.data);
    } catch (error) {
      toast.error('Failed to load folders.');
    }
  };

  const handleSelectItem = (item: FolderType) => {
    if (item.isFile) {
      setSelectedPath(item.path);
      setCurrentContent(item.content || '');
    } else {
      setSelectedPath(false);
    }
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!selectedPath) return;
    try {
      await AxiosInstance.post('folders/save', {
        path: selectedPath,
        content: currentContent,
      });
      setHasUnsavedChanges(false);
      toast.success('Document saved.');
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
      await AxiosInstance.post('folders/delete', { path });
      toast.success('Deleted successfully.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to delete.');
    }
  };

  const handleRestore = async (path: string) => {
    try {
      await AxiosInstance.post('folders/restore', { path });
      toast.success('Restored successfully.');
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
      toast.success('Folder created.');
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
      toast.success('Document created.');
      loadFolders();
    } catch (error) {
      toast.error('Failed to create document.');
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      style={{ backgroundColor: theme.background }}
    >
      <Header
        onNewFolder={() => handleAddFolder(selectedPath || `/${owner}`)}
        onNewDocument={() => handleAddDocument(selectedPath || `/${owner}`)}
        selectedPath={selectedPath}
        onToggleTrash={() => setShowDeleted(!showDeleted)}
        showTrash={showDeleted}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className="w-64 bg-white border-r overflow-y-auto"
          style={{ backgroundColor: theme.sidebar }}
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
            />
          )}
        </aside>
        <main className="flex-1 bg-white">
          {selectedPath && selectedPath !== false && !showDeleted ? (
            <Editor
              content={currentContent}
              onChange={handleContentChange}
              onSave={handleSave}
              hasUnsavedChanges={hasUnsavedChanges}
              theme={theme}
            />
          ) : showDeleted ? (
            <div>Show deleted items</div>
          ) : (
            <div className="text-center mt-20">Select a document to edit</div>
          )}
        </main>
      </div>
    </div>
  );
}
