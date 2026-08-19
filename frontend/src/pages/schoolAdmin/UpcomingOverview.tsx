// ============================================
// 8. UPCOMING EVENTS COMPONENT (UpcomingEvents.tsx)
// ============================================

import React from 'react';

interface EventItem {
  id: string;
  month: string;
  day: string;
  title: string;
  details: string;
  type: 'primary' | 'accent';
}

interface UpcomingEventsProps {
  events: EventItem[];
  onAddEvent: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onAddEvent }) => {
  return (
    <article className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#15243B]">Upcoming events</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Exams &amp; school calendar</p>
          </div>
          <button
            onClick={onAddEvent}
            className="min-h-11 text-sm font-semibold text-[#1F5FAE] hover:underline transition-colors"
          >
            Add Event
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3 group hover:bg-[#F9FAFB] p-2 rounded-lg transition-colors">
              <div
                className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg ${
                  event.type === 'primary' ? 'bg-[#E8F0FB] text-[#1F5FAE]' : 'bg-[#FFF4D6] text-[#6B4B00]'
                }`}
              >
                <span className="text-xs font-semibold">{event.month}</span>
                <span className="text-base font-bold">{event.day}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#15243B]">{event.title}</p>
                <p className="mt-1 text-xs text-[#6B7280]">{event.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default UpcomingEvents;
