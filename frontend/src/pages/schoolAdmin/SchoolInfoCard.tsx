import { useAppSelector } from "../../app/hooks";

const SchoolInfoCard = () => {

  const user = useAppSelector(
    (state) => state.auth.user
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-lg font-semibold text-gray-800">
            School Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your school account information
          </p>

        </div>

        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
          Active
        </span>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div>
          <p className="text-xs text-gray-500">
            Admin Name
          </p>

          <p className="font-medium text-gray-800 mt-1">
            {user?.name || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Email
          </p>

          <p className="font-medium text-gray-800 mt-1">
            {user?.email || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Role
          </p>

          <p className="font-medium text-gray-800 mt-1">
            School Admin
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            School ID
          </p>

          <p className="font-medium text-gray-800 mt-1 break-all">
            {user?.schoolId?.toString() || "-"}
          </p>
        </div>

      </div>

    </div>
  );
};

export default SchoolInfoCard;