import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HexColorPicker } from 'react-colorful';
import { Theme } from '../types';

interface ThemeCustomizerProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeCustomizer({ theme, onChange }: ThemeCustomizerProps) {
  const [currentColor, setCurrentColor] = React.useState<keyof Theme>('primary');

  const handleColorChange = (color: string) => {
    onChange({
      ...theme,
      [currentColor]: color,
    });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
          Customize Theme
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-96">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Customize Theme
          </Dialog.Title>
          <div className="space-y-4">
            <div className="flex gap-2">
              {Object.keys(theme).map((key) => (
                <button
                  key={key}
                  onClick={() => setCurrentColor(key as keyof Theme)}
                  className={`px-3 py-1 rounded ${
                    currentColor === key ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            <HexColorPicker
              color={theme[currentColor]}
              onChange={handleColorChange}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}