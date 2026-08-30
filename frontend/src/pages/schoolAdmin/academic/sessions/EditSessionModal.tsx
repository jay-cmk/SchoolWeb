// ============================================
// 4. EDIT SESSION MODAL (EditSessionModal.tsx)
// ============================================

import React, { useState, useEffect } from 'react';
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
  stats?: {
    classes: number;
    sections: number;
    students: number;
    subjects: number;
  };
}




interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionData;
  onSave: (updatedSession: SessionData) => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({ isOpen, onClose, session, onSave }) => {
  const [name, setName] = useState(session.name);
  const [startDate, setStartDate] = useState(session.startDate.split('T')[0]);
  const [endDate, setEndDate] = useState(session.endDate.split('T')[0]);
  const [status, setStatus] = useState(session.academicStatus);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(session.name);
    setStartDate(session.startDate.split('T')[0]);
    setEndDate(session.endDate.split('T')[0]);
    setStatus(session.academicStatus);
  }, [session, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave({
        ...session,
        name,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        academicStatus: status as 'ACTIVE' | 'COMPLETED' | 'UPCOMING',
        updatedAt: new Date().toISOString(),
      });
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl border border-[#E5E7EB] shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <h3 className="text-lg font-bold text-[#15243B]">Edit Academic Session</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#15243B] transition-colors">
            <Icon icon="lucide:x" className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Session Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#15243B] focus:outline-none focus:ring-2 focus:ring-[#1F5FAE]/50"
              placeholder="e.g., 2026-27"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#15243B] focus:outline-none focus:ring-2 focus:ring-[#1F5FAE]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#15243B] focus:outline-none focus:ring-2 focus:ring-[#1F5FAE]/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Academic Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'COMPLETED' | 'UPCOMING')}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#15243B] focus:outline-none focus:ring-2 focus:ring-[#1F5FAE]/50"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-[#1F5FAE] text-white text-sm font-semibold hover:bg-[#1F5FAE]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Icon icon="lucide:loader-2" className="animate-spin text-lg" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSessionModal;