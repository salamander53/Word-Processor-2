import React, { useState } from 'react';

function SearchBar({ folders, onSelectItem, set }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Highlight từ khóa trong chuỗi
  const highlightText = (text, query) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Tìm kiếm nội dung trong folder
  const searchFolders = (folder, query) => {
    let results = [];
    const lowerQuery = query.toLowerCase();

    // Kiểm tra điều kiện tìm kiếm
    const matchContent = folder.content?.toLowerCase().includes(lowerQuery);
    const matchName = folder.name.toLowerCase().includes(lowerQuery);
    const matchSummary = folder.summary?.toLowerCase().includes(lowerQuery);
    const matchNote = folder.note?.toLowerCase().includes(lowerQuery);

    if (
      folder.isFile &&
      (matchContent || matchName || matchSummary || matchNote)
    ) {
      results.push({
        ...folder,
        highlightedContent: matchContent
          ? highlightText(
              folder.content.substring(
                Math.max(
                  folder.content.toLowerCase().indexOf(lowerQuery) - 20,
                  0
                ),
                folder.content.toLowerCase().indexOf(lowerQuery) + 50
              ),
              query
            )
          : null,
      });
    }

    if (folder.children) {
      Object.values(folder.children).forEach((child) => {
        results = results.concat(searchFolders(child, query));
      });
    }

    return results;
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = searchFolders(folders, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  const getPathAsString = (path) => {
    return path.split('/').filter(Boolean).join(' > ');
  };
  return (
    <div className="position-relative w-100">
      {/* Input Search */}
      <input
        type="text"
        className="w-100 px-3 py-1 bg-white gap-2 text-sm "
        placeholder="Search files, content, summary, or notes..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Dropdown Results */}
      {searchResults.length > 0 && (
        <ul className="dropdown-menu show w-100 overflow-y-auto">
          {searchResults.map((item, index) => (
            <button
              key={index}
              className="dropdown-item h-10 border-t"
              onClick={() => {
                onSelectItem(item);
                set('normal');
              }}
            >
              <div className="d-flex align-items-center">
                <i className={`${item.icon} me-2`} />
                <div>
                  {/* <div className={`text-xs`}>{item.name}</div> */}
                  <div className={`text-xs`}>{getPathAsString(item.path)}</div>
                  {item.highlightedContent && (
                    <div
                      className="text-truncate small text-secondary text-xs"
                      dangerouslySetInnerHTML={{
                        __html: item.highlightedContent,
                      }}
                    />
                  )}
                </div>
              </div>
            </button>
          ))}
        </ul>
      )}

      {/* No Results */}
      {/* {searchQuery.trim() && searchResults.length === 0 && (
        <div className="dropdown-menu show w-100  text-center">
          <span className="text-muted small">No results found</span>
        </div>
      )} */}
    </div>
  );
}

export default SearchBar;
