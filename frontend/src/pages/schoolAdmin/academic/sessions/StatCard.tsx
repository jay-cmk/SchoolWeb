// ============================================
// 1. STAT CARD COMPONENT (StatCard.tsx)
// ============================================

import React from 'react';
import { Icon } from '@iconify/react';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="rounded-xl bg-white border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-lg bg-[#E8F0FB] flex items-center justify-center text-[#1F5FAE] mb-4">
        <Icon icon={icon} className="text-xl" />
      </div>
      <p className="text-2xl font-bold text-[#15243B]">{value}</p>
      <p className="text-sm text-[#6B7280]">{label}</p>
    </div>
  );
};

export default StatCard;
