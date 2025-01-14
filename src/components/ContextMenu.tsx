import React from 'react';
// import { File, FolderPlus, Pencil, Trash2, Image } from 'lucide-react';
import { IconPicker } from './IconPicker';
import * as Popover from '@radix-ui/react-popover';

interface ContextMenuProps {
  x: number;
  y: number;
  isFolder: boolean;
  currentIcon?: string;
  onClose: () => void;
  onAddFolder?: () => void;
  onAddDocument?: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onRename: () => void;
  onChangeIcon: (icon: string) => void;
  deleted: boolean;
}

export function ContextMenu({
  x,
  y,
  isFolder,
  currentIcon,
  onClose,
  onAddFolder,
  onAddDocument,
  onDelete,
  onRestore,
  onRename,
  onChangeIcon,
  deleted
}: ContextMenuProps) {
  React.useEffect(() => {
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
        }%)`
      }}
    >
      {isFolder && (
        <>
          <button
            onClick={onAddFolder}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            {/* <FolderPlus className="w-4 h-4" /> */}
            <i className="bi bi-folder-plus w-4 h-4"></i>
            <span>New Folder</span>
          </button>
          <button
            onClick={onAddDocument}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            {/* <File className="w-4 h-4" /> */}
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
        {/* <Pencil className="w-4 h-4" /> */}
        <i className="bi bi-pencil w-4 h-4"></i>
        <span>Rename</span>
      </button>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            {/* <Image className="w-4 h-4" /> */}
            <i className="bi bi-image w-4 h-4"></i>
            <span>Change Icon</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="z-[60] icon-picker">
            <IconPicker 
              onSelect={onChangeIcon} 
              isFolder={isFolder}
              currentIcon={currentIcon}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <div className="border-t border-gray-200 my-1" />
      
      {deleted ? (
        <button
          onClick={onRestore}
          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-green-600"
        >
          <i className="bi bi-arrow-clockwise w-4 h-4"></i>
          <span>Restore</span>
        </button>
      ) : (
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
        >
          <i className="bi bi-trash w-4 h-4"></i>
          <span>Delete</span>
        </button>
      )}
    </div>
  );
}