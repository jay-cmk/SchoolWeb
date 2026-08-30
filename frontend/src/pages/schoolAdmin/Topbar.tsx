// import { useAppSelector } from "../../app/hooks";

// interface TopbarProps {
//   onMenuClick: () => void;
// }

// const Topbar = ({
//   onMenuClick,
// }: TopbarProps) => {

//   const user = useAppSelector(
//     (state) => state.auth.user
//   );

//   const firstLetter =
//     user?.name?.charAt(0)?.toUpperCase() || "A";

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">

//       {/* Left */}
//       <div className="flex items-center gap-4">

//         {/* Mobile Menu */}
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden text-gray-600 text-2xl"
//         >
//           ☰
//         </button>

//         <div>

//           <h2 className="font-semibold text-gray-800">
//             Dashboard
//           </h2>

//           <p className="text-xs text-gray-500 hidden sm:block">
//             School administration panel
//           </p>

//         </div>

//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-3">

//         <div className="text-right hidden sm:block">

//           <p className="text-sm font-medium text-gray-800">
//             {user?.name || "School Admin"}
//           </p>

//           <p className="text-xs text-gray-500">
//             School Admin
//           </p>

//         </div>

//         <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//           {firstLetter}
//         </div>

//       </div>

//     </header>
//   );
// };

// export default Topbar;






// Topbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface TopbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuickActionClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onQuickActionClick,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const closeProfileDropdown = () => setIsProfileDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeProfileDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex min-h-20 items-center gap-4 border-b border-[#E5E7EB] bg-white px-5 lg:px-8">
      <button
        onClick={onToggleSidebar}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] lg:hidden hover:bg-[#F9FAFB] transition-colors"
      >
        <Icon icon="lucide:menu" className="text-xl" />
      </button>

      <div className="hidden max-w-xl flex-1 lg:block">
        <label className="relative block">
          <span className="sr-only">Search school records</span>
          <Icon icon="lucide:search" className="absolute left-3 top-3 text-lg text-[#6B7280]" />
          <input
            value={searchQuery}
            onChange={onSearchChange}
            className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-4 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
            placeholder="Search students, staff, classes or records"
          />
        </label>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-xs text-[#6B7280]">Campus context</p>
          <p className="text-sm font-semibold text-[#15243B]">Riverside Academy</p>
        </div>

        <button
          onClick={onQuickActionClick}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] hover:bg-[#F9FAFB] transition-colors"
          title="Quick Action"
        >
          <Icon icon="lucide:plus" className="text-xl" />
        </button>

        <button className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#15243B] hover:bg-[#F9FAFB] transition-colors">
          <Icon icon="lucide:bell" className="text-xl" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#EF4444] animate-pulse"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex min-h-11 items-center gap-2 rounded-lg px-1 hover:bg-[#F9FAFB] transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
              alt="Dr. Ananya Mehta"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#1F5FAE]/20"
            />
            <span className="hidden text-left lg:block">
              <span className="block text-sm font-semibold text-[#15243B]">Dr. Mehta</span>
              <span className="block text-xs text-[#6B7280]">Principal</span>
            </span>
            <Icon icon="lucide:chevron-down" className="hidden text-[#6B7280] lg:block" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
              <a href="#profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#15243B] hover:bg-[#F9FAFB] transition-colors">
                <Icon icon="lucide:user" /> My Profile
              </a>
              <a href="#settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#15243B] hover:bg-[#F9FAFB] transition-colors">
                <Icon icon="lucide:settings" /> Settings
              </a>
              <hr className="my-1 border-[#E5E7EB]" />
              <button
                onClick={() => alert('Logging out...')}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
              >
                <Icon icon="lucide:log-out" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;