import React from "react";
import { Icon } from "@iconify/react";

type StateType = "empty" | "select" | "loading" | "error" | "saving" | "no-submissions";

interface HomeworkStateProps {
  type: StateType;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const config: Record<StateType, { icon: string; title: string; message: string }> = {
  empty: { icon: "lucide:book-open", title: "No homework found", message: "No homework matches the selected filters." },
  select: { icon: "lucide:list-filter", title: "Select class and section", message: "Choose a class and section to view homework." },
  loading: { icon: "lucide:loader-2", title: "Loading homework", message: "Please wait while homework records are loading." },
  error: { icon: "lucide:circle-alert", title: "Unable to load homework", message: "Something went wrong while loading the data." },
  saving: { icon: "lucide:loader-2", title: "Saving homework", message: "Please wait while your changes are being saved." },
  "no-submissions": { icon: "lucide:inbox", title: "No submissions yet", message: "Students have not submitted this homework yet." },
};

const HomeworkState: React.FC<HomeworkStateProps> = ({ type, title, message, onRetry }) => {
  const item = config[type];
  const spinning = type === "loading" || type === "saving";

  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon icon={item.icon} className={`h-6 w-6 ${spinning ? "animate-spin" : ""}`} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title ?? item.title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message ?? item.message}</p>
      {type === "error" && onRetry && (
        <button onClick={onRetry} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
          <Icon icon="lucide:refresh-cw" className="h-4 w-4" /> Retry
        </button>
      )}
    </div>
  );
};

export default HomeworkState;
