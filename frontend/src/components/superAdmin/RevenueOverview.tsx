import React, { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface RevenueOverviewProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  period,
  onPeriodChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const periods = [
    "Last 30 days",
    "Last 6 months",
    "Last 12 months",
  ];

  const getChartData = (): ChartData<"bar"> => {
    switch (period) {
      case "Last 30 days":
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Revenue ($)",
              data: [11200, 12400, 11800, 12860],
              backgroundColor: [
                "#EAF1FF",
                "#EAF1FF",
                "#EAF1FF",
                "#2563EB",
              ],
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        };

      case "Last 12 months":
        return {
          labels: [
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Jan",
            "Feb",
            "Mar",
          ],
          datasets: [
            {
              label: "Revenue ($)",
              data: [
                32000,
                34000,
                35500,
                37000,
                39000,
                41000,
                42000,
                43500,
                44000,
                45500,
                46200,
                48260,
              ],
              backgroundColor: (context) => {
                const index = context.dataIndex;

                return index === 11
                  ? "#2563EB"
                  : "#EAF1FF";
              },
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        };

      case "Last 6 months":
      default:
        return {
          labels: [
            "Oct",
            "Nov",
            "Dec",
            "Jan",
            "Feb",
            "Mar",
          ],
          datasets: [
            {
              label: "Revenue ($)",
              data: [
                42000,
                43500,
                44000,
                45500,
                46200,
                48260,
              ],
              backgroundColor: (context) => {
                const index = context.dataIndex;

                return index === 5
                  ? "#2563EB"
                  : "#EAF1FF";
              },
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        };
    }
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#172033",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,

        callbacks: {
          label: (context) =>
            `Revenue: $${context.parsed.y?.toLocaleString() ?? 0}`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#606F86",

          font: {
            family: "Inter",
            size: 12,
          },
        },
      },

      y: {
        grid: {
          color: "#EEF2F7",
        },

        ticks: {
          color: "#606F86",

          font: {
            family: "Inter",
            size: 12,
          },

          callback: (value) =>
            `$${Number(value) / 1000}k`,
        },
      },
    },
  };

  return (
    <section className="bg-white border border-[#DCE3EE] rounded-xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#172033]">
            Revenue overview
          </h2>

          <p className="text-sm text-[#606F86]">
            Monthly recurring revenue
          </p>
        </div>

        {/* Period Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsDropdownOpen(!isDropdownOpen)
            }
            className="rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-2 hover:bg-[#EEF2F7] transition-colors text-[#172033]"
          >
            {period}

            <Icon
              icon="lucide:chevron-down"
              className="text-[#606F86]"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-[#DCE3EE] rounded-lg shadow-lg py-1 text-sm z-20">
              {periods.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    onPeriodChange(p);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#EEF2F7] transition-colors ${
                    p === period
                      ? "text-[#2563EB] font-semibold"
                      : "text-[#172033]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[220px] relative">
        <Bar
          data={getChartData()}
          options={options}
        />
      </div>
    </section>
  );
};

export default RevenueOverview;