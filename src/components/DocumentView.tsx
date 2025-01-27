import React, { useState, useEffect } from 'react';
import { FolderType } from '../types';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface DocumentViewProps {
  folders: FolderType | null;
  onSelectItem: (item: FolderType) => void;
  onChange: (path: string, content: string) => void;
}

export function DocumentView({
  folders,
  onSelectItem,
  onChange,
}: DocumentViewProps) {
  const [mergedContent, setMergedContent] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<FolderType | null>(null);

  // Hàm để hợp nhất nội dung của các file trong thư mục
  const mergeFilesContent = (folder: FolderType) => {
    let content = '';
    if (folder.children) {
      Object.values(folder.children).forEach((child) => {
        if (child.isFile) {
          content += `<h2>${child.name}</h2>${child.content || ''}<br/><br/>`;
        }
      });
    }
    return content;
  };

  // Khi folders thay đổi, cập nhật nội dung hợp nhất
  useEffect(() => {
    if (folders) {
      const content = mergeFilesContent(folders);
      setMergedContent(content);
    }
  }, [folders]);

  // Xử lý khi người dùng chỉnh sửa nội dung
  const handleEditorChange = (content: string) => {
    if (currentFile) {
      // Cập nhật nội dung của file hiện tại
      onChange(currentFile.path, content);
    }
  };

  // Xác định file hiện tại dựa trên vị trí con trỏ
  const handleCursorChange = (event: any) => {
    const editor = event.editor;
    const cursorPosition = editor.selection.getCursor();
    const content = editor.getContent({ format: 'html' });

    // Tìm file tương ứng với vị trí con trỏ
    if (folders && folders.children) {
      let accumulatedLength = 0;
      for (const child of Object.values(folders.children)) {
        if (child.isFile) {
          const fileContent = `<h2>${child.name}</h2>${child.content || ''}<br/><br/>`;
          const fileLength = fileContent.length;

          if (
            cursorPosition >= accumulatedLength &&
            cursorPosition <= accumulatedLength + fileLength
          ) {
            setCurrentFile(child);
            break;
          }
          accumulatedLength += fileLength;
        }
      }
    }
  };

  return (
    <div className="p-5 bg-white min-h-full overflow-y-auto">
      <TinyMCEEditor
        apiKey="xc6hl4z7bo1bq9eq02dokdrqz3dlczy2d2a0p2jk2vztzsco"
        init={{
          height: '100%',
          menubar: false,
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
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              color: #1f2937;
              background-color: #ffffff;
            }
          `,
        }}
        value={mergedContent}
        onEditorChange={handleEditorChange}
        onCursorChange={handleCursorChange}
      />
    </div>
  );
}
