// ============================================
// 2. SESSION INFO CARD (SessionInfoCard.tsx)
// ============================================

import React from 'react';
import { Icon } from '@iconify/react';

interface SessionData {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicStatus: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SessionInfoCardProps {
  session: SessionData;
}

const SessionInfoCard: React.FC<SessionInfoCardProps> = ({ session }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
            Active
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-500/20">
            COMPLETED
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-500/20">
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <section className="rounded-xl bg-white border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#15243B] flex items-center gap-2">
        <Icon icon="lucide:info" className="text-[#1F5FAE]" />
        Session Information
      </h2>
      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]/50">
          <dt className="text-[#6B7280]">Session Name</dt>
          <dd className="font-semibold text-[#15243B]">{session.name}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]/50">
          <dt className="text-[#6B7280]">Start Date</dt>
          <dd className="text-[#15243B]">{formatDate(session.startDate)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]/50">
          <dt className="text-[#6B7280]">End Date</dt>
          <dd className="text-[#15243B]">{formatDate(session.endDate)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]/50">
          <dt className="text-[#6B7280]">Academic Status</dt>
          <dd>{getStatusBadge(session.academicStatus)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2 border-b border-[#E5E7EB]/50">
          <dt className="text-[#6B7280]">Created Date</dt>
          <dd className="text-[#15243B]">{formatDate(session.createdAt)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-2">
          <dt className="text-[#6B7280]">Last Updated</dt>
          <dd className="text-[#15243B]">{formatDate(session.updatedAt)}</dd>
        </div>
        {session.isCurrent && (
          <div className="mt-4 p-3 bg-[#E8F0FB] rounded-lg text-center">
            <span className="text-sm font-semibold text-[#1F5FAE]">Current Active Session</span>
          </div>
        )}
      </dl>
    </section>
  );
};

export default SessionInfoCard;
