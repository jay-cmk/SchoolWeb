import { useAppSelector } from "../../app/hooks";

const WelcomeCard = () => {

  const user = useAppSelector(
    (state) => state.auth.user
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-sm text-blue-600 font-medium">
            Welcome back
          </p>

          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            {user?.name || "School Admin"}
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your school from your
            administration dashboard.
          </p>

        </div>

        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-3xl">
          🏫
        </div>

      </div>

    </div>
  );
};

export default WelcomeCard;