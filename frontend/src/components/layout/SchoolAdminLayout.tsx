// src/components/layout/SchoolAdminLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../pages/schoolAdmin/Sidebar';
import Topbar from '../../pages/schoolAdmin/Topbar';

const SchoolAdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleQuickActionClick = () => {
    setIsQuickActionModalOpen(true);
  };

  return (
    <div className="h-screen w-full bg-[#F7F9FC] flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed/Sticky */}
        <div className="h-full shrink-0">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </div>

        {/* Right Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Topbar - Fixed/Sticky */}
          <div className="shrink-0">
            <Topbar
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onQuickActionClick={handleQuickActionClick}
            />
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet /> {/* ← यहाँ Child routes render होंगे */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminLayout;