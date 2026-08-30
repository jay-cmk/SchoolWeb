// Sidebar.tsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentTab, setCurrentTab }) => {
  const navigate = useNavigate();
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);

  // Dashboard Items
  const dashboardItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/school-admin/dashboard' },
  ];

  // Academic Items (Collapsible)
  const academicItems = [
    { id: 'sessions', label: 'Sessions', icon: 'lucide:calendar-range', path: '/school-admin/academic/sessions' },
    { id: 'classes', label: 'Classes', icon: 'lucide:building-2', path: '/school-admin/academic/classes' },
    { id: 'sections', label: 'Sections', icon: 'lucide:layers', path: '/school-admin/academic/sections' },
    { id: 'subjects', label: 'Subjects', icon: 'lucide:book-open', path: '/school-admin/academic/subjects' },
  ];

  // Other Items
  const otherItems = [
    { id: 'students', label: 'Students', icon: 'lucide:users', path: '/school-admin/students' },
    { id: 'teachers', label: 'Teachers', icon: 'lucide:graduation-cap', path: '/school-admin/teachers' },
    { id: 'timetable', label: 'Timetable', icon: 'lucide:calendar', path: '/school-admin/timetable' },
    { id: 'attendance', label: 'Attendance', icon: 'lucide:calendar-check', path: '/school-admin/attendance' },
    { id: 'homework', label: 'Homework', icon: 'lucide:clipboard-list', path: '/school-admin/homework' },
    { id: 'exams', label: 'Exams', icon: 'lucide:file-text', path: '/school-admin/exams' },
    { id: 'results', label: 'Results', icon: 'lucide:chart-bar', path: '/school-admin/results' },
    { id: 'fees', label: 'Fees', icon: 'lucide:credit-card', path: '/school-admin/fees' },
    { id: 'notices', label: 'Notices', icon: 'lucide:megaphone', path: '/school-admin/notices' },
    { id: 'parents', label: 'Parents', icon: 'lucide:heart', path: '/school-admin/parents' },
    { id: 'staff', label: 'Staff', icon: 'lucide:briefcase-business', path: '/school-admin/staff' },
    { id: 'reports', label: 'Reports', icon: 'lucide:chart-bar', path: '/school-admin/reports' },
    { id: 'settings', label: 'Settings', icon: 'lucide:settings', path: '/school-admin/settings' },
  ];

  const handleNavigation = (id: string, path: string) => {
    setCurrentTab(id);
    navigate(path);
    onClose();
  };

  // Check if any academic item is active
  const isAcademicActive = academicItems.some(item => item.id === currentTab);

  // Auto-expand academic if any academic item is active
  React.useEffect(() => {
    if (isAcademicActive) {
      setIsAcademicOpen(true);
    }
  }, [isAcademicActive]);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E5E7EB] bg-white transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#E5E7EB] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F5FAE] text-white shadow-md">
              <Icon icon="lucide:graduation-cap" className="text-2xl" />
            </div>
            <div>
              <p className="text-base font-bold text-[#15243B]">Riverside Academy</p>
              <p className="text-xs text-[#6B7280]">School ERP · 2025–26</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B7280] hover:text-[#15243B] lg:hidden">
            <Icon icon="lucide:x" className="text-xl" />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Operations</p>
          <div className="space-y-1 text-sm">
            {/* Dashboard */}
            {dashboardItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`flex w-full min-h-11 items-center gap-3 rounded-lg px-3 font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E8F0FB] text-[#1F5FAE]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B]'
                  }`}
                >
                  <Icon icon={item.icon} className="text-lg" />
                  {item.label}
                </button>
              );
            })}

            {/* Academic - Collapsible */}
            <div>
              <button
                onClick={() => setIsAcademicOpen(!isAcademicOpen)}
                className={`flex w-full min-h-11 items-center gap-3 rounded-lg px-3 font-semibold transition-all duration-200 ${
                  isAcademicActive || isAcademicOpen
                    ? 'bg-[#E8F0FB] text-[#1F5FAE]'
                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B]'
                }`}
              >
                <Icon icon="lucide:book-open" className="text-lg" />
                <span className="flex-1 text-left">Academic</span>
                <Icon 
                  icon={isAcademicOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'} 
                  className={`text-sm transition-transform duration-200 ${isAcademicOpen ? 'rotate-0' : ''}`}
                />
              </button>

              {/* Academic Sub-items */}
              {isAcademicOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#E5E7EB] pl-2 animate-in slide-in-from-left-2 duration-200">
                  {academicItems.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id, item.path)}
                        className={`flex w-full min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#E8F0FB] text-[#1F5FAE]'
                            : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B]'
                        }`}
                      >
                        <Icon icon={item.icon} className="text-base" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other Items */}
            {otherItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`flex w-full min-h-11 items-center gap-3 rounded-lg px-3 font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E8F0FB] text-[#1F5FAE]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B]'
                  }`}
                >
                  <Icon icon={item.icon} className="text-lg" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Fixed */}
        <div className="shrink-0 border-t border-[#E5E7EB] p-4 text-sm">
          <button
            onClick={() => handleNavigation('help', '/help')}
            className="flex w-full min-h-11 items-center gap-3 rounded-lg px-3 text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B] transition-colors"
          >
            <Icon icon="lucide:circle-help" className="text-lg" />
            Help &amp; Support
          </button>
          <button
            onClick={() => handleNavigation('profile', '/profile')}
            className="flex w-full min-h-11 items-center gap-3 rounded-lg px-3 text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#15243B] transition-colors"
          >
            <Icon icon="lucide:user" className="text-lg" />
            Admin Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="flex w-full min-h-11 items-center gap-3 rounded-lg px-3 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
          >
            <Icon icon="lucide:log-out" className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;