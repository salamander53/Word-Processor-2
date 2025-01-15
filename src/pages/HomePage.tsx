import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Folder, Plus } from 'lucide-react';
import AxiosInstance from '../components/AxiosInstance';
import { toast } from 'react-toastify';

export function HomePage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]); // Danh sách folder
  const [loading, setLoading] = useState(true);

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

  // console.log(folders);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Folders</h1>
          <button
            onClick={handleCreateFolder}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {/* <Plus className="w-4 h-4" /> */}
            <i className="bi bi-journal-plus w-4 h-4"></i>
            New Folder
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div
              key={folder.path}
              onClick={() =>
                navigate(`/folder/${folder.name}`, {
                  state: { nameFolder: folder.name },
                })
              }
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* <Folder className="w-6 h-6 text-blue-500" /> */}
                <i className="bi bi-folder w-4 h-4"></i>
                <h2 className="text-lg font-medium">{folder.name}</h2>
              </div>
              <p className="text-sm text-gray-500">Path: {folder.path}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
