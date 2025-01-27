import React, { useState, useEffect } from 'react';
import { FolderType } from '../types';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
interface DocumentViewProps {
  items: Record<string, FolderType>;
  currentFolder: FolderType;
  onContentChange: (path: string, newContent: string) => void;
}

const getAllFiles = (folder: FolderType): FolderType[] => {
  let files: FolderType[] = [];
  if (folder.isFile) {
    files.push(folder);
  } else if (folder.children) {
    Object.values(folder.children).forEach((child) => {
      files = files.concat(getAllFiles(child));
    });
  }
  return files;
};

export function DocumentView({
  items,
  currentFolder,
  onContentChange,
}: DocumentViewProps) {
  const [combinedContent, setCombinedContent] = useState<string>('');

  // Lấy tất cả file và sắp xếp theo tên
  const files = Object.values(items || {})
    .flatMap((folder) => getAllFiles(folder))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Kết hợp nội dung các file thành một chuỗi HTML
  useEffect(() => {
    const content = files
      .map(
        (file) => `
          <div data-path="${file.path}">
            <h3>${file.name}</h3>
            <div>${file.content || ''}</div>
          </div>
          <div style="border: 1px dashed; width: 100%;height: 0px"></div>
        `
      )
      .join('');
    setCombinedContent(content);
  }, [files]);

  // Xử lý thay đổi nội dung trong Editor
  const handleEditorChange = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const fileSections = doc.querySelectorAll('.file-section');

    fileSections.forEach((section) => {
      const path = section.getAttribute('data-path');
      const contentElement = section.querySelector('.file-content');
      if (path && contentElement) {
        const newContent = contentElement.innerHTML;
        onContentChange(path, newContent); // Chỉ lưu nội dung trong .file-content
      }
    });
  };

  return (
    <div className=" bg-white  overflow-y-auto h-full relative">
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
                padding:2rem 3rem 3rem 3rem
              }
            }
          `,
        }}
        value={combinedContent}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
