import type { School } from "../../features/schools/school.api";

interface RecentSchoolsProps {
  schools: School[];
  loading: boolean;
}

const RecentSchools = ({
  schools,
  loading,
}: RecentSchoolsProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">
          Loading schools...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">
            Recent Schools
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Recently added schools
          </p>
        </div>

        <span className="text-sm text-blue-600">
          {schools.length} Total
        </span>
      </div>

      {schools.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No schools found.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="px-5 py-3">
                  School
                </th>

                <th className="px-5 py-3">
                  Code
                </th>

                <th className="px-5 py-3">
                  Email
                </th>

                <th className="px-5 py-3">
                  Created
                </th>
              </tr>
            </thead>

            <tbody>
              {schools.slice(0, 5).map(
                (school) => (
                  <tr
                    key={school._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {school.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {school.code}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {school.email || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {school.createdAt
                        ? new Date(
                            school.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default RecentSchools;