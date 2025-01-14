import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
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
  showDeleted?: boolean;
}

interface ContextMenuState {
  x: number;
  y: number;
  isVisible: boolean;
  path: string;
  isFile: boolean;
  currentIcon?: string;
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
  // const location = useLocation
  const isExpanded = expandedFolders.has(folder.path);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleContextMenu = (
    e: React.MouseEvent,
    path: string,
    isFile: boolean,
    currentIcon?: string
  ) => {
    e.preventDefault();
    if (showDeleted) return;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isVisible: true,
      path,
      isFile,
      currentIcon
    });
  };

  const handleRenameSubmit = (path: string) => {
    if (editingName.trim()) {
      onRename(path, editingName.trim());
      setEditingPath(null);
      setEditingName('');
    }
  };

  const renderItem = (item: FolderType) => {
    const isEditing = editingPath === item.path;

    return (
      <div
        key={item.path}
        className="group flex items-center gap-1 px-2 py-1 hover:bg-gray-100 relative"
        onContextMenu={(e) => handleContextMenu(e, item.path, item.isFile, item.icon)}
      >
        {!item.isFile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFolder(item.path);
              onFolderSelect(item.path);
            }}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        
        <i className={`${item.icon || (item.isFile ? 'bi-file-earmark-text' : 'bi-folder')} mr-1`} />
        
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
              className="w-full px-1 py-0.5 text-sm border rounded"
            />
          </form>
        ) : (
          <span
            className={`flex-1 text-sm cursor-pointer ${
              selectedPath === item.path ? 'font-semibold' : ''
            }`}
            onClick={() => item.isFile && onSelectItem(item.path)}
          >
            {item.name}
          </span>
        )}
      </div>
    );
  };

  const renderChildren = () => {
    if (!folder.children) return null;
    return Object.values(folder.children).map((child) => {
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