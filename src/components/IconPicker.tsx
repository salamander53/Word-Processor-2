import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ICONS = {
  Book: ['bi-book', 'bi-journal', 'bi-journal-richtext', 'bi-book-half'],
  Notes: ['bi-pencil', 'bi-file-earmark-text', 'bi-clipboard', 'bi-file-text'],
  'To Do': ['bi-check2-square', 'bi-card-checklist', 'bi-list-check'],
  Flag: ['bi-flag', 'bi-flag-fill'],
  Locations: ['bi-geo-alt', 'bi-geo-alt-fill', 'bi-map', 'bi-pin-map'],
  Characters: ['bi-person', 'bi-people', 'bi-person-circle', 'bi-emoji-smile'],
  'Way-Station': ['bi-flag', 'bi-flag-fill', 'bi-geo', 'bi-geo-alt'],
  TV: ['bi-tv', 'bi-tv-fill', 'bi-display'],
  'Back Matter': ['bi-layers', 'bi-box', 'bi-archive'],
  Statistics: ['bi-graph-up', 'bi-graph-down', 'bi-bar-chart'],
  'Light Bulb': ['bi-lightbulb', 'bi-lightbulb-fill'],
  'Magnifying Glass': ['bi-search', 'bi-zoom-in', 'bi-zoom-out'],
  'Question Mark': ['bi-question', 'bi-question-circle'],
  Warning: [
    'bi-exclamation-triangle',
    'bi-exclamation-circle',
    'bi-exclamation',
  ],
};

interface IconPickerProps {
  onSelect: (iconName: string) => void;
  currentIcon?: string;
}

export function IconPicker({ onSelect, currentIcon }: IconPickerProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-80 flex">
      {/* Danh sách các mục */}
      <div
        className="w-1/3 border-r pr-2 overflow-y-auto"
        style={{ maxHeight: '400px' }} // Đặt chiều cao cố định và kích hoạt cuộn
      >
        <h3 className="font-semibold mb-2">Categories</h3>
        <ul>
          {Object.keys(ICONS).map((category) => (
            <li
              key={category}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${
                hoveredCategory === category ? 'bg-gray-100' : ''
              }`}
              onMouseEnter={() => setHoveredCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Danh sách icon tương ứng */}
      <div className="w-2/3 pl-2">
        <h3 className="font-semibold mb-2">Icons</h3>
        <div className="grid grid-cols-4 gap-2">
          {hoveredCategory &&
            ICONS[hoveredCategory].map((iconName) => (
              <button
                key={iconName}
                onClick={() => onSelect(iconName)}
                className={`p-2 rounded hover:bg-gray-100 ${
                  currentIcon === iconName ? 'bg-blue-100' : ''
                }`}
              >
                <i className={iconName} style={{ fontSize: '1.5rem' }} />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
