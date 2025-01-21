import React, { useState } from 'react';
import { ContextMenu } from './ContextMenu';
import { FolderType } from '../types';
import { IconPicker } from './IconPicker';

interface TreeNavigationProps {
  folder: FolderType;
  //   expandedFolders: Set<string>;
  selectedPath: string | null;
  onToggleFolder: (path: string) => void;
  onSelectItem: (item: FolderType) => void;
  //   onFolderSelect: (path: string) => void;
  onDelete: (path: string, isFile: boolean) => void;
  onRestore: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  onAddFolder: (parentPath: string) => void;
  onAddDocument: (parentPath: string) => void;
  onChangeIcon: (path: string, icon: string) => void;
  showDeleted?: boolean; // Hiển thị các mục bị xóa nếu true
}

interface ContextMenuState {
  x: number;
  y: number;
  isVisible: boolean;
  path: string;
  isFile: boolean;
  currentIcon?: string;
  deleted: boolean;
}

export function TreeNavigation({
  folder,
  //   expandedFolders,
  selectedPath,
  onToggleFolder,
  onSelectItem,
  //   onFolderSelect,
  onDelete,
  onRestore,
  onRename,
  onAddFolder,
  onAddDocument,
  onChangeIcon,
  showDeleted = false,
}: TreeNavigationProps) {
  //   const isExpanded = expandedFolders.has(folder?.path);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [tempItem, setTempItem] = useState<{
    path: string;
    type: 'folder' | 'document';
  } | null>(null);
  const [tempName, setTempName] = useState('');

  // Mở context menu
  // Mở context menu
  const handleContextMenu = (
    e: React.MouseEvent,
    path: string,
    isFile: boolean,
    deleted: boolean,
    currentIcon?: string // Đặt tham số tùy chọn ở cuối
  ) => {
    e.preventDefault();
    setContextMenu(null);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isVisible: true,
      path,
      isFile,
      currentIcon,
      deleted,
    });
    setTempName('');
  };

  // Nộp tên chỉnh sửa
  const handleRenameSubmit = (e: React.FormEvent, path: string) => {
    e.preventDefault();
    if (tempName.trim()) {
      onRename(path, tempName.trim());
    }
    setEditingPath(null);
  };
  // Render một mục (folder/file)
  const renderItem = (item: FolderType) => {
    if (!showDeleted && item.deleted) return null; // Không render nếu bị xóa và không yêu cầu hiển thị

    const isEditing = editingPath === item.path;

    return (
      <div
        key={item.path}
        className={`${selectedPath === item.path ? 'font-semibold border-1 border-blue-700 bg-blue-200' : 'text-gray-800'} group flex items-center gap-0.5 px-1 py-0.5 relative transition-transform duration-200 hover:scale-105 ${selectedPath === item.path ? '' : 'hover:bg-gray-100'}`}
        onContextMenu={(e) =>
          handleContextMenu(e, item.path, item.isFile, item.deleted, item.icon)
        }
        onClick={() => {
          if (!item.isFile) {
            // setIsExpanded(!isExpanded);
            onToggleFolder(item.path);
          }
          onSelectItem(item);
        }}
      >
        {/* Nút mở rộng/thu gọn cho thư mục */}
        {!item.isFile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 transition-transform duration-200 hover:scale-110"
          >
            <i
              className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} text-xs`}
            />
          </button>
        )}

        {/* Icon của mục */}
        <i
          className={`bi ${item.icon} mr-0 transition-transform duration-200 group-hover:scale-110 text-xs`}
        />

        {/* Tên mục */}
        {isEditing && editingPath === item.path ? (
          <form
            className="flex-1"
            onSubmit={(e) => handleRenameSubmit(e, item.path)}
          >
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={editingName}
              autoFocus
              className="w-full px-1 py-0.5 text-xs border rounded transition-all duration-200 focus:ring focus:ring-blue-300"
              onBlur={() => {
                setEditingPath(null); // Tắt chế độ chỉnh sửa nếu mất focus
              }}
            />
          </form>
        ) : (
          <span className={`flex-1 text-xs px-1 py-0.5 rounded`}>
            {item.name}
          </span>
        )}
      </div>
    );
  };

  // Render children (đệ quy)
  const renderChildren = () => {
    if (!isExpanded) return null;
    const children = Object.values(folder.children || {}).filter((child) =>
      showDeleted ? child.deleted : !child.deleted
    );

    return (
      <>
        {children.map((child) => (
          <TreeNavigation
            key={child.path}
            folder={child}
            selectedPath={selectedPath}
            onToggleFolder={onToggleFolder}
            onSelectItem={onSelectItem}
            onRename={onRename}
            onAddFolder={onAddFolder}
            onAddDocument={onAddDocument}
            onDelete={onDelete}
            onRestore={onRestore}
            showDeleted={showDeleted}
            onChangeIcon={onChangeIcon}
          />
        ))}

        {/* Hiển thị item tạm thời */}
        {tempItem?.path === folder.path && (
          <div className="flex items-center px-2 py-1">
            <i
              className={`bi ${tempItem.type === 'folder' ? 'bi-folder' : 'bi-file-earmark-text'} mr-2 transition-transform duration-200 group-hover:scale-110 text-xs`}
            />
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={`Enter ${tempItem.type === 'folder' ? 'folder' : 'document'} name`}
              autoFocus
              onBlur={() => setTempItem(null)} // Xóa item tạm thời nếu mất focus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tempName.trim()) {
                  if (tempItem.type === 'folder') {
                    onAddFolder(folder.path, tempName.trim());
                  } else {
                    onAddDocument(folder.path, tempName.trim());
                  }
                  setTempItem(null); // Xóa item tạm thời sau khi thêm
                  setTempName('');
                }
              }}
              className="w-full px-2 py-1 focus:ring focus:ring-blue-300"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="select-none">
      {renderItem(folder)}
      {/* {showIconPicker && (
        <IconPicker
          currentIcon={folder.icon}
          onSelect={(iconName) => {
            onChangeIcon(folder.path, iconName); // Gọi API thay đổi icon
            setShowIconPicker(false); // Đóng picker
          }}
        />
      )} */}
      <div className="ml-4">{renderChildren()}</div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isFolder={!contextMenu.isFile}
          deleted={contextMenu.deleted}
          onClose={() => setContextMenu(null)}
          onAddFolder={() => {
            setTempItem({ path: folder.path, type: 'folder' });
          }}
          onAddDocument={() => {
            setTempItem({ path: folder.path, type: 'document' });
          }}
          onDelete={() => {
            onDelete(contextMenu.path, contextMenu.isFile);
            setContextMenu(null);
          }}
          onRestore={() => {
            onRestore(contextMenu.path);
            setContextMenu(null);
          }}
          onRename={() => {
            setEditingPath(contextMenu.path);
            setEditingName(folder.name);
            setContextMenu(null);
          }}
          onChangeIcon={(iconName) => {
            const selectedPath = contextMenu.path;
            onChangeIcon(selectedPath, iconName); // Gọi `onChangeIcon`
            setContextMenu(null);
          }}
        />
      )}
    </div>
  );
}
