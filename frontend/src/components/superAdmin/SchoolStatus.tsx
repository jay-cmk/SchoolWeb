import React from "react";

interface SchoolStatusProps {
  activeCount: number;
  inactiveCount: number;
  suspendedCount: number;
  totalCount: number;
}

const SchoolStatus: React.FC<SchoolStatusProps> = ({
  activeCount,
  inactiveCount,
  suspendedCount,
  totalCount,
}) => {
  const getPercentage = (count: number) => {
    if (!totalCount) return 0;

    return Math.round((count / totalCount) * 100);
  };

  const activePercentage =
    getPercentage(activeCount);

  const inactivePercentage =
    getPercentage(inactiveCount);

  const suspendedPercentage =
    getPercentage(suspendedCount);

  return (
    <div className="h-[247px] rounded-lg bg-white px-4 py-4">

      {/* Header */}
      <div>
        <h2 className="text-[12px] font-semibold text-[#172033]">
          School status
        </h2>

        <p className="mt-0.5 text-[9px] text-[#60708A]">
          {totalCount} schools in platform
        </p>
      </div>

      {/* Status List */}
      <div className="mt-5 space-y-3.5">

        {/* Active */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] font-medium text-[#172033]">
              Active
            </span>

            <span className="text-[9px] text-[#172033]">
              {activeCount}
            </span>
          </div>

          <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#EAF0F5]">
            <div
              className="h-full rounded-full bg-[#16A34A]"
              style={{
                width: `${activePercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Inactive */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] font-medium text-[#172033]">
              Inactive
            </span>

            <span className="text-[9px] text-[#172033]">
              {inactiveCount}
            </span>
          </div>

          <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#EAF0F5]">
            <div
              className="h-full rounded-full bg-[#2563EB]"
              style={{
                width: `${inactivePercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Suspended */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] font-medium text-[#172033]">
              Suspended
            </span>

            <span className="text-[9px] text-[#172033]">
              {suspendedCount}
            </span>
          </div>

          <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#EAF0F5]">
            <div
              className="h-full rounded-full bg-[#DC2626]"
              style={{
                width: `${suspendedPercentage}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Summary */}
      <div className="mt-5 flex items-center justify-between">

        <span className="text-[8px] text-[#60708A]">
          Total schools
        </span>

        <span className="text-[9px] font-semibold text-[#172033]">
          {totalCount}
        </span>

      </div>
    </div>
  );
};

export default SchoolStatus;