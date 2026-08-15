interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  active?: boolean;
}

const ModuleCard = ({
  title,
  description,
  icon,
  active = false,
}: ModuleCardProps) => {

  return (
    <div
      className={`
        bg-white
        rounded-xl
        border
        border-gray-200
        p-5
        shadow-sm
        ${
          active
            ? "hover:shadow-md cursor-pointer"
            : "opacity-80"
        }
      `}
    >

      <div className="flex items-start justify-between">

        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
          {icon}
        </div>

        {!active && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
        )}

      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-4">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 leading-6">
        {description}
      </p>

    </div>
  );
};

export default ModuleCard;