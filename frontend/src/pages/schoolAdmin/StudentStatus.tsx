// StudentStats.tsx - Complete Fix
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ALL components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudentStatsProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const StudentStats: React.FC<StudentStatsProps> = ({ selectedYear, onYearChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const data = {
    labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    datasets: [
      {
        label: 'Students',
        data: [88, 94, 96, 102, 100, 108, 110, 106, 112, 107, 109, 116],
        backgroundColor: '#1F5FAE',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm xl:col-span-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#15243B]">Student statistics</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Class-wise distribution across Classes 1–12</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex min-h-11 items-center rounded-lg border border-[#E5E7EB] px-3 text-xs font-semibold text-[#15243B] hover:bg-[#F9FAFB] transition-colors"
          >
            {selectedYear} <Icon icon="lucide:chevron-down" className="ml-1" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 rounded-lg border border-[#E5E7EB] bg-white p-1 shadow-lg z-10 animate-in slide-in-from-top-2 duration-200">
              {['2025–26', '2024–25', '2023–24'].map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onYearChange(year);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-[#F9FAFB] text-[#15243B] transition-colors"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-lg bg-[#F9FAFB] p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-[#6B7280]">Total students</p>
            <p className="mt-1 text-2xl font-bold text-[#15243B]">1,248</p>
          </div>
          <div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[#6B7280]">
                <i className="h-2 w-2 rounded-full bg-[#1F5FAE] inline-block"></i>Male 648
              </span>
              <span className="flex items-center gap-1 text-[#6B7280]">
                <i className="h-2 w-2 rounded-full bg-[#10B981] inline-block"></i>Female 600
              </span>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white">
              <span className="w-[52%] bg-[#1F5FAE]"></span>
              <span className="w-[48%] bg-[#10B981]"></span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="h-64">
            <Bar 
              ref={chartRef}
              data={data} 
              options={options} 
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default StudentStats;