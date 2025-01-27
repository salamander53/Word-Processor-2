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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sections, setSections] = useState([
    { id: 'projects', title: 'My Folder', x: 0, y: 3, w: 8, h: 7 },
    { id: 'updates', title: 'Recent Updates', x: 8, y: 3, w: 4, h: 7 },
    { id: 'featured', title: 'Featured Projects', x: 0, y: 0, w: 12, h: 8 },
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
          <div className="container-fluid px-0">
            <div className="d-flex flex-nowrap overflow-x-auto pb-3">
              {folders.map((folder) => (
                <div
                  key={folder.path}
                  className="card hover-shadow m-2 flex-shrink-0"
                  style={{
                    width: '240px',
                    maxHeight: '280px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() =>
                    navigate(`/folder/${folder.name}`, {
                      state: { nameFolder: folder.name },
                    })
                  }
                  onMouseEnter={() => setHoveredItem(folder.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="card-header bg-light d-flex align-items-center py-2">
                    <i className={`bi ${folder.icon} me-2`} />
                    <h6 className="mb-0 text-truncate">{folder.name}</h6>
                  </div>

                  <div className="card-body overflow-auto p-2">
                    <div
                      className="small text-muted"
                      dangerouslySetInnerHTML={{
                        __html: findSpecificFile(folder),
                      }}
                    />
                    <hr className="my-2" />
                    <TreeNavigation folder={folder} />
                  </div>

                  {hoveredItem === folder.path && (
                    <div className="card-footer bg-transparent border-0 py-1">
                      <small className="text-muted">
                        Last modified: 2h ago
                      </small>
                    </div>
                  )}
                </div>
              ))}

              <div className="m-2 d-flex align-items-center">
                <button
                  onClick={handleCreateFolder}
                  className="w-44 h-64 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 p-4"
                  style={{ width: '200px' }}
                >
                  <i className="bi bi-folder-plus fs-4 mb-2" />
                  <span className="small">New Project</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'updates':
        return (
          <div className="list-group list-group-flush rounded-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="list-group-item d-flex align-items-start py-3 hover-bg-light"
              >
                <div className="badge bg-primary-subtle text-primary me-3 p-2">
                  <i className="bi bi-megaphone fs-5" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0 fw-medium">Update {i}</h6>
                    <span className="text-muted small">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <p className="small text-muted mb-0">
                    New features and improvements to enhance your workflow
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'featured':
        return (
          <div className="row g-4 row-cols-xxl-3 row-cols-md-2 row-cols-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col">
                <div className="card h-100 border-0 shadow-hover">
                  <div className="ratio ratio-16x9 bg-light-subtle">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-stack text-primary opacity-75 fs-1" />
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title mb-2">Featured Project {i}</h5>
                    <p className="card-text small text-muted mb-0">
                      Explore this innovative solution showcasing advanced
                      capabilities
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-top">
                    <button className="btn btn-sm btn-outline-primary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    <div
      className="min-h-screen bg-gray-50 grid"
      style={{
        gridTemplateColumns: `${sidebarCollapsed ? '64px' : '200px'} 1fr`,
        transition: 'grid-template-columns 0.3s ease',
      }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="p-6 overflow-hidden">
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
          containerPadding={[16, 16]}
          // style={{
          //   width: '100%',
          //   height: 'calc(100vh - 48px)', // Adjust based on your needs
          // }}
        >
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <section
                key={section.id}
                data-id={section.id}
                className="bg-white rounded-3 shadow-sm d-flex flex-column" // Thêm flex-column
              >
                <div className="p-3 border-bottom bg-light rounded-top">
                  <h2 className="mb-0 fs-5 fw-semibold d-flex align-items-center gap-2">
                    <i className="bi bi-grip-vertical fs-6 text-muted drag-handle" />
                    {section.title}
                  </h2>
                </div>
                <div className="flex-grow-1 overflow-hidden p-3">
                  {renderSection(section)}
                </div>
              </section>
            ))}
        </GridLayout>
      </div>
    </div>
  );
}
