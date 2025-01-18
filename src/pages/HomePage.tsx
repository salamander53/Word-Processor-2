import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Folder, Plus } from 'lucide-react';
import AxiosInstance from '../components/AxiosInstance';
import { toast } from 'react-toastify';
import { Sidebar } from '../components/Sidebar';

export function HomePage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]); // Danh sách folder
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sections, setSections] = useState([
    { id: 'projects', title: 'My Projects', x: 0, y: 0, w: 6, h: 3 },
    { id: 'updates', title: 'Recent Updates', x: 6, y: 0, w: 6, h: 2 },
    { id: 'featured', title: 'Featured Projects', x: 0, y: 3, w: 12, h: 2 },
  ]);

  const sidebarWidth = sidebarCollapsed ? 64 : 200;

  const owner = 'john_doe'; // Giả sử owner là john_doe

  useEffect(() => {
    loadFolders();
  }, []);

  // Tải danh sách folder
  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(`folders/tree/${owner}`);

      // Extract docs and trash
      console.log(response);
      const foldersData = response.data.children; // Assuming docs and trash are at index 8 in the response array
      const extractedFolders = Object.values(foldersData);

      setFolders(extractedFolders);
    } catch (err) {
      // console.error('Error loading folders:', error);
      toast.error(`${err}`);
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

        setFolders((prev) => [...prev, newFolder]); // Cập nhật danh sách folder
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

  const handleSectionReorder = (draggedId: string, targetId: string) => {
    setSections((prev) => {
      const newSections = [...prev];
      const draggedIndex = newSections.findIndex((s) => s.id === draggedId);
      const targetIndex = newSections.findIndex((s) => s.id === targetId);
      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      return newSections.map((s, i) => ({ ...s, order: i }));
    });
  };

  const handleSectionResize = (id: string, newHeight: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, height: Math.max(100, newHeight) }
          : section
      )
    );
  };

  const renderSection = (section: Section) => {
    switch (section.id) {
      case 'projects':
        return (
          <div className="overflow-x-auto">
            <div
              className="flex gap-4 pb-4"
              style={{ minWidth: 'max-content' }}
            >
              {folders.map((folder) => (
                <div
                  key={folder.path}
                  onClick={() =>
                    navigate(`/folder/${folder.name}`, {
                      state: { nameFolder: folder.name },
                    })
                  }
                  className="w-44 h-60 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md p-4 cursor-pointer flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <i className="bi bi-file w-6 h-6 text-blue-500" />
                    <span className="text-xs text-gray-500">
                      {new Date(folder.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{folder.name}</h3>
                </div>
              ))}
              <button
                onClick={handleCreateFolder}
                className="w-44 h-60 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 p-4"
              >
                <i className="bi bi-folder-plus w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600">New Project</span>
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
        <header className="bg-white border-b px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold">My Documents</h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-8 px-4 space-y-6">
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
                  {/* <div className="flex items-center gap-2">
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
                  </div> */}
                </div>
                <div
                  className="p-4 overflow-auto"
                  style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}
                >
                  {renderSection(section)}
                </div>
              </section>
            ))}
        </main>
      </div>
    </div>
  );
}
