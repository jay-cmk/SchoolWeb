interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            {description}
          </p>
        </div>

        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;