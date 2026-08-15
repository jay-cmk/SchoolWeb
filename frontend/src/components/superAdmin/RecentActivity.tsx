import React from "react";
import {
  School,
  UserPlus,
  CreditCard,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

interface Activity {
  id: number | string;
  title: string;
  description: string;
  time: string;
  type: "school" | "user" | "payment" | "subscription" | "success";
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
}) => {
  const defaultActivities: Activity[] = [
    {
      id: 1,
      title: "New school registered",
      description: "Green Valley Public School",
      time: "12 min ago",
      type: "school",
    },
    {
      id: 2,
      title: "School admin added",
      description: "Admin account created successfully",
      time: "35 min ago",
      type: "user",
    },
    {
      id: 3,
      title: "Payment received",
      description: "Monthly subscription payment",
      time: "1 hour ago",
      type: "payment",
    },
    {
      id: 4,
      title: "Subscription renewed",
      description: "Premium plan renewed",
      time: "2 hours ago",
      type: "subscription",
    },
  ];

  const items =
    activities.length > 0
      ? activities
      : defaultActivities;

  const getIcon = (
    type: Activity["type"]
  ) => {
    const commonProps = {
      size: 13,
      strokeWidth: 1.8,
    };

    switch (type) {
      case "school":
        return <School {...commonProps} />;

      case "user":
        return <UserPlus {...commonProps} />;

      case "payment":
        return <CreditCard {...commonProps} />;

      case "subscription":
        return <RefreshCw {...commonProps} />;

      case "success":
        return <CheckCircle2 {...commonProps} />;

      default:
        return <CheckCircle2 {...commonProps} />;
    }
  };

  const getIconStyle = (
    type: Activity["type"]
  ) => {
    switch (type) {
      case "school":
        return "bg-[#EAF1FF] text-[#2563EB]";

      case "user":
        return "bg-[#F2ECFF] text-[#7C3AED]";

      case "payment":
        return "bg-[#EAF8EE] text-[#16A34A]";

      case "subscription":
        return "bg-[#FFF5E6] text-[#EA8A00]";

      case "success":
        return "bg-[#EAF8EE] text-[#16A34A]";

      default:
        return "bg-[#EAF1FF] text-[#2563EB]";
    }
  };

  return (
    <section className="rounded-lg bg-white px-4 py-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[12px] font-semibold text-[#172033]">
          Recent activity
        </h2>

        <p className="mt-0.5 text-[9px] text-[#60708A]">
          Latest platform activity
        </p>
      </div>

      {/* Activity List */}
      <div className="space-y-4">

        {items.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2.5"
          >

            {/* Icon */}
            <div
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                ${getIconStyle(activity.type)}
              `}
            >
              {getIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">

              <div className="flex items-start justify-between gap-2">

                <p className="truncate text-[9px] font-semibold text-[#172033]">
                  {activity.title}
                </p>

                <span className="shrink-0 text-[8px] text-[#8A97A8]">
                  {activity.time}
                </span>

              </div>

              <p className="mt-0.5 truncate text-[8px] text-[#60708A]">
                {activity.description}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* View All */}
      <button
        type="button"
        className="
          mt-5
          w-full
          text-center
          text-[9px]
          font-medium
          text-[#2563EB]
          hover:text-[#1D4ED8]
        "
      >
        View all activity
      </button>

    </section>
  );
};

export default RecentActivity;