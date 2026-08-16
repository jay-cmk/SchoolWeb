// import { useNavigate } from "react-router-dom";

// import { useAppDispatch } from "../../app/hooks";
// import { logout } from "../../features/auth/auth.slice";

// interface SidebarProps {
//   open: boolean;
//   onClose: () => void;
// }

// const Sidebar = ({
//   open,
//   onClose,
// }: SidebarProps) => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <>
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/30 z-30 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`
//           fixed lg:static
//           z-40
//           top-0 left-0
//           h-screen
//           w-64
//           bg-white
//           border-r border-gray-200
//           flex flex-col
//           transition-transform
//           duration-300
//           ${
//             open
//               ? "translate-x-0"
//               : "-translate-x-full lg:translate-x-0"
//           }
//         `}
//       >
//         <div className="h-16 flex items-center px-6 border-b border-gray-200">
//           <h1 className="text-xl font-bold text-blue-600">
//             School SaaS
//           </h1>
//         </div>

//         <nav className="flex-1 p-4 space-y-2">

//           <button
//             onClick={() => {
//               navigate(
//                 "/super-admin/dashboard"
//               );
//               onClose();
//             }}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium text-left"
//           >
//             <span>📊</span>
//             Dashboard
//           </button>

//           <button
//             onClick={() => {
//               navigate(
//                 "/super-admin/schools"
//               );
//               onClose();
//             }}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
//           >
//             <span>🏫</span>
//             Schools
//           </button>

//           <button
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
//           >
//             <span>👤</span>
//             Profile
//           </button>

//         </nav>

//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-left"
//           >
//             <span>🚪</span>
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;





import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  School,
  Plus,
  FileText,
  Shield,
  Users,
  RefreshCw,
  CreditCard,
  Layers3,
  List,
  CircleHelp,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/auth.slice";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/super-admin/dashboard",
    },
    {
      label: "Schools",
      icon: School,
      path: "/super-admin/schools",
    },
    {
      label: "Add School",
      icon: Plus,
      path: "/super-admin/schools/add",
    },
    {
      label: "School Details",
      icon: FileText,
      path: "/super-admin/schools/details",
    },
    {
      label: "School Admins",
      icon: Shield,
      path: "/super-admin/school-admins",
    },
    {
      label: "Users",
      icon: Users,
      path: "/super-admin/users",
    },
    {
      label: "Subscriptions",
      icon: RefreshCw,
      path: "/super-admin/subscriptions",
    },
    {
      label: "Payments",
      icon: CreditCard,
      path: "/super-admin/payments",
    },
    {
      label: "Plans",
      icon: Layers3,
      path: "/super-admin/plans",
    },
    {
      label: "Reports",
      icon: List,
      path: "/super-admin/reports",
    },
  ];

  const bottomItems = [
    {
      label: "Help & Support",
      icon: CircleHelp,
      path: "/super-admin/support",
    },
    {
      label: "System Settings",
      icon: Settings,
      path: "/super-admin/settings",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Redux state clear
    dispatch(logout());

    // Login page par redirect
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        h-screen
        w-[220px]
        bg-white
        overflow-hidden
      "
    >
      <div className="flex h-full flex-col px-4 py-5">

        {/* ================= LOGO ================= */}

        <div className="flex items-center gap-3 px-2">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#2563EB]
            "
          >
            <GraduationCap
              size={20}
              strokeWidth={1.8}
              className="text-white"
            />
          </div>

          <div className="min-w-0">

            <h1
              className="
                text-[15px]
                font-bold
                leading-[18px]
                text-[#172033]
              "
            >
              Northstar
            </h1>

            <p
              className="
                mt-1
                text-[9px]
                leading-[11px]
                text-[#60708A]
              "
            >
              Platform control
            </p>

          </div>

        </div>

        {/* ================= MAIN MENU ================= */}

        <nav className="mt-7 space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleNavigation(item.path)
                }
                className={`
                  flex
                  h-[38px]
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  text-left
                  transition-colors
                  ${
                    active
                      ? "bg-[#EAF1FF] text-[#2563EB]"
                      : "text-[#52627A] hover:bg-[#F7F9FC] hover:text-[#172033]"
                  }
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className="shrink-0"
                />

                <span
                  className={`
                    truncate
                    text-[12px]
                    ${
                      active
                        ? "font-semibold"
                        : "font-medium"
                    }
                  `}
                >
                  {item.label}
                </span>

              </button>
            );
          })}

        </nav>

        {/* ================= BOTTOM MENU ================= */}

        <div className="mt-auto">

          {/* Divider */}
          <div className="mb-4 h-px bg-[#E7EBF1]" />

          <div className="space-y-1">

            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className={`
                    flex
                    h-[38px]
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-left
                    transition-colors
                    ${
                      active
                        ? "bg-[#EAF1FF] text-[#2563EB]"
                        : "text-[#52627A] hover:bg-[#F7F9FC] hover:text-[#172033]"
                    }
                  `}
                >

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span
                    className={`
                      truncate
                      text-[12px]
                      ${
                        active
                          ? "font-semibold"
                          : "font-medium"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                </button>
              );
            })}

            {/* ================= LOGOUT ================= */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex
                h-[38px]
                w-full
                items-center
                gap-3
                rounded-lg
                px-3
                text-left
                text-[#52627A]
                transition-colors
                hover:bg-[#FFF1F1]
                hover:text-[#DC2626]
              "
            >

              <LogOut
                size={17}
                strokeWidth={1.8}
                className="shrink-0"
              />

              <span
                className="
                  truncate
                  text-[12px]
                  font-medium
                "
              >
                Logout
              </span>

            </button>

          </div>

        </div>

      </div>
    </aside>
  );
};

export default Sidebar;