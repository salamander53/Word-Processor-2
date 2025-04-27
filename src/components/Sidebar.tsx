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
    { icon: Home, label: 'Home', href: '/home' },
    { icon: FileText, label: 'Collections', href: '/collections' },
    { icon: BookOpen, label: 'Explore', href: '#' },
    { icon: Clock, label: 'Recent', href: '#' },
    { icon: Star, label: 'Starred', href: '#' },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    // Sidebar component
    <div
      className="h-full bg-white border-r flex flex-col transition-all duration-200 relative"
      style={{ width: collapsed ? minWidth : width }}
    >
      {/* User Profile Section */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="avatar-placeholder shrink-0">
          <User className="w-6 h-6" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-medium">John Doe</h3>
            <p className="truncate text-sm text-gray-500">john@example.com</p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 bg-white border rounded-full w-6 h-6 shadow-sm flex items-center justify-center transform -translate-y-1/2 z-50"
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
