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

//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">

//       <div className="flex items-center gap-4">

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
//             School management overview
//           </p>
//         </div>

//       </div>

//       <div className="flex items-center gap-3">

//         <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//           {user?.name?.charAt(0).toUpperCase()}
//         </div>

//         <div className="hidden sm:block">
//           <p className="text-sm font-medium text-gray-800">
//             {user?.name}
//           </p>

//           <p className="text-xs text-gray-500">
//             Super Admin
//           </p>
//         </div>

//       </div>

//     </header>
//   );
// };

// export default Topbar;







import React from "react";
import {
  Search,
  Bell,
  CircleHelp,
  ChevronDown,
} from "lucide-react";

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isProfileDropdownOpen: boolean;
  onToggleProfile: () => void;
  onOpenAddSchool: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  isProfileDropdownOpen,
  onToggleProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 h-[60px] bg-white">
      <div className="flex h-full items-center justify-between px-5">

        {/* Search */}
        <div className="relative w-[254px]">
          <Search
            size={13}
            strokeWidth={1.8}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#60708A]
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search schools, users or payments..."
            className="
              h-[30px]
              w-full
              rounded-lg
              bg-[#F0F4F9]
              pl-8
              pr-3
              text-[10px]
              text-[#172033]
              outline-none
              placeholder:text-[#60708A]
              focus:bg-[#EAF0F7]
            "
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button
            type="button"
            className="
              relative
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              text-[#52627A]
              hover:bg-[#F5F7FA]
            "
          >
            <Bell
              size={14}
              strokeWidth={1.8}
            />

            <span
              className="
                absolute
                right-[5px]
                top-[4px]
                h-[5px]
                w-[5px]
                rounded-full
                bg-[#DC2626]
              "
            />
          </button>

          {/* Help */}
          <button
            type="button"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              text-[#52627A]
              hover:bg-[#F5F7FA]
            "
          >
            <CircleHelp
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {/* Profile */}
          <div className="relative ml-1">

            <button
              type="button"
              onClick={onToggleProfile}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                px-1
                py-1
                hover:bg-[#F5F7FA]
              "
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Avery Morgan"
                className="
                  h-7
                  w-7
                  rounded-full
                  object-cover
                "
              />

              <div className="text-left">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    leading-[11px]
                    text-[#172033]
                  "
                >
                  Avery Morgan
                </p>

                <p
                  className="
                    mt-[2px]
                    text-[8px]
                    leading-[9px]
                    text-[#60708A]
                  "
                >
                  Super Admin
                </p>
              </div>

              <ChevronDown
                size={12}
                strokeWidth={1.8}
                className="ml-1 text-[#52627A]"
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-10
                  z-50
                  w-[170px]
                  rounded-lg
                  bg-white
                  p-1
                  shadow-[0_8px_25px_rgba(15,23,42,0.12)]
                "
              >
                <button
                  type="button"
                  className="
                    w-full
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-[10px]
                    text-[#172033]
                    hover:bg-[#F5F7FA]
                  "
                >
                  Profile
                </button>

                <button
                  type="button"
                  className="
                    w-full
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-[10px]
                    text-[#172033]
                    hover:bg-[#F5F7FA]
                  "
                >
                  Account settings
                </button>

                <button
                  type="button"
                  className="
                    w-full
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-[10px]
                    text-red-600
                    hover:bg-red-50
                  "
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;