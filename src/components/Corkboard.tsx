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
    <div className="p-5 bg-gray-200 min-h-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          ? Object.values(items).map((item) => (
              <div
                key={item.path}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onDoubleClick(item.path)}
                className={`
              relative bg-white shadow-sm border border-gray-200 
              hover:shadow-md transition-all duration-200 cursor-pointer
              ${selectedPath === item.path ? 'ring-2 ring-blue-500' : ''}
              transform hover:-translate-y-0.5 p-2
            `}
                style={{
                  minWidth: '150px',
                  minHeight: '200px',
                  // maxHeight: '300px',
                }}
              >
                {/* Card Header */}
                <div className="flex justify-start">
                  <i className={`bi ${item.icon}`} />
                  <h3 className="ms-2 font-medium text-sm mb-2 truncate">
                    {item.name}
                  </h3>
                  {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
                </div>

                {/* Card Content */}
                <div>
                  {item.isFile && item.content && (
                    <p className="text-gray-500 font-thin text-sm">
                      {item.content.substring(0, 300)}...
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
