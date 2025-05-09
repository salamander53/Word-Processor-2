import { useEffect, useState } from 'react';
import { IconPicker } from './IconPicker';

interface ContextMenuProps {
  x: number;
  y: number;
  isFolder: boolean;
  currentIcon?: string;
  onClose: () => void;
  onAddFolder?: () => void;
  onAddDocument?: () => void;
  onRemove: () => void;
  onRestore: () => void;
  onRename: () => void;
  onChangeIcon: (icon: string) => void;
  deleted: boolean;
  onDelete: () => void;
}

export function ContextMenu({
  x,
  y,
  isFolder,
  currentIcon,
  onClose,
  onAddFolder,
  onAddDocument,
  onRemove,
  onRestore,
  onRename,
  onChangeIcon,
  deleted,
  onDelete,
}: ContextMenuProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.context-menu') && !target.closest('.icon-picker')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="context-menu fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-48 z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(${x + 192 > window.innerWidth ? -100 : 0}%, ${
          y + 250 > window.innerHeight ? -100 : 0
        }%)`,
      }}
    >
      {isFolder && !deleted && (
        <>
          <button
            onClick={() => {
              onAddFolder?.();
              onClose();
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <i className="bi bi-folder-plus w-4 h-4"></i>
            <span>New Folder</span>
          </button>
          <button
            onClick={() => {
              onAddDocument?.();
              onClose();
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <i className="bi bi-file-earmark w-4 h-4"></i>
            <span>New Document</span>
          </button>
          <div className="border-t border-gray-200 my-1" />
        </>
      )}
      <button
        onClick={onRename}
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
      >
        <i className="bi bi-pencil w-4 h-4"></i>
        <span>Rename</span>
      </button>

      <div className="relative w-full">
        <button
          onClick={() => setShowIconPicker(!showIconPicker)}
          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
        >
          <i className="bi bi-image w-4 h-4"></i>
          <span>Change Icon</span>
        </button>

        {showIconPicker && (
          <div
            className="icon-picker absolute left-full top-0 bg-white shadow-lg rounded-lg z-50"
            style={{
              marginLeft: '0.5rem',
            }}
          >
            <IconPicker
              currentIcon={currentIcon}
              onSelect={(iconName) => {
                onChangeIcon(iconName);
                setShowIconPicker(false);
                onClose();
              }}
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 my-1" />
      {deleted ? (
        <>
          <button
            onClick={onRestore}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-green-600"
          >
            <i className="bi bi-arrow-clockwise w-4 h-4"></i>
            <span>Restore</span>
          </button>
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
          >
            <i className="bi bi-trash w-4 h-4"></i>
            <span>Delete</span>
          </button>
        </>
      ) : (
        <button
          onClick={onRemove}
          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
        >
          <i className="bi bi-trash w-4 h-4"></i>
          <span>Remove</span>
        </button>
      )}
    </div>
  );
}
