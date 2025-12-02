import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '@/pages/user/UserSidebar';

const UserLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
