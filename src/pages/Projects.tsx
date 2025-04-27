import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../components/AxiosInstance';
import { Sidebar } from '../components/Sidebar';
import { TreeNavigation } from '../components/TreeNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FolderType } from '../types';

export function Projects() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const owner =
    useSelector((state: RootState) => state.auth.tokenPayload?.username) ||
    JSON.parse(localStorage.getItem('tokenPayload') || '{}')?.username;

  useEffect(() => {
    if (!owner) {
      navigate('/');
      return;
    }
    loadFolders();
  }, [owner]);

  const loadFolders = async () => {
    try {
      const response = await AxiosInstance.get(`folders/tree/`);
      const foldersData = response.data.children;
      const extractedFolders = Object.values(foldersData);
      setFolders(extractedFolders);
    } catch (err) {
      console.error('Error loading folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      try {
        const path = `/${owner}/${name}`;
        await AxiosInstance.post('folders/create', {
          name,
          path,
          isFile: false,
        });
        loadFolders();
      } catch (error) {
        console.error('Error creating folder:', error);
        alert('Failed to create folder. Please try again.');
      }
    }
  };

  const findSpecificFile = (folder: FolderType) => {
    if (!folder.children) return '';
    const files = Object.values(folder.children).filter(
      (child) => child?.isFile
    );
    const readmeFile = files.find(
      (file) => file?.name.toLowerCase() === 'readme'
    );
    if (readmeFile) {
      return readmeFile.content || '';
    }
    if (files.length > 0) {
      return files[0].content || '';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading folders...</div>
      </div>
    );
  }

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

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Projects</h1>
        <div className="container-fluid px-0">
          <div className="d-flex flex-wrap">
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
                    <small className="text-muted">Last modified: 2h ago</small>
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
      </div>
    </div>
  );
}
