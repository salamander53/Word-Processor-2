import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onNewFolder: () => void;
  onNewDocument: () => void;
  currentFolder: any;
  onToggleTrash: () => void;
  showTrash: boolean;
  toggleNotebar: () => void;
}

export function Header({
  onNewFolder,
  onNewDocument,
  currentFolder,
  onToggleTrash,
  showTrash,
  toggleNotebar,
}: HeaderProps) {
  const getPathAsString = (path: string): string => {
    if (!path) return '';
    const pathComponents = path.split('/').filter((component) => component);
    return pathComponents.join(' > ');
  };

  const navigate = useNavigate();

  return (
    // <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
    //   <div className="flex items-center gap-4">
    //     <Link
    //       to="/"
    //       className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
    //     >
    //       <i className="bi bi-arrow-left w-4 h-4"></i>
    //       {/* Back to Projects */}
    //     </Link>
    //     <h1 className="text-md font-semibold">
    //       {getPathAsString(currentFolder?.path) || 'Word Processor'}
    //     </h1>
    //   </div>
    //   <div className="flex gap-2">
    //     {!showTrash && (
    //       <>
    //         <button
    //           onClick={onNewDocument}
    //           className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
    //         >
    //           <i className="bi bi-file-earmark-plus w-4 h-4"></i>
    //           New Document
    //         </button>
    //         <button
    //           onClick={onNewFolder}
    //           className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
    //         >
    //           <i className="bi bi-folder-plus w-4 h-4"></i>
    //           New Folder
    //         </button>
    //       </>
    //     )}
    //     <button
    //       onClick={onToggleTrash}
    //       className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${
    //         showTrash
    //           ? 'bg-gray-200 text-gray-700'
    //           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    //       }`}
    //     >
    //       <i className="bi bi-trash w-4 h-4"></i>
    //       {showTrash ? 'Back to Documents' : 'Trash'}
    //     </button>
    //   </div>
    // </header>

    <div className="bg-white border-b">
      {/* Main Toolbar */}
      <div className="flex items-center px-2 h-10 gap-2 border-b">
        {/* 1st Section */}
        <div className="flex items-center gap-2">
          {/* <RouterLink to="/" className="p-1.5 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </RouterLink> */}
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left w-4 h-4"></i>
            {/* Back to Projects */}
          </button>
          <button className="p-1.5 hover:bg-gray-100  flex items-center space-x-1 border-l">
            <i
              className="bi bi-search  text-gray-600"
              onClick={() => {
                console.log('hello');
              }}
            />
            <span className="border-l-2 border-gray-400 h-4"></span>
            <i
              className="bi bi-caret-down-fill  text-gray-600"
              onClick={() => {
                console.log('goodbye');
              }}
            />
          </button>
          <button className="p-1.5 hover:bg-gray-100  flex items-center space-x-1">
            <i
              className="bi bi-plus-lg text-green-500 text-xl"
              onClick={() => {
                console.log('hello');
              }}
            />
            <span className="border-l-2 border-gray-400 h-4"></span>
            <i
              className="bi bi-caret-down-fill  text-gray-600"
              onClick={() => {
                console.log('goodbye');
              }}
            />
          </button>
          <div className="flex items-center gap-1 px-1 border-l">
            <button
              onClick={onToggleTrash}
              className={`p-1.5 rounded ${showTrash ? 'bg-gray-400' : 'hover:bg-gray-100'}`}
            >
              <i className="bi bi-trash w-4 h-4 text-red-600" />
            </button>
          </div>
          <div className="flex items-center gap-1 px-2  border-r">
            <button className={`p-1.5 rounded hover:bg-gray-100`}>
              <i className="bi bi-pencil-square w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2nd Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-64 px-3 py-1 bg-gray-100 flex items-center gap-2">
            <i className="bi bi-search text-gray-400" />
            <span className="text-sm text-gray-400">Quick Search</span>
          </div>
        </div>

        {/* 3rd Section */}
        <div className="flex-1 flex items-center justify-center">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <i className="bi bi-grid-3x3 w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <i className="bi bi-justify w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 4th Section */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <i className="bi bi-share w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <i className="bi bi-bookmark w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <i className="bi bi-chat-left w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <i
              className="bi bi-info-circle w-4 h-4 text-gray-600"
              onClick={toggleNotebar}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

{
  /* Secondary Toolbar */
}

<div className="flex items-center px-2 h-10 gap-4">
  {/* View Group */}
  <div className="flex items-center gap-1 px-2">
    <span className="text-xs font-medium text-gray-500">View</span>
  </div>

  {/* Search Group */}
  <div className="flex items-center gap-1 px-2 border-l">
    <span className="text-xs font-medium text-gray-500">Search</span>
  </div>

  {/* Add Group */}
  <div className="flex items-center gap-1 px-2 border-l">
    <button
    // onClick={onNewDocument} className="p-1.5 hover:bg-gray-100 rounded"
    >
      <i className="bi bi-plus-lg w-4 h-4 text-gray-600" />
    </button>
  </div>

  {/* Trash Group */}
  <div className="flex items-center gap-1 px-2 border-l">
    <button
    // onClick={onToggleTrash}
    // className={`p-1.5 rounded ${showTrash ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
    >
      <i className="bi bi-trash w-4 h-4 text-gray-600" />
    </button>
  </div>

  {/* Insert Group */}
  <div className="flex items-center gap-1 px-2 border-l">
    <span className="text-xs font-medium text-gray-500">Insert</span>
  </div>

  {/* Quick Ref Group */}
  <div className="flex items-center gap-1 px-2 border-l">
    <button className="p-1.5 hover:bg-gray-100 rounded">
      <i className="bi bi-link-45deg w-4 h-4 text-gray-600" />
    </button>
  </div>

  {/* Center Search */}
  <div className="flex-1 flex justify-center">
    <div className="w-64 px-3 py-1 bg-gray-100 rounded-md flex items-center gap-2">
      <i className="bi bi-search w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-400">Quick Search</span>
    </div>
  </div>

  {/* Right Tools */}
  <div className="flex items-center gap-2">
    <button className="p-1.5 hover:bg-gray-100 rounded">
      <i className="bi bi-grid-3x3 w-4 h-4 text-gray-600" />
    </button>
    <button className="p-1.5 hover:bg-gray-100 rounded border">
      <i className="bi bi-justify w-4 h-4 text-gray-600" />
    </button>
  </div>
</div>;
