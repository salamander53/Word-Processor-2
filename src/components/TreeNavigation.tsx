import React, { useState } from 'react';
import { ContextMenu } from './ContextMenu';
import { FolderType } from '../types';

interface TreeNavigationProps {
  folder: FolderType;
  expandedFolders: Set<string>;
  selectedPath: string | null;
  onToggleFolder: (path: string) => void;
  onSelectItem: (path: string) => void;
  onFolderSelect: (path: string) => void;
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
  expandedFolders,
  selectedPath,
  onToggleFolder,
  onSelectItem,
  onFolderSelect,
  onDelete,
  onRestore,
  onRename,
  onAddFolder,
  onAddDocument,
  onChangeIcon,
  showDeleted = false,
}: TreeNavigationProps) {
  const isExpanded = expandedFolders.has(folder.path);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Mở context menu
  const handleContextMenu = (
    e: React.MouseEvent,
    path: string,
    isFile: boolean,
    deleted: boolean,
    currentIcon?: string // Đặt tham số tùy chọn ở cuối
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isVisible: true,
      path,
      isFile,
      currentIcon,
      deleted,
    });
  };
  
  

  // Nộp tên chỉnh sửa
  const handleRenameSubmit = (path: string) => {
    if (editingName.trim()) {
      onRename(path, editingName.trim());
      setEditingPath(null);
      setEditingName('');
    }
  };

  // Render một mục (folder/file)
  const renderItem = (item: FolderType) => {
    if (!showDeleted && item.deleted) return null; // Không render nếu bị xóa và không yêu cầu hiển thị

    const isEditing = editingPath === item.path;

    return (
      <div
        key={item.path}
        className={`group flex items-center gap-1 px-2 py-1 relative transition-transform duration-200 hover:scale-105 hover:bg-gray-100`}
        onContextMenu={(e) => handleContextMenu(e, item.path, item.isFile, item.deleted, item.icon)}
      >
        {!item.isFile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFolder(item.path);
              onFolderSelect(item.path);
            }}
            className="p-1 transition-transform duration-200 hover:scale-110"
          >
            {isExpanded ? (
              <i className="bi bi-chevron-down w-4 h-4"></i>
            ) : (
              <i className="bi bi-chevron-right w-4 h-4"></i>
            )}
          </button>
        )}
    
        <i className={`${item.icon || (item.isFile ? 'bi-file-earmark-text' : 'bi-folder')} mr-1 transition-transform duration-200 group-hover:scale-110`} />
    
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRenameSubmit(item.path);
            }}
            className="flex-1"
          >
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => handleRenameSubmit(item.path)}
              autoFocus
              className="w-full px-1 py-0.5 text-sm border rounded transition-all duration-200 focus:ring focus:ring-blue-300"
            />
          </form>
        ) : (
          <span
            className={`flex-1 text-sm cursor-pointer transition-colors duration-200 ${
              selectedPath === item.path ? 'font-semibold text-blue-600' : 'text-gray-800'
            }`}
            onClick={() => item.isFile && onSelectItem(item.path)}
          >
            {item.name}
          </span>
        )}
      </div>
    );
  };

  // Render children (đệ quy)
  const renderChildren = () => {
    if (!folder.children) return null;
  
    return Object.values(folder.children)
      .filter((child) => {
        if (showDeleted) {
          // Hiển thị mục bị xóa nếu showDeleted
          return child.deleted;
        }
        // Mặc định hiển thị mục chưa bị xóa
        return !child.deleted;
      })
      .map((child) => {
        if (!child.isFile && child.children) {
          return (
            <TreeNavigation
              key={child.path}
              folder={child}
              expandedFolders={expandedFolders}
              selectedPath={selectedPath}
              onToggleFolder={onToggleFolder}
              onSelectItem={onSelectItem}
              onFolderSelect={onFolderSelect}
              onDelete={onDelete}
              onRestore={onRestore}
              onRename={onRename}
              onAddFolder={onAddFolder}
              onAddDocument={onAddDocument}
              onChangeIcon={onChangeIcon}
              showDeleted={showDeleted}
            />
          );
        }
        return renderItem(child);
      });
  };
  

  return (
    <div className="select-none">
      {renderItem(folder)}
      {isExpanded && <div className="ml-4">{renderChildren()}</div>}

      {contextMenu?.isVisible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isFolder={!contextMenu.isFile}
          currentIcon={contextMenu.currentIcon}
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
          onRestore={()=>{
            onRestore(contextMenu.path)
            setContextMenu(null)
          }}
          onRename={() => {
            setEditingPath(contextMenu.path);
            setEditingName(folder.name);
            setContextMenu(null);
          }}
          onChangeIcon={(icon) => {
            onChangeIcon(contextMenu.path, icon);
            setContextMenu(null);
          }}
        />
      )}
    </div>
  );
}
