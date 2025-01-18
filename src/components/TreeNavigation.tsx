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
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [tempName, setTempName] = useState<string>('');

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
        className={`group flex items-center gap-1 px-2 py-1 relative transition-transform duration-200 hover:scale-105 hover:bg-gray-100`}
        onContextMenu={(e) =>
          handleContextMenu(e, item.path, item.isFile, item.deleted, item.icon)
        }
        onClick={() => {
          if (!item.isFile) {
            setIsExpanded(!isExpanded);
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
            className="p-1 transition-transform duration-200 hover:scale-110"
          >
            <i
              className={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}`}
            />
          </button>
        )}

        {/* Icon của mục */}
        <i
          className={`bi ${item.icon} mr-0 transition-transform duration-200 group-hover:scale-110`}
        />

        {/* Tên mục */}
        {isEditing ? (
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
              className="w-full px-1 py-0.5 text-sm border rounded transition-all duration-200 focus:ring focus:ring-blue-300"
            />
          </form>
        ) : (
          <span
            className={`flex-1 text-sm ${selectedPath === item.path ? 'font-semibold text-blue-600' : 'text-gray-800'}`}
          >
            {item.name}
          </span>
        )}
      </div>
    );
  };

  // Render children (đệ quy)
  const renderChildren = () => {
    if (!folder.children || !isExpanded) return null;

    return Object.values(folder.children)
      .filter((child) => (showDeleted ? child.deleted : !child.deleted))
      .map((child) => (
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
      ));
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
            onAddFolder(contextMenu.path);
            setContextMenu(null);
          }}
          onAddDocument={() => {
            onAddDocument(contextMenu.path);
            setContextMenu(null);
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
