import React, { useState, useEffect } from 'react';
import { ContextMenu } from './ContextMenu';
import { FolderType } from '../types';
import * as Bi from 'react-icons/bi';
import * as Fi from 'react-icons/fi';
import * as Hi from 'react-icons/hi';
import * as Ai from 'react-icons/ai';
import * as Fa from 'react-icons/fa';
import * as Md from 'react-icons/md';

interface ContextMenuState {
  x: number;
  y: number;
  isVisible: boolean;
  path: string;
  isFile: boolean;
  currentIcon?: string;
  deleted: boolean;
}

interface TreeNavigationProps {
  folder: FolderType;
  selectedPath: string | null;
  onToggleFolder: (path: string) => void;
  onSelectItem: (item: FolderType) => void;
  onRemove: (path: string, isFile: boolean) => void;
  onRestore: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  onAddFolder: (parentPath: string, name: string) => void;
  onAddDocument: (parentPath: string, name: string) => void;
  onChangeIcon: (path: string, icon: string) => void;
  onDelete: (path: string) => void;
  viewMode: 'editor' | 'corkboard' | 'trash' | 'document';
  level?: number;
}

const ICON_COMPONENTS: { [key: string]: any } = {
  bi: Bi,
  fi: Fi,
  hi: Hi,
  ai: Ai,
  fa: Fa,
  md: Md,
};

