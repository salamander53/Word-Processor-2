import React from 'react';

interface TrashComponentProps {
  folders: any;
  handleDelete: (path: string) => void;
  handleRestore: (path: string) => void;
}

export const TrashComponent: React.FC<TrashComponentProps> = ({
  folders,
  handleDelete,
  handleRestore,
}) => {
  const getDeletedItems = (folder: any): any[] => {
    const deletedItems: any[] = [];

    const traverse = (node: any) => {
      if (node.deleted) {
        deletedItems.push(node);
      }

      if (node.children) {
        Object.values(node.children).forEach(traverse);
      }
    };

    traverse(folder);
    return deletedItems;
  };

  const getPathAsString = (path: string): string => {
    const pathComponents = path.split('/').filter((component) => component);
    return pathComponents.join(' > ');
  };

  return (
    <div className="p-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Trash</h2>
        {folders ? (
          <ul
            className="space-y-2 overflow-y-auto"
            style={{ maxHeight: '500px' }}
          >
            {getDeletedItems(folders).map((item) => (
              <li
                key={item.path}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md hover:shadow"
              >
                <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <i
                    className={`${item.icon || (item.isFile ? 'bi-file-earmark-text' : 'bi-folder')} text-gray-500`}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-black">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {getPathAsString(item.path)}
                    </span>
                  </div>
                </div>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(item.path)}
                >
                  Delete
                </button>
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => handleRestore(item.path)}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">Trash is empty</div>
        )}
      </div>
    </div>
  );
};
