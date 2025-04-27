import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../components/AxiosInstance';
import { Sidebar } from '../components/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FolderType } from '../types';
import { TreeNavigation } from '../components/TreeNavigation';

interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  votes: number;
  views: number;
  comments: number;
  folder: FolderType;
  tags: string[];
}

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const owner =
    useSelector((state: RootState) => state.auth.tokenPayload?.username) ||
    JSON.parse(localStorage.getItem('tokenPayload') || '{}')?.username;

  useEffect(() => {
    if (!owner) {
      navigate('/');
      return;
    }
    // Mẫu data để demo
    setPosts([
      {
        id: '1',
        title: 'My Research Project Structure',
        description:
          "I've organized my research project with a clear folder structure. Feel free to use this as a template!",
        author: 'admin',
        createdAt: '2025-04-27',
        votes: 42,
        views: 1205,
        comments: 5,
        tags: ['organization', 'research', 'template'],
        folder: {
          _id: '1',
          name: 'Research Project',
          path: '/collections/research',
          isFile: false,
          deleted: false,
          owner: 'admin',
          parentPath: null,
          icon: 'bi bi-folder-fill',
          children: {
            literature: {
              _id: '2',
              name: 'Literature Review',
              path: '/collections/research/literature',
              isFile: false,
              deleted: false,
              owner: 'admin',
              parentPath: '/collections/research',
              icon: 'bi bi-journal-text',
              children: {},
            },
            data: {
              _id: '3',
              name: 'Data Analysis',
              path: '/collections/research/data',
              isFile: false,
              deleted: false,
              owner: 'admin',
              parentPath: '/collections/research',
              icon: 'bi bi-graph-up',
              children: {},
            },
          },
        },
      },
      {
        id: '2',
        title: 'Document Collaboration Template',
        description:
          'Check out this folder structure for team collaboration. Includes templates for meeting notes, documentation, and task tracking.',
        author: 'editor',
        createdAt: '2025-04-26',
        votes: 38,
        views: 892,
        comments: 12,
        tags: ['collaboration', 'teamwork', 'template'],
        folder: {
          _id: '4',
          name: 'Team Workspace',
          path: '/collections/team',
          isFile: false,
          deleted: false,
          owner: 'editor',
          parentPath: null,
          icon: 'bi bi-people-fill',
          children: {
            docs: {
              _id: '5',
              name: 'Documentation',
              path: '/collections/team/docs',
              isFile: false,
              deleted: false,
              owner: 'editor',
              parentPath: '/collections/team',
              icon: 'bi bi-file-text',
              children: {},
            },
          },
        },
      },
    ]);
    setLoading(false);
  }, [owner]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Document Feed</h1>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => navigate('/collections')}
              >
                My Collections
              </button>
              <button
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => navigate('/collections')}
              >
                Share Collection
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-gray-300 transition-all cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="flex gap-6">
                  {/* Vote & Stats section */}
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <i className="bi bi-caret-up-fill text-gray-400 hover:text-blue-500" />
                    </button>
                    <span className="font-medium text-lg">{post.votes}</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <i className="bi bi-caret-down-fill text-gray-400 hover:text-red-500" />
                    </button>

                    <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <i className="bi bi-eye" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="bi bi-chat-dots" />
                        {post.comments}
                      </span>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <img
                          src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                          alt={post.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{post.author}</span>
                          <span className="text-gray-400 text-xs">
                            shared on {post.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">{post.description}</p>

                    {/* Folder Preview */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <i className={`${post.folder.icon} text-blue-500`} />
                      <span className="font-medium">{post.folder.name}</span>
                    </div>
                    <div className="pl-4">
                      <TreeNavigation
                        folder={post.folder}
                        selectedPath={null}
                        onSelectItem={() => {}}
                        onToggleFolder={() => {}}
                        viewMode="editor"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <i className="bi bi-bookmark text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <i className="bi bi-share text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
