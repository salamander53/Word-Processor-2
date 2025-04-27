import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TreeNavigation } from './TreeNavigation';
import { Editor } from './Editor';
import { FolderType } from '../types';
import AxiosInstance from './AxiosInstance';

export function CollectionDetail() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<FolderType | null>(null);
  const [selectedItem, setSelectedItem] = useState<FolderType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const loadCollection = async () => {
    try {
      const response = await AxiosInstance.get(`collections/${collectionId}`);
      setCollection(response.data);
    } catch (err) {
      console.error('Error loading collection:', err);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('collectionPath', collection?.path || '');

      await AxiosInstance.post('collections/upload', formData);
      await loadCollection();
    } catch (err) {
      console.error('Error uploading files:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Filter items based on search term
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/collections')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <i className="bi bi-arrow-left" />
            </button>
            <h1 className="text-xl font-semibold">{collection?.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search in collection..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* View toggle */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <i className={`bi bi-${viewMode === 'grid' ? 'list' : 'grid-3x3-gap'}`} />
            </button>

            {/* Upload */}
            <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              <i className="bi bi-upload mr-2" />
              Upload Files
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            {collection && (
              <TreeNavigation
                folder={collection}
                selectedPath={selectedItem?.path || null}
                onSelectItem={setSelectedItem}
                viewMode="editor"
              />
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedItem ? (
              selectedItem.isFile ? (
                <Editor
                  currentFolder={selectedItem}
                  onChange={() => {}}
                  onSave={() => {}}
                  hasUnsavedChanges={false}
                  theme={{
                    primary: '#3b82f6',
                    secondary: '#6b7280',
                    background: '#ffffff',
                    text: '#1f2937',
                    sidebar: '#f3f4f6',
                  }}
                />
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(selectedItem.children || {}).map((item) => (
                    <div
                      key={item.path}
                      className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <i className={`${item.icon || (item.isFile ? 'bi bi-file-text' : 'bi bi-folder')} mr-2`} />
                      {item.name}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500">
                Select an item from the sidebar to view its content
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}