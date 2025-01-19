import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ICONS = {
  Book: [
    'bi-book text-primary',
    'bi-journal text-success',
    'bi-journal-richtext text-danger',
    'bi-book-half text-warning',
  ],
  Notes: [
    'bi-pencil text-info',
    'bi-file-earmark-text text-muted',
    'bi-clipboard text-dark',
    'bi-file-text text-secondary',
  ],
  'To Do': [
    'bi-check2-square text-success',
    'bi-card-checklist text-primary',
    'bi-list-check text-warning',
  ],
  Flag: ['bi-flag text-danger', 'bi-flag-fill text-warning'],
  Locations: [
    'bi-geo-alt text-primary',
    'bi-geo-alt-fill text-success',
    'bi-map text-info',
    'bi-pin-map text-danger',
  ],
  Characters: [
    'bi-person text-dark',
    'bi-people text-secondary',
    'bi-person-circle text-warning',
    'bi-emoji-smile text-success',
  ],
  'Way-Station': [
    'bi-flag text-danger',
    'bi-flag-fill text-primary',
    'bi-geo text-success',
    'bi-geo-alt text-info',
  ],
  TV: ['bi-tv text-primary', 'bi-tv-fill text-warning', 'bi-display text-dark'],
  'Back Matter': [
    'bi-layers text-info',
    'bi-box text-success',
    'bi-archive text-warning',
  ],
  Statistics: [
    'bi-graph-up text-primary',
    'bi-graph-down text-danger',
    'bi-bar-chart text-success',
  ],
  'Light Bulb': ['bi-lightbulb text-warning', 'bi-lightbulb-fill text-success'],
  'Magnifying Glass': [
    'bi-search text-primary',
    'bi-zoom-in text-success',
    'bi-zoom-out text-danger',
  ],
  'Question Mark': [
    'bi-question text-warning',
    'bi-question-circle text-primary',
  ],
  Warning: [
    'bi-exclamation-triangle text-danger',
    'bi-exclamation-circle text-warning',
    'bi-exclamation text-primary',
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
