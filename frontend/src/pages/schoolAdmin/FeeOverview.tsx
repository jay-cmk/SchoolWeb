// FeeOverview.tsx
import React, { useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ALL components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FeeOverviewProps {
  total: string;
  collected: string;
  pending: string;
  percentage: number;
}

const FeeOverview: React.FC<FeeOverviewProps> = ({ total, collected, pending, percentage }) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Collected fees (₹L)',
        data: [4.8, 5.6, 6.2, 5.1, 6.9, 5.7],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointRadius: 4,
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
            size: 11,
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
          callback: function (value: any) {
            return '₹' + value + 'L';
          },
        },
      },
    },
  };

  return (
    // ... rest of JSX
    <div className="mt-5 h-48">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default FeeOverview;