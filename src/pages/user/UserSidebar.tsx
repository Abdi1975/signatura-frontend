import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ChevronDown,
  ChevronRight,
  LogOut,
  Activity,
  HelpCircle,
  MessageCircle,
  CheckCircle,
  User,
  PenTool
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['eSign']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const sidebarItems = [
    {
      title: 'Dasbor',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/user/dashboard',
    },
    {
      title: 'eSign',
      icon: <FileText className="w-5 h-5" />,
      badge: '5',
      children: [
        {
          title: 'Unggah Dokumen',
          icon: <FileText className="w-4 h-4" />,
          path: '/user/esign/upload',
        },
        {
          title: 'Dokumen untuk Ditandatangani',
          icon: <FileText className="w-4 h-4" />,
          path: '/user/esign/pending',
          badge: '3',
        },
      ],
    },
    {
      title: 'Log Aktivitas',
      icon: <Activity className="w-5 h-5" />,
      path: '/user/activity-log',
    },
    {
      title: 'Pusat Bantuan',
      icon: <HelpCircle className="w-5 h-5" />,
      path: '/user/help-center',
    },
    {
      title: 'Obrolan Langsung',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: '2',
      path: '/user/live-chat',
    },
    {
      title: 'Validator Dokumen',
      icon: <CheckCircle className="w-5 h-5" />,
      path: '/user/document-validator',
    },
    {
      title: 'Edit Profil',
      icon: <User className="w-5 h-5" />,
      path: '/user/edit-profile',
    },
  ];

  const renderSidebarItem = (item: any, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const isActive = item.path ? location.pathname === item.path : false;
    const hasChildren = item.children && item.children.length > 0;

    const ItemContent = (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className={isActive ? 'text-white' : 'text-blue-200'}>
            {item.icon}
          </div>
          <span className="font-medium">{item.title}</span>
          {item.badge && (
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm">
              {item.badge}
            </span>
          )}
        </div>
        {hasChildren && (
          <div className={isActive ? 'text-white' : 'text-blue-200'}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        )}
      </div>
    );

    return (
      <div key={item.title}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.title)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            {ItemContent}
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            {ItemContent}
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 pl-2">
            {item.children?.map((child: any) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 shadow-2xl h-screen flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      
      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Signatura</h1>
              <p className="text-xs text-blue-200">User Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation with custom scrollbar */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 relative z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        <style>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
        {sidebarItems.map(item => renderSidebarItem(item))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10 relative z-10 bg-black/10 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30">
            <span className="text-base font-bold text-blue-600">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Regular User</p>
            <p className="text-xs text-blue-200">user@signatura.com</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:text-white hover:bg-red-500/30 rounded-xl transition-all duration-200 border border-white/10 hover:border-red-400/50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Keluar
        </Button>
      </div>
    </div>
  );
};

export default UserSidebar;
