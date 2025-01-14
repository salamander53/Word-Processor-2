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
  onRename: () => void;
  onChangeIcon: (icon: string) => void;
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
  onRename,
  onChangeIcon,
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
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <button
            onClick={onAddDocument}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <File className="w-4 h-4" />
            <span>New Document</span>
          </button>
          <div className="border-t border-gray-200 my-1" />
        </>
      )}
      
      <button
        onClick={onRename}
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
      >
        <Pencil className="w-4 h-4" />
        <span>Rename</span>
      </button>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <Image className="w-4 h-4" />
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
      
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-red-600"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
}