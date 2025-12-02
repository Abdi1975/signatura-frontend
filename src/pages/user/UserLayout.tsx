import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UserSidebar from './UserSidebar';

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <UserSidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={handleNavigate}
        currentPath={location.pathname}
      />
      
      <div className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-white border-b sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
