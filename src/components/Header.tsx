import React from 'react';
// import { FolderPlus, FilePlus, ChevronLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onNewFolder: () => void;
  onNewDocument: () => void;
  selectedFolderId: string;
  onToggleTrash: () => void;
  showTrash: boolean;
}

export function Header({ onNewFolder, onNewDocument, selectedFolderId, onToggleTrash, showTrash }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          {/* <ChevronLeft className="w-4 h-4" /> */}
          <i className="bi bi-arrow-left w-4 h-4"></i>
          Back to Projects
        </Link>
        <h1 className="text-xl font-semibold">Document Editor</h1>
      </div>
      <div className="flex gap-2">
        {!showTrash && (
          <>
            <button
              onClick={onNewDocument}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {/* <FilePlus className="w-4 h-4" /> */}
              <i className="bi bi-file-earmark-plus w-4 h-4"></i>
              New Document
            </button>
            <button
              onClick={onNewFolder}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {/* <FolderPlus className="w-4 h-4" /> */}
              <i className="bi bi-folder-plus w-4 h-4"></i>
              New Folder
            </button>
          </>
        )}
        <button
          onClick={onToggleTrash}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${
            showTrash
              ? 'bg-gray-200 text-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {/* <Trash2 className="w-4 h-4" /> */}
          <i className="bi bi-trash w-4 h-4"></i>
          {showTrash ? 'Back to Documents' : 'Trash'}
        </button>
      </div>
    </header>
  );
}