import React from 'react';
import { File, Folder, ChevronRight } from 'lucide-react';
import { FolderType } from '../types';

interface CorkboardProps {
  items: Record<string, FolderType>;
  onSelect: (item: FolderType) => void;
  onDoubleClick: (path: string) => void;
  selectedPath: string | null;
}

export function Corkboard({
  items,
  onSelect,
  onDoubleClick,
  selectedPath,
}: CorkboardProps) {
  return (
    <div className="p-5 bg-white min-h-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          ? Object.values(items).map((item) => (
              <div
                key={item.path}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onDoubleClick(item.path)}
                className={`
              relative bg-white shadow-lg border-2 border-gray-200 
              hover:shadow-md transition-all duration-200 cursor-pointer
              ${selectedPath === item.path ? 'ring-2 ring-blue-500' : ''}
              transform hover:-translate-y-0.5 p-2
            `}
                style={{
                  minWidth: '150px',
                  minHeight: '200px',
                  maxHeight: '300px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Card Header */}
                <div className="flex justify-start">
                  <i className={`bi ${item.icon}`} />
                  <h3 className="ms-2 font-medium text-sm mb-2 truncate">
                    {item.name}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="flex-grow overflow-hidden">
                  {item.isFile && item.content && (
                    <p className="text-gray-500 font-thin text-xs overflow-hidden text-ellipsis">
                      {item.content.substring(0, 500)}...
                    </p>
                  )}
                  {!item.isFile && (
                    <div className="text-gray-500">
                      <span>
                        {Object.keys(item.children || {}).length} items
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-2 text-gray-500 text-xs">
                  <div className="flex items-center justify-between">
                    <span>{item.isFile ? 'Document' : 'Folder'}</span>
                    <span>•</span>
                    <span>Modified 2h ago</span>
                  </div>
                </div>
              </div>
            ))
          : 'Create Documents/Subfolders'}
      </div>
    </div>
  );
}
