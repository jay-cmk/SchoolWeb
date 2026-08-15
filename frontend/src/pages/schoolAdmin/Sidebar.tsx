import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/auth.slice";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({
  open,
  onClose,
}: SidebarProps) => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static
          z-40
          top-0
          left-0
          h-screen
          w-64
          bg-white
          border-r border-gray-200
          flex flex-col
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="h-16 px-6 flex items-center border-b border-gray-200">

          <h1 className="text-xl font-bold text-blue-600">
            School SaaS
          </h1>

        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">

          {/* Dashboard */}
          <button
            onClick={() => {
              navigate(
                "/school-admin/dashboard"
              );

              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium text-left"
          >
            <span>📊</span>

            <span>
              Dashboard
            </span>
          </button>

          {/* Students */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>👨‍🎓</span>

            <span>
              Students
            </span>
          </button>

          {/* Teachers */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>👨‍🏫</span>

            <span>
              Teachers
            </span>
          </button>

          {/* Attendance */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>📋</span>

            <span>
              Attendance
            </span>
          </button>

          {/* Fees */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>💰</span>

            <span>
              Fees
            </span>
          </button>

          {/* Classes */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>🏫</span>

            <span>
              Classes
            </span>
          </button>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-left"
          >
            <span>🚪</span>

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;