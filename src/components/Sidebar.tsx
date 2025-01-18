import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  Settings,
  Bell,
  User,
  BookOpen,
  Clock,
  Star,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [width, setWidth] = useState(200);
  const minWidth = 64;
  const maxWidth = 400;
  const [textOpacity, setTextOpacity] = useState(1);

  useEffect(() => {
    // Calculate text opacity based on width
    const opacity = Math.min((width - minWidth) / (160 - minWidth), 1);
    setTextOpacity(opacity);
  }, [width]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.pageX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.pageX - startX);
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: FileText, label: 'Documents', href: '/documents' },
    { icon: BookOpen, label: 'Projects', href: '/projects' },
    { icon: Clock, label: 'Recent', href: '/recent' },
    { icon: Star, label: 'Starred', href: '/starred' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div
      className="fixed top-0 left-0 h-full bg-white border-r flex flex-col transition-all duration-200 z-50"
      style={{ width: collapsed ? minWidth : width }}
    >
      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
            <User className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div
              className="overflow-hidden transition-opacity duration-200"
              style={{ opacity: textOpacity }}
            >
              <h3 className="font-medium truncate">John Doe</h3>
              <p className="text-sm text-gray-500 truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span
                className="transition-opacity duration-200 whitespace-nowrap"
                style={{ opacity: textOpacity }}
              >
                {item.label}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="fixed left-[calc(100%-12px)] top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border rounded-full shadow-sm flex items-center justify-center z-50"
        style={{
          left: collapsed
            ? `calc(${minWidth}px - 12px)`
            : `calc(${width}px - 12px)`,
        }}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Resize Handle */}
      {!collapsed && (
        <div
          className="absolute -right-1 top-0 w-2 h-full cursor-ew-resize"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
}
