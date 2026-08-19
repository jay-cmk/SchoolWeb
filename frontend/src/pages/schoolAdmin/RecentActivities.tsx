// ============================================
// 9. RECENT ACTIVITIES COMPONENT (RecentActivities.tsx)
// ============================================

import React from 'react';
import { Icon } from '@iconify/react';

interface ActivityItem {
  id: string;
  type: 'admission' | 'fee' | 'teacher' | 'homework';
  title: string;
  detail: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: ActivityItem[];
  onViewAll: () => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onViewAll }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'admission':
        return 'lucide:user-plus';
      case 'fee':
        return 'lucide:credit-card';
      case 'teacher':
        return 'lucide:user-round-plus';
      case 'homework':
        return 'lucide:book-open-check';
      default:
        return 'lucide:info';
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'admission':
        return 'bg-[#E8F0FB] text-[#1F5FAE]';
      case 'fee':
        return 'bg-[#ECFDF5] text-[#10B981]';
      case 'teacher':
        return 'bg-[#E8F0FB] text-[#1F5FAE]';
      case 'homework':
        return 'bg-[#FFF4D6] text-[#6B4B00]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  return (
    <article className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm xl:col-span-3">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] p-5">
        <div>
          <h2 className="text-lg font-semibold text-[#15243B]">Recent activities</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Latest school operations recorded today</p>
        </div>
        <button onClick={onViewAll} className="text-sm font-semibold text-[#1F5FAE] hover:underline transition-colors">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F9FAFB] text-xs text-[#6B7280]">
            <tr>
              <th className="px-5 py-3 font-semibold">Activity</th>
              <th className="px-5 py-3 font-semibold">Operational detail</th>
              <th className="px-5 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${getBgClass(activity.type)}`}>
                      <Icon icon={getIcon(activity.type)} className="text-lg" />
                    </span>
                    <span className="font-semibold text-[#15243B]">{activity.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#6B7280]">{activity.detail}</td>
                <td className="px-5 py-4 text-[#6B7280]">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default RecentActivities;
