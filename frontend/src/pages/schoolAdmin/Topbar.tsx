import { useAppSelector } from "../../app/hooks";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({
  onMenuClick,
}: TopbarProps) => {

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 text-2xl"
        >
          ☰
        </button>

        <div>

          <h2 className="font-semibold text-gray-800">
            Dashboard
          </h2>

          <p className="text-xs text-gray-500 hidden sm:block">
            School administration panel
          </p>

        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        <div className="text-right hidden sm:block">

          <p className="text-sm font-medium text-gray-800">
            {user?.name || "School Admin"}
          </p>

          <p className="text-xs text-gray-500">
            School Admin
          </p>

        </div>

        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          {firstLetter}
        </div>

      </div>

    </header>
  );
};

export default Topbar;