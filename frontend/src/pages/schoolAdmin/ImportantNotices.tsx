// ============================================
// 10. IMPORTANT NOTICES COMPONENT (ImportantNotices.tsx)
// ============================================

import React from 'react';
import { Icon } from '@iconify/react';

interface NoticeItem {
  id: string;
  title: string;
  tag: string;
  tagType: 'action' | 'academic' | 'tomorrow';
  content: string;
}

interface ImportantNoticesProps {
  notices: NoticeItem[];
}

const ImportantNotices: React.FC<ImportantNoticesProps> = ({ notices }) => {
  const getTagClass = (type: string) => {
    switch (type) {
      case 'action':
        return 'bg-[#FFF4D6] text-[#6B4B00]';
      case 'academic':
        return 'bg-[#E8F0FB] text-[#1F5FAE]';
      case 'tomorrow':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  return (
    <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#15243B]">Important notices</h2>
          <p className="mt-1 text-sm text-[#6B7280]">For staff, parents &amp; students</p>
        </div>
        <Icon icon="lucide:megaphone" className="text-xl text-[#1F5FAE]" />
      </div>
      <div className="mt-5 space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="rounded-lg border border-[#E5E7EB] p-4 hover:border-[#1F5FAE]/50 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#15243B]">{notice.title}</p>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getTagClass(notice.tagType)}`}>
                {notice.tag}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#6B7280]">{notice.content}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default ImportantNotices;