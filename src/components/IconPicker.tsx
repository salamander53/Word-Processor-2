import React, { useState, useEffect } from 'react';
import * as Bi from 'react-icons/bi';
import * as Fi from 'react-icons/fi';
import * as Hi from 'react-icons/hi';
import * as Ai from 'react-icons/ai';
import * as Fa from 'react-icons/fa';
import * as Md from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

interface IconPickerProps {
  onSelect: (iconName: string) => void;
  currentIcon?: string;
}

type IconSet = {
  [key: string]: {
    icons: any;
    label: string;
    color: string;
    prefix: string;
  };
};

const ICON_SETS: IconSet = {
  bi: {
    icons: Bi,
    label: 'Bootstrap',
    color: 'text-purple-500',
    prefix: 'bi bi-',
  },
  fi: {
    icons: Fi,
    label: 'Feather',
    color: 'text-blue-500',
    prefix: 'fi fi-',
  },
  hi: {
    icons: Hi,
    label: 'Heroicons',
    color: 'text-indigo-500',
    prefix: 'hi hi-',
  },
  ai: {
    icons: Ai,
    label: 'Ant Design',
    color: 'text-red-500',
    prefix: 'ai ai-',
  },
  fa: {
    icons: Fa,
    label: 'Font Awesome',
    color: 'text-yellow-500',
    prefix: 'fa fa-',
  },
  md: {
    icons: Md,
    label: 'Material',
    color: 'text-green-500',
    prefix: 'md md-',
  },
};

export function IconPicker({ onSelect, currentIcon }: IconPickerProps) {
  const [activeSet, setActiveSet] = useState('bi');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentIcons, setRecentIcons] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('iconFavorites');
    const savedRecent = localStorage.getItem('recentIcons');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentIcons(JSON.parse(savedRecent));
  }, []);

  useEffect(() => {
    localStorage.setItem('iconFavorites', JSON.stringify(favorites));
    localStorage.setItem('recentIcons', JSON.stringify(recentIcons));
  }, [favorites, recentIcons]);

  const handleIconSelect = (iconName: string) => {
    const prefix = ICON_SETS[activeSet].prefix;
    const formattedName = prefix + formatIconName(iconName);
    onSelect(formattedName);
    setRecentIcons((prev) => {
      const newRecent = [
        formattedName,
        ...prev.filter((icon) => icon !== formattedName),
      ].slice(0, 12);
      return newRecent;
    });
  };

  const toggleFavorite = (iconName: string) => {
    const prefix = ICON_SETS[activeSet].prefix;
    const formattedName = prefix + formatIconName(iconName);
    setFavorites((prev) =>
      prev.includes(formattedName)
        ? prev.filter((icon) => icon !== formattedName)
        : [...prev, formattedName]
    );
  };

  const formatIconName = (name: string) => {
    return name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1);
  };

  const filterIcons = (icons: any) => {
    return Object.keys(icons)
      .filter((key) => typeof icons[key] === 'function')
      .filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-[400px]">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-2">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search icons..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md
              focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <BiSearch className="absolute left-2.5 top-2 text-gray-400 w-4 h-4" />
        </div>

        {/* Icon set selector */}
        <div className="flex flex-wrap gap-1">
          {Object.entries(ICON_SETS).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setActiveSet(key)}
              className={`
                px-2 py-1 rounded text-xs font-medium
                transition-all duration-150
                ${
                  activeSet === key
                    ? `${color} bg-gray-100 dark:bg-gray-800`
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {filterIcons(ICON_SETS[activeSet].icons).map((key: string) => {
            const Icon = ICON_SETS[activeSet].icons[key];
            const iconName = ICON_SETS[activeSet].prefix + formatIconName(key);
            const isCurrentIcon = currentIcon === iconName;
            const isFavorite = favorites.includes(iconName);

            return (
              <div key={key} className="relative group">
                <button
                  onClick={() => handleIconSelect(key)}
                  className={`
                    w-full aspect-square p-1.5 rounded
                    flex items-center justify-center
                    transition-all duration-150
                    ${isCurrentIcon ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800/30'}
                    group-hover:scale-105
                  `}
                  title={formatIconName(key)}
                >
                  <Icon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleFavorite(key)}
                  className={`
                    absolute -top-1 -right-1
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-150
                    p-0.5 rounded-full bg-white dark:bg-gray-800
                    ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}
                  `}
                >
                  <Fa.FaStar className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
