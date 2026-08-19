// ============================================
// 11. QUICK ACTION MODAL (QuickActionModal.tsx)
// ============================================

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: string; title: string; detail: string }) => void;
}

const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState('admission');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !detail) {
      alert('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({ type, title, detail });
      setIsSubmitting(false);
      setTitle('');
      setDetail('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="text-lg font-bold text-[#15243B]">Quick Action</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#15243B] transition-colors">
            <Icon icon="lucide:x" className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Action Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
            >
              <option value="admission">Student Admission</option>
              <option value="fee">Fee Payment</option>
              <option value="teacher">Teacher Addition</option>
              <option value="homework">Homework Posted</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Title / Subject</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Aarav Sharma admitted"
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Operational Detail</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g., Admitted to Class 4B under General Category"
              rows={3}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white p-2.5 text-sm text-[#15243B] focus:border-[#1F5FAE] focus:outline-none focus:ring-1 focus:ring-[#1F5FAE] transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center rounded-lg bg-[#1F5FAE] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#1F5FAE]/90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="lucide:loader-2" className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Action'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickActionModal;
