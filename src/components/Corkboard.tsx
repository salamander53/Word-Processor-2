import React, { useState } from 'react';
import { FolderType } from '../types';
import { TreeNavigation } from './TreeNavigation';

interface CorkboardProps {
  items: Record<string, FolderType>;
  onSelectNote: (selectedNotePath: string, isDoubleClick: boolean) => void;
  onSelectItem: (item: FolderType) => void;
}

export function Corkboard({
  items,
  onSelectNote,
  onSelectItem,
}: CorkboardProps) {
  const [selectedNote, setSelectedNote] = useState<string>();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const findSpecificFile = (folder) => {
    if (!folder.children) return ''; // Nếu không có con, trả về chuỗi rỗng.

    // Lấy danh sách các con là file.
    const files = Object.values(folder.children).filter(
      (child) => child?.isFile
    );

    // Tìm tài liệu có tên "Readme".
    const readmeFile = files.find(
      (file) => file?.name.toLowerCase() === 'readme'
    );

    // Nếu có "Readme", trả về nó.
    if (readmeFile) {
      return readmeFile.content || '';
    }

    // Nếu không có "Readme", trả về file đầu tiên.
    if (files.length > 0) {
      return files[0].content || '';
    }

    // Nếu không có file nào, trả về chuỗi rỗng.
    return '';
  };

  return (
    <div className="p-5 bg-white min-h-full overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          ? Object.values(items).map((item) => (
              <div
                key={item.path}
                onClick={() => {
                  setSelectedNote(item.path);
                  onSelectNote(item.path, false);
                }}
                onDoubleClick={() => onSelectNote(item.path, true)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative bg-white shadow-lg border-1 border-gray-200 
                  transition-all duration-300 cursor-pointer 
                  ${selectedNote === item.path && 'border-blue-600 '}
                  hover:scale-125 hover:shadow-2xl hover:z-10`}
                style={{
                  minHeight: '250px',
                  maxHeight: '250px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative', // Quan trọng để z-index hoạt động
                }}
              >
                {/* Card Header */}
                <div
                  className={`flex justify-start border-b-2 bg-gray-50 px-2 transition-all duration-300 ${
                    hoveredItem === item.path
                      ? 'opacity-0 h-0'
                      : 'opacity-100 h-auto'
                  }`}
                >
                  <i className={`bi ${item.icon}`} />
                  <h3 className="ms-2 font-medium text-sm mb-2 truncate">
                    {item.name}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="flex-grow overflow-hidden overflow-y-auto">
                  {item.isFile &&
                    (hoveredItem === item.path ? (
                      <div
                        className="  text-xs text-ellipsis"
                        dangerouslySetInnerHTML={{
                          __html: item.content, // Lấy 500 ký tự đầu tiên
                        }}
                      />
                    ) : (
                      <p className={`text-xs text-dark`}>
                        <label className="text-gray-300"># Summary</label>
                        <br />
                        {item.summary}
                      </p>
                    ))}
                  {!item.isFile && (
                    <div>
                      <div
                        className="text-xs"
                        dangerouslySetInnerHTML={{
                          __html: findSpecificFile(item), // Lấy 500 ký tự đầu tiên
                        }}
                      ></div>
                      <hr></hr>
                      <TreeNavigation
                        folder={item}
                        onSelectItem={onSelectItem}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          : 'Create Documents/Subfolders'}
      </div>
    </div>
  );
}
