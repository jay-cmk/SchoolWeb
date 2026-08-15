// interface StatCardProps {
//   title: string;
//   value: number | string;
//   description: string;
//   icon: string;
// }

// const StatCard = ({
//   title,
//   value,
//   description,
//   icon,
// }: StatCardProps) => {
//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-500">
//             {title}
//           </p>

//           <h2 className="text-3xl font-bold text-gray-800 mt-2">
//             {value}
//           </h2>

//           <p className="text-xs text-gray-500 mt-2">
//             {description}
//           </p>
//         </div>

//         <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatCard;


// import React from "react";

// import {
//   School,
//   CircleCheck,
//   Users,
//   Activity,
// } from "lucide-react";

// interface StatCardProps {
//   title: string;
//   value: string;
//   icon: string;
//   trend: string;
//   trendLabel: string;
//   accent?: "blue" | "green" | "red" | "purple";
// }

// const StatCard: React.FC<StatCardProps> = ({
//   title,
//   value,
//   icon,
//   trend,
//   trendLabel,
//   accent = "blue",
// }) => {
//   const styles = {
//     blue: {
//       bg: "bg-blue-50",
//       icon: "text-blue-600",
//       trend: "text-green-600",
//     },
//     green: {
//       bg: "bg-green-50",
//       icon: "text-green-600",
//       trend: "text-green-600",
//     },
//     red: {
//       bg: "bg-red-50",
//       icon: "text-red-600",
//       trend: "text-red-600",
//     },
//     purple: {
//       bg: "bg-purple-50",
//       icon: "text-purple-600",
//       trend: "text-green-600",
//     },
//   };

//   const currentStyle = styles[accent];

//   const renderIcon = () => {
//     const iconProps = {
//       size: 22,
//       strokeWidth: 1.8,
//     };

//     switch (icon) {
//       case "lucide:school":
//         return <School {...iconProps} />;

//       case "lucide:circle-check":
//         return <CircleCheck {...iconProps} />;

//       case "lucide:users":
//         return <Users {...iconProps} />;

//       case "lucide:activity":
//         return <Activity {...iconProps} />;

//       default:
//         return <Activity {...iconProps} />;
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm min-h-[138px]">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-slate-500">
//             {title}
//           </p>

//           <h3 className="mt-2 text-3xl font-bold text-slate-900">
//             {value}
//           </h3>
//         </div>

//         <div
//           className={`w-11 h-11 rounded-lg flex items-center justify-center ${currentStyle.bg} ${currentStyle.icon}`}
//         >
//           {renderIcon()}
//         </div>
//       </div>

//       <div className="mt-4 flex items-center gap-2">
//         <span
//           className={`text-xs font-semibold ${currentStyle.trend}`}
//         >
//           {trend}
//         </span>

//         <span className="text-xs text-slate-500">
//           {trendLabel}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default StatCard;


import React from "react";
import {
  School,
  CircleCheck,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: "school" | "circle-check" | "users" | "activity";
  trend?: string;
  trendLabel?: string;
  accent?: "blue" | "green" | "purple" | "red";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  accent = "blue",
}) => {
  const styles = {
    blue: {
      wrapper: "bg-[#EAF1FF]",
      icon: "text-[#2563EB]",
      trend: "text-[#00852D]",
    },

    green: {
      wrapper: "bg-[#EAF8EE]",
      icon: "text-[#16A34A]",
      trend: "text-[#00852D]",
    },

    purple: {
      wrapper: "bg-[#F3EDFF]",
      icon: "text-[#7C3AED]",
      trend: "text-[#7C3AED]",
    },

    red: {
      wrapper: "bg-[#FDECEC]",
      icon: "text-[#DC2626]",
      trend: "text-[#DC2626]",
    },
  };

  const currentStyle = styles[accent];

  const renderIcon = () => {
    const props = {
      size: 18,
      strokeWidth: 1.8,
    };

    switch (icon) {
      case "school":
        return <School {...props} />;

      case "circle-check":
        return <CircleCheck {...props} />;

      case "users":
        return <Users {...props} />;

      case "activity":
        return <Activity {...props} />;

      default:
        return <Activity {...props} />;
    }
  };

  return (
    <div
      className="
        w-full
        rounded-xl
        bg-white
        px-5
        py-4
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:shadow-sm
      "
    >
      <div className="flex items-start justify-between gap-4">

        {/* Left Content */}
        <div className="min-w-0">

          <p className="text-[12px] font-medium text-[#60708A]">
            {title}
          </p>

          <h3
            className="
              mt-1.5
              text-[25px]
              font-bold
              leading-none
              tracking-tight
              text-[#172033]
            "
          >
            {value}
          </h3>

          {/* Description */}
          {description && (
            <div className="mt-2 flex items-center gap-1.5">

              {(trend || trendLabel) && (
                <TrendingUp
                  size={11}
                  strokeWidth={2}
                  className={currentStyle.trend}
                />
              )}

              {trend && (
                <span
                  className={`
                    text-[10px]
                    font-semibold
                    ${currentStyle.trend}
                  `}
                >
                  {trend}
                </span>
              )}

              {trendLabel && (
                <span className="text-[10px] text-[#60708A]">
                  {trendLabel}
                </span>
              )}

              {!trend && !trendLabel && (
                <span className="text-[10px] text-[#60708A]">
                  {description}
                </span>
              )}

            </div>
          )}

        </div>

        {/* Icon */}
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${currentStyle.wrapper}
            ${currentStyle.icon}
          `}
        >
          {renderIcon()}
        </div>

      </div>
    </div>
  );
};

export default StatCard;