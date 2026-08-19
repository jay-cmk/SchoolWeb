// ============================================
// 4. STAT CARD COMPONENT (StatCard.tsx)
// ============================================

import React from 'react';
import { Icon } from '@iconify/react';

interface StatCardProps {
  icon: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral' | 'accent';
  label: string;
  value: string;
  subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, trend, trendType, label, value, subtext }) => {
  const getTrendClass = () => {
    switch (trendType) {
      case 'positive':
        return 'bg-[#E8F0FB] text-[#1F5FAE]';
      case 'negative':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      case 'accent':
        return 'bg-[#FFF4D6] text-[#6B4B00]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
          <Icon icon={icon} className="text-xl" />
        </span>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getTrendClass()}`}>
          {trend}
        </span>
      </div>
      <p className="mt-5 text-sm text-[#6B7280]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#15243B]">{value}</p>
      <p className="mt-2 text-xs text-[#6B7280]">{subtext}</p>
    </div>
  );
};

export default StatCard;
