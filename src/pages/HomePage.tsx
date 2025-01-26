import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Folder, Plus } from 'lucide-react';
import AxiosInstance from '../components/AxiosInstance';
import { toast } from 'react-toastify';
import { Sidebar } from '../components/Sidebar';
import GridLayout from 'react-grid-layout';
import { TreeNavigation } from '../components/TreeNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export function HomePage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]); // Danh sách folder
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sections, setSections] = useState([
    { id: 'projects', title: 'My Folder', x: 0, y: 3, w: 8, h: 7 },
    { id: 'updates', title: 'Recent Updates', x: 8, y: 3, w: 4, h: 7 },
    { id: 'featured', title: 'Featured Projects', x: 0, y: 0, w: 12, h: 6 },
  ]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sidebarWidth = sidebarCollapsed ? 64 : 200;

  const owner = useSelector(
    (state: RootState) => state.auth.tokenPayload.username
  ); // Giả sử owner là john_doe
  useEffect(() => {
    loadFolders();
  }, []);

  // Tải danh sách folder
  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(`folders/tree/`);

      // Extract docs and trash
      // console.log(response);
      const foldersData = response.data.children; // Assuming docs and trash are at index 8 in the response array
      const extractedFolders = Object.values(foldersData);

      setFolders(extractedFolders);
    } catch (err) {
      // console.error('Error loading folders:', error);
      // toast.error(`${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Tạo folder mới
  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      try {
        const path = `/${owner}/${name}`; // Tạo đường dẫn dựa trên owner
        const response = await AxiosInstance.post('folders/create', {
          name,
          path,
          isFile: false,
        });
        const newFolder = response.data;
        loadFolders();
        // setFolders((prev) => [...prev, newFolder]); // Cập nhật danh sách folder
      } catch (error) {
        console.error('Error creating folder:', error);
        alert('Failed to create folder. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading folders...</div>
      </div>
    );
  }
  const findSpecificFile = (folder) => {
    if (!folder.children) return ''; // Nếu không có con, trả về chuỗi rỗng.

    // Lấy danh sách các con là file.
    const files = Object.values(folder.children).filter(
      (child) => child?.isFile
    );

    // Tìm tài liệu có tên "Readme".
    const readmeFile = files.find(
      (file) => file?.name.toLowerCase() === 'readme'
    );

    // Nếu có "Readme", trả về nó.
    if (readmeFile) {
      return readmeFile.content || '';
    }

    // Nếu không có "Readme", trả về file đầu tiên.
    if (files.length > 0) {
      return files[0].content || '';
    }

    // Nếu không có file nào, trả về chuỗi rỗng.
    return '';
  };

  const renderSection = (section: Section) => {
    switch (section.id) {
      case 'projects':
        return (
          <div className="overflow-x-auto" style={{ minWidth: 'max-content' }}>
            <div className="flex gap-4 ">
              {folders.map((folder) => (
                <div
                  key={folder.path}
                  onClick={() =>
                    navigate(`/folder/${folder.name}`, {
                      state: { nameFolder: folder.name },
                    })
                  }
                  onMouseEnter={() => setHoveredItem(folder.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="w-48 bg-white border border-gray-200 duration-300 relative cursor-pointer transition-all hover:border-gray-300  hover:shadow-md hover:z-10  "
                  style={{
                    minHeight: '250px',
                    maxHeight: '250px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative', // Quan trọng để z-index hoạt động
                  }}
                >
                  {/* <div className="flex items-center justify-between mb-2">
                    <i
                      className={`bi ${folder.icon} mr-0 transition-transform duration-200 group-hover:scale-110 text-xs`}
                    />

                    <span className="text-xs text-gray-500">
                      {new Date(folder.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{folder.name}</h3> */}
                  {/* Card Header */}
                  <div
                    className={`d-flex align-items-center border-b-2 bg-gray-50 px-2 transition-all duration-300 ${
                      hoveredItem === folder.path
                        ? 'opacity-0 h-0'
                        : 'opacity-100 h-auto'
                    }`}
                  >
                    <i className={`bi ${folder.icon} px-2`} />
                    <h3 className=" text-xs truncate">{folder.name}</h3>
                  </div>

                  {/* Card Content */}
                  <div className="overflow-y-auto">
                    {/* {folder.isFile && folder.content && (
                      <p className="text-gray-500 font-thin text-sm">
                        {folder.content.substring(0, 300)}...
                      </p>
                    )}
                    {!folder.isFile && (
                      <div className="text-gray-500">
                        <span>
                          {Object.keys(folder.children || {}).length} items
                        </span>
                      </div>
                    )} */}
                    <div
                      className="text-wrap px-2"
                      dangerouslySetInnerHTML={{
                        __html: findSpecificFile(folder), // Lấy 500 ký tự đầu tiên
                      }}
                    ></div>
                    <hr></hr>
                    <div className="" style={{}}>
                      <TreeNavigation folder={folder} />
                    </div>
                  </div>

                  {/* Card Footer */}
                  {/* <div className="mt-2 text-gray-500 text-xs">
                    <div className="flex items-center justify-between">
                      <span>{folder.isFile ? 'Document' : 'Folder'}</span>
                      <span>•</span>
                      <span>Modified 2h ago</span>
                    </div>
                  </div> */}
                </div>
              ))}
              <button
                onClick={handleCreateFolder}
                className="w-44 h-60 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 p-4"
              >
                <i className="bi bi-folder-plus w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600">New Folder</span>
              </button>
            </div>
          </div>
        );
      case 'updates':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-4 py-2 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-medium">Update {i}:</span>
                    {' New features and improvements'}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'featured':
        return (
          <div className="overflow-x-auto">
            <div
              className="flex gap-4 pb-4"
              style={{ minWidth: 'max-content' }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-64 bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="aspect-video bg-gray-100 rounded mb-2" />
                  <h3 className="font-medium text-sm mb-1">
                    Featured Project {i}
                  </h3>
                  <p className="text-xs text-gray-500">
                    A showcase of what's possible
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleLayoutChange = (newLayout: any) => {
    setSections((prev) =>
      newLayout.map((layout: any) => ({
        ...prev.find((section) => section.id === layout.i),
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h,
      }))
    );
  };

  // console.log(folders);
  return (
    // <div className="min-h-screen bg-gray-50">
    //   <header className="bg-white border-b px-6 py-4">
    //     <div className="max-w-4xl mx-auto flex justify-between items-center">
    //       <h1 className="text-2xl font-semibold">My Folders</h1>
    //       <button
    //         onClick={handleCreateFolder}
    //         className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    //       >
    //         {/* <Plus className="w-4 h-4" /> */}
    //         <i className="bi bi-journal-plus w-4 h-4"></i>
    //         New Folder
    //       </button>
    //     </div>
    //   </header>
    //   <main className="max-w-4xl mx-auto py-8 px-4">
    //     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    //       {folders.map((folder) => (
    //         <div
    //           key={folder.path}
    //           onClick={() =>
    //             navigate(`/folder/${folder.name}`, {
    //               state: { nameFolder: folder.name },
    //             })
    //           }
    //           className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    //         >
    //           <div className="flex items-center gap-3 mb-3">
    //             {/* <Folder className="w-6 h-6 text-blue-500" /> */}
    //             <i className="bi bi-folder w-4 h-4"></i>
    //             <h2 className="text-lg font-medium">{folder.name}</h2>
    //           </div>
    //           <p className="text-sm text-gray-500">Path: {folder.path}</p>
    //         </div>
    //       ))}
    //     </div>
    //   </main>
    // </div>
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className="flex-1 ml-[64px]"
        style={{ marginLeft: sidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
      >
        {/* <header className=" px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold">Hello</h1>
          </div>
        </header> */}

        {/* <main className="max-w-6xl mx-auto py-8 px-4 space-y-6">
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <section
                key={section.id}
                data-id={section.id}
                className="bg-white rounded-lg shadow-sm "
                style={{ height: section.height }}
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <i
                      className="bi bi-grip-vertical w-4 h-4 cursor-move text-gray-400"
                      onMouseDown={(e) => {
                        // Kích hoạt logic kéo để sắp xếp lại
                        const draggedId = section.id;
                        let targetId: string | null = null;

                        const handleDragOver = (event: MouseEvent) => {
                          const target = event.target as HTMLElement;
                          const sectionElem = target.closest('section');
                          if (
                            sectionElem &&
                            sectionElem.getAttribute('data-id')
                          ) {
                            targetId = sectionElem.getAttribute('data-id');
                          }
                        };

                        const handleMouseUp = () => {
                          if (draggedId && targetId && draggedId !== targetId) {
                            handleSectionReorder(draggedId, targetId);
                          }
                          document.removeEventListener(
                            'mousemove',
                            handleDragOver
                          );
                          document.removeEventListener(
                            'mouseup',
                            handleMouseUp
                          );
                        };

                        document.addEventListener('mousemove', handleDragOver);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                    {section.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 cursor-ns-resize"
                      onMouseDown={(e) => {
                        const startY = e.pageY;
                        const startHeight = section.height;

                        const handleMouseMove = (e: MouseEvent) => {
                          const delta = e.pageY - startY;
                          handleSectionResize(section.id, startHeight + delta);
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener(
                            'mousemove',
                            handleMouseMove
                          );
                          document.removeEventListener(
                            'mouseup',
                            handleMouseUp
                          );
                        };

                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    >
                      <i class="bi bi-arrows-vertical"></i>
                    </div>
                  </div>
                </div>
                <div
                  className="p-4 overflow-auto"
                  style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}
                >
                  {renderSection(section)}
                </div>
              </section>
            ))}
        </main> */}
        <GridLayout
          className="layout"
          layout={sections.map((section) => ({
            i: section.id,
            x: section.x,
            y: section.y,
            w: section.w,
            h: section.h,
          }))}
          cols={12}
          rowHeight={50}
          width={1200}
          onLayoutChange={handleLayoutChange}
          isResizable
          isDraggable
          draggableHandle=".drag-handle"
        >
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <section
                key={section.id}
                data-id={section.id}
                className="bg-white rounded-lg shadow-sm "
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-md font-semibold flex items-center gap-2">
                    <i className="bi bi-grip-vertical w-4 h-4 cursor-move text-gray-400 drag-handle" />
                    {section.title}
                  </h2>
                </div>
                <div
                  className="p-4 overflow-auto"
                  // style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}
                >
                  {renderSection(section)}
                </div>
              </section>
            ))}
        </GridLayout>
      </div>
    </div>
  );
}
