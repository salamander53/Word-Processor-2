import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
// import { Save } from 'lucide-react';
import { FolderType, Theme } from '../types';

interface EditorProps {
  currentFolder: FolderType | null;
  onChange: (content: string) => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  theme: Theme;
}

export function Editor({
  currentFolder,
  onChange,
  onSave,
  hasUnsavedChanges,
  theme,
}: EditorProps) {
  return (
    <div className="flex flex-col h-full relative">
      {/* Floating save button */}
      <button
        onClick={onSave}
        disabled={!hasUnsavedChanges}
        className={`absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1.5 rounded-md shadow-sm ${
          hasUnsavedChanges
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        style={{
          backgroundColor: hasUnsavedChanges ? theme.primary : undefined,
        }}
      >
        {/* <Save className="w-4 h-4" /> */}
        <i className="bi bi-floppy w-4 h-4"></i>
        {hasUnsavedChanges && <span className="text-sm">Save</span>}
      </button>

      <TinyMCEEditor
        apiKey="xc6hl4z7bo1bq9eq02dokdrqz3dlczy2d2a0p2jk2vztzsco"
        init={{
          height: '100%',
          menubar: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          // content_style: `
          //   body {
          //     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          //     font-size: 16px;
          //     color: ${theme.text};
          //     background-color: ${theme.background};
          //   }
          // `,
          content_style: `
                body {
                    background: #fff;
                }

                @media (min-width: 840px) {
                    html {
                        background: #eceef4;
                        min-height: 100%;
                        padding: 0 .5rem
                    }

                    body {
                        background-color: #fff;
                        box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                        box-sizing: border-box;
                        margin: 1rem auto 0;
                        max-width: 820px;
                        min-height: calc(100vh - 1rem);
                        padding:4rem 6rem 6rem 6rem
                    }
                }
            `,
        }}
        value={currentFolder?.content || ''}
        onEditorChange={onChange}
      />
    </div>
  );
}