export function TreeNavigation({
  folder,
  selectedPath,
  onToggleFolder,
  onSelectItem,
  onRemove,
  onRestore,
  onRename,
  onAddFolder,
  onAddDocument,
  onChangeIcon,
  onDelete,
  viewMode,
  level = 0,
}: TreeNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [tempItem, setTempItem] = useState<{
    path: string;
    type: 'folder' | 'document';
  } | null>(null);
  const [tempName, setTempName] = useState('');
  const [localFolder, setLocalFolder] = useState(folder);

  useEffect(() => {
    setLocalFolder(folder);
  }, [folder]);

  const handleContextMenu = (
    e: React.MouseEvent,
    path: string,
    isFile: boolean,
    deleted: boolean,
    currentIcon?: string
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

  const handleIconChange = (iconName: string) => {
    if (contextMenu) {
      onChangeIcon(contextMenu.path, iconName);
      setLocalFolder((prev) => ({
        ...prev,
        icon: iconName,
      }));
    }
  };

  const handleRenameSubmit = (e: React.FormEvent, path: string) => {
    e.preventDefault();
    if (tempName.trim()) {
      onRename(path, tempName.trim());
    }
    setEditingPath(null);
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName || typeof iconName !== 'string') {
      return null;
    }

    try {
      const parts = iconName.split(' ');
      if (parts.length < 2) return null;

      const prefix = parts[0];
      const name = parts[1].replace('bi-', ''); // Remove 'bi-' prefix if it exists
      const set = prefix.split('-')[0]; // Get icon set (bi, fi, etc.)

      if (!ICON_COMPONENTS[set]) {
        // Fallback to using Bootstrap Icons class
        return <i className={iconName} />;
      }

      // Convert kebab case to pascal case for React component name
      const componentName = name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      const IconComponent = ICON_COMPONENTS[set][componentName];
      if (IconComponent) {
        return <IconComponent className="w-4 h-4" />;
      }

      // Fallback to using Bootstrap Icons class if React component not found
      return <i className={iconName} />;
    } catch (error) {
      console.error('Error rendering icon:', error);
      // Fallback to using Bootstrap Icons class on error
      return <i className={iconName} />;
    }
  };

  const renderItem = (item: FolderType) => {
    if (viewMode !== 'trash' && item?.deleted) return null;

    const isEditing = editingPath === item?.path;
    const isSelected = selectedPath === item?.path;

    return (
      <div
        key={item?.path}
        className={`
          group flex items-center gap-2 relative
          min-h-[28px] 
          transition-all duration-200 ease-in-out
          hover:bg-gray-100/70 dark:hover:bg-gray-800/30
          ${isSelected ? 'bg-blue-50/80 dark:bg-blue-900/20' : ''}
          ${
            level > 0
              ? 'ml-6 before:content-[""] before:absolute before:left-[-1rem] before:top-[14px] before:w-4 before:h-px before:bg-gray-300'
              : 'px-2'
          }
        `}
        style={{ backdropFilter: 'blur(8px)' }}
        onContextMenu={(e) =>
          handleContextMenu(
            e,
            item?.path,
            item?.isFile,
            item?.deleted,
            item?.icon
          )
        }
        onClick={() => {
          if (!item?.isFile) {
            onToggleFolder(item?.path);
          }
          onSelectItem(item);
        }}
      >
        {/* Folder expand/collapse button */}
        {!item?.isFile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`
              flex items-center justify-center
              w-4 h-4 rounded-sm
              transition-all duration-200
              hover:bg-gray-200/70 dark:hover:bg-gray-700/30
              ${isExpanded ? 'rotate-90 transform' : ''}
            `}
          >
            <i className="bi bi-chevron-right text-[10px] text-gray-400 dark:text-gray-500" />
          </button>
        )}

        {/* Icon */}
        <div
          className={`
            w-5 h-5 flex items-center justify-center
            transition-all duration-200
            ${item?.isFile ? 'text-blue-500/90 dark:text-blue-400/90' : 'text-amber-500/90 dark:text-amber-400/90'}
          `}
        >
          {renderIcon(item?.icon) || (
            <i
              className={`bi ${
                item?.isFile
                  ? 'bi-file-earmark-text'
                  : isExpanded
                    ? 'bi-folder2-open'
                    : 'bi-folder2'
              }`}
            />
          )}
        </div>

        {/* Name/Edit input */}
        {isEditing ? (
          <form
            className="flex-1"
            onSubmit={(e) => handleRenameSubmit(e, item?.path)}
          >
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={editingName}
              autoFocus
              className="
                w-full px-2 py-1 text-sm
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400/30
                transition-all duration-200
              "
              onBlur={() => setEditingPath(null)}
            />
          </form>
        ) : (
          <span
            className="
              flex-1 text-sm px-1 py-1
              text-gray-700 dark:text-gray-200
              truncate transition-colors duration-200
            "
          >
            {item?.name}
          </span>
        )}
      </div>
    );
  };

  const renderChildren = () => {
    if (!isExpanded) return null;

    const children = Object.values(folder?.children || {}).filter((child) =>
      viewMode === 'trash' ? child.deleted : !child.deleted
    );

    return (
      <div
        className={`
          transition-all duration-300 ease-in-out relative
          ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}
          ${level > 0 ? 'border-l border-gray-300 dark:border-gray-600 ml-6' : ''}
        `}
      >
        {children.map((child) => (
          <TreeNavigation
            key={child?.path}
            folder={child}
            selectedPath={selectedPath}
            onToggleFolder={onToggleFolder}
            onSelectItem={onSelectItem}
            onRename={onRename}
            onAddFolder={onAddFolder}
            onAddDocument={onAddDocument}
            onRemove={onRemove}
            onRestore={onRestore}
            viewMode={viewMode}
            onChangeIcon={onChangeIcon}
            onDelete={onDelete}
            level={level + 1}
          />
        ))}

        {/* Luôn hiển thị input khi tempItem được set */}
        {tempItem?.path === folder?.path && (
          <div
            className={`
              flex items-center gap-2 relative
              min-h-[28px] mx-1
              ${
                level > 0
                  ? 'ml-3 pl-3 before:content-[""] before:absolute before:left-0 before:top-[14px] before:w-[10px] before:h-px before:bg-gray-300'
                  : 'px-2'
              }
            `}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center ${
                tempItem?.type === 'folder'
                  ? 'text-amber-500/90'
                  : 'text-blue-500/90'
              }`}
            >
              <i
                className={`bi ${
                  tempItem?.type === 'folder'
                    ? 'bi-folder2'
                    : 'bi-file-earmark-text'
                }`}
              />
            </div>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={`New ${tempItem?.type}`}
              autoFocus
              onBlur={() => {
                if (tempName.trim()) {
                  if (tempItem?.type === 'folder') {
                    onAddFolder(folder.path, tempName.trim());
                  } else {
                    onAddDocument(folder.path, tempName.trim());
                  }
                }
                setTempItem(null);
                setTempName('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tempName.trim()) {
                  if (tempItem?.type === 'folder') {
                    onAddFolder(folder.path, tempName.trim());
                  } else {
                    onAddDocument(folder.path, tempName.trim());
                  }
                  setTempItem(null);
                  setTempName('');
                } else if (e.key === 'Escape') {
                  setTempItem(null);
                  setTempName('');
                }
              }}
              className="
                flex-1 px-2 py-1 text-sm
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400/30
                transition-all duration-200
              "
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="select-none">
      {renderItem(localFolder)}
      {renderChildren()}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isFolder={!contextMenu.isFile}
          deleted={contextMenu.deleted}
          currentIcon={contextMenu.currentIcon}
          onClose={() => setContextMenu(null)}
          onAddFolder={() => {
            setTempItem({ path: folder.path, type: 'folder' });
          }}
          onAddDocument={() => {
            setTempItem({ path: folder.path, type: 'document' });
          }}
          onRemove={() => {
            onRemove(contextMenu.path, contextMenu.isFile);
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
          onChangeIcon={handleIconChange}
          onDelete={() => {
            onDelete(contextMenu.path);
            setContextMenu(null);
          }}
        />
      )}
    </div>
  );
}
