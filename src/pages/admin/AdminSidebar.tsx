import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  LogOut,
  BarChart3,
  X,
  Activity,
  HelpCircle,
  MessageCircle,
  CheckCircle,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dasbor",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/admin/dashboard",
  },
  {
    title: "eSign",
    icon: <FileText className="w-5 h-5" />,
    badge: "12",
    children: [
      {
        title: "Unggah Dokumen",
        icon: <FileText className="w-4 h-4" />,
        path: "/admin/esign/upload",
      },
      {
        title: "Dokumen untuk Ditandatangani",
        icon: <FileText className="w-4 h-4" />,
        path: "/admin/esign/pending",
        badge: "8",
      },
    ],
  },
  {
    title: "Log Aktivitas",
    icon: <Activity className="w-5 h-5" />,
    path: "/admin/activity-log",
  },
  {
    title: "Pusat Bantuan",
    icon: <HelpCircle className="w-5 h-5" />,
    path: "/admin/help-center",
  },
  {
    title: "Obrolan Langsung",
    icon: <MessageCircle className="w-5 h-5" />,
    badge: "3",
    path: "/admin/live-chat",
  },
  {
    title: "Validator Dokumen",
    icon: <CheckCircle className="w-5 h-5" />,
    path: "/admin/document-validator",
  },
  {
    title: "Manajemen Dokumen",
    icon: <FileText className="w-5 h-5" />,
    badge: "45",
    path: "/admin/document-management",
  },
  {
    title: "Manajemen Pengguna",
    icon: <Users className="w-5 h-5" />,
    badge: "128",
    path: "/admin/user-management",
  },
  {
    title: "Laporan",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/admin/reports",
  },
  {
    title: "Edit Profil",
    icon: <User className="w-5 h-5" />,
    path: "/admin/edit-profile",
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function AdminSidebar({ isOpen, onToggle, onNavigate, currentPath }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["eSign"]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleItemClick = (path: string) => {
    if (path) {
      onNavigate(path);
    }
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.title);
    const isActive = item.path ? currentPath === item.path : false;
    const hasChildren = item.children && item.children.length > 0;

    const ItemContent = (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className={isActive ? 'text-white' : 'text-red-200'}>
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
          <div className={isActive ? 'text-white' : 'text-red-200'}>
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
                : 'text-red-100 hover:bg-white/10 hover:text-white'
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            {ItemContent}
          </button>
        ) : (
          <button
            onClick={() => handleItemClick(item.path || '')}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                : 'text-red-100 hover:bg-white/10 hover:text-white'
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            {ItemContent}
          </button>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 pl-2">
            {item.children?.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-2xl z-50 transition-transform duration-300 flex-shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:translate-x-0 w-64 flex flex-col relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Signatura</h1>
                <p className="text-xs text-red-200">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
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
            <div className="w-12 h-12 bg-gradient-to-br from-white to-red-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <span className="text-base font-bold text-red-600">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-red-200">admin@signatura.com</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-red-500/30 rounded-xl transition-all duration-200 border border-white/10 hover:border-red-400/50"
            onClick={() => onNavigate('/login')}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Keluar
          </Button>
        </div>
      </div>
    </>
  );
}