import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { navigationItems } from '../types/navigation';
import {
  ChevronDown,
  Settings,
  BookOpen,
  PlusCircle,
  LineChart,
  FileText,
} from 'lucide-react';

const getIcon = (name: string) => {
  switch (name) {
    case 'General Setup':
      return <Settings className="w-5 h-5" />;
    case 'Journal Overview':
      return <BookOpen className="w-5 h-5" />;
    case 'New Transaction':
      return <PlusCircle className="w-5 h-5" />;
    case 'Analysis Corner':
      return <LineChart className="w-5 h-5" />;
    case 'General Reports':
      return <FileText className="w-5 h-5" />;
    default:
      return null;
  }
};

interface NavigationProps {
  onNavigate: (path: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const { user } = useAuth();
  const userLevel = user?.userLevel || 0;
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (path: string) => {
    setExpandedItems(current =>
      current.includes(path)
        ? current.filter(item => item !== path)
        : [...current, path]
    );
  };

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen px-4 py-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">AccounThinking</h2>
      </div>
      <div className="space-y-2">
        {navigationItems
          .filter((item) => userLevel >= item.minLevel)
          .map((item) => (
            <div key={item.path} className="space-y-1">
              <button
                onClick={() => {
                  if (item.items) {
                    toggleExpanded(item.path);
                  } else {
                    onNavigate(item.path);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getIcon(item.name)}
                  <span>{item.name}</span>
                </div>
                {item.items && (
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      expandedItems.includes(item.path) ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {item.items && expandedItems.includes(item.path) && (
                <div className="ml-4 space-y-1">
                  {item.items
                    .filter((subItem) => userLevel >= subItem.minLevel)
                    .map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => onNavigate(subItem.path)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        {subItem.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </nav>
  );
}