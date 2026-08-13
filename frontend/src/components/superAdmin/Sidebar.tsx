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
          top-0 left-0
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
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">
            School SaaS
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <button
            onClick={() => {
              navigate(
                "/super-admin/dashboard"
              );
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium text-left"
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate(
                "/super-admin/schools"
              );
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>🏫</span>
            Schools
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 text-left"
          >
            <span>👤</span>
            Profile
          </button>

        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-left"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;