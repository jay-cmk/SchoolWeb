import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';

// --- TYPES & INTERFACES ---

interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  adminName: string;
  adminEmail: string;
  students: number;
  teachers: number;
  plan: 'Premium' | 'Enterprise' | 'Standard';
  status: 'Active' | 'Inactive' | 'Suspended';
  createdDate: string;
}

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  change: string;
  subtext: string;
  type: 'primary' | 'tertiary' | 'accent' | 'destructive';
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  planFilter: string;
  onPlanChange: (plan: string) => void;
  cityFilter: string;
  onCityChange: (city: string) => void;
  onReset: () => void;
  cities: string[];
}

interface SchoolRowProps {
  school: School;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onStatusChange: (id: string, status: 'Active' | 'Inactive' | 'Suspended') => void;
  onDelete: (id: string) => void;
}

interface SchoolTableProps {
  schools: School[];
  activeActionMenuId: string | null;
  onToggleActionMenu: (id: string | null) => void;
  onStatusChange: (id: string, status: 'Active' | 'Inactive' | 'Suspended') => void;
  onDelete: (id: string) => void;
}

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (school: Omit<School, 'id' | 'createdDate'>) => void;
}

// --- MOCK DATA ---

const INITIAL_SCHOOLS: School[] = [
  {
    id: '1',
    name: 'Riverside Academy',
    code: 'RSA001',
    city: 'Pune',
    state: 'Maharashtra',
    adminName: 'Dr. Mehta',
    adminEmail: 'mehta@riverside.edu',
    students: 1248,
    teachers: 86,
    plan: 'Premium',
    status: 'Active',
    createdDate: '2024-01-12',
  },
  {
    id: '2',
    name: 'Greenwood High',
    code: 'GWH204',
    city: 'Bengaluru',
    state: 'Karnataka',
    adminName: 'Ananya Iyer',
    adminEmail: 'ananya@greenwood.edu',
    students: 2016,
    teachers: 134,
    plan: 'Enterprise',
    status: 'Active',
    createdDate: '2023-03-04',
  },
  {
    id: '3',
    name: 'Indus Springs School',
    code: 'ISS078',
    city: 'Jaipur',
    state: 'Rajasthan',
    adminName: 'R. Kapoor',
    adminEmail: 'kapoor@indussprings.edu',
    students: 742,
    teachers: 51,
    plan: 'Standard',
    status: 'Inactive',
    createdDate: '2025-06-27',
  },
  {
    id: '4',
    name: 'Cedar Valley School',
    code: 'CVS319',
    city: 'Delhi',
    state: 'NCR',
    adminName: 'Neeraj Singh',
    adminEmail: 'neeraj@cedarvalley.edu',
    students: 968,
    teachers: 62,
    plan: 'Premium',
    status: 'Suspended',
    createdDate: '2024-09-08',
  },
  {
    id: '5',
    name: 'Oakridge International',
    code: 'ORI502',
    city: 'Hyderabad',
    state: 'Telangana',
    adminName: 'S. Rao',
    adminEmail: 'srao@oakridge.edu',
    students: 1850,
    teachers: 120,
    plan: 'Enterprise',
    status: 'Active',
    createdDate: '2022-11-15',
  },
  {
    id: '6',
    name: 'St. Xavier\'s Collegiate',
    code: 'SXC109',
    city: 'Kolkata',
    state: 'West Bengal',
    adminName: 'Fr. Benedict',
    adminEmail: 'benedict@stxaviers.edu',
    students: 1500,
    teachers: 95,
    plan: 'Premium',
    status: 'Active',
    createdDate: '2021-07-19',
  },
  {
    id: '7',
    name: 'The Doon School',
    code: 'TDS441',
    city: 'Dehradun',
    state: 'Uttarakhand',
    adminName: 'M. Wheeler',
    adminEmail: 'wheeler@doon.edu',
    students: 600,
    teachers: 80,
    plan: 'Enterprise',
    status: 'Active',
    createdDate: '2020-05-10',
  },
  {
    id: '8',
    name: 'Delhi Public School',
    code: 'DPS882',
    city: 'Delhi',
    state: 'NCR',
    adminName: 'Alok Sharma',
    adminEmail: 'alok@dps.edu',
    students: 3200,
    teachers: 210,
    plan: 'Enterprise',
    status: 'Active',
    createdDate: '2019-02-28',
  },
  {
    id: '9',
    name: 'Sanskriti School',
    code: 'SAN303',
    city: 'Pune',
    state: 'Maharashtra',
    adminName: 'Gauri Sen',
    adminEmail: 'gauri@sanskriti.edu',
    students: 1100,
    teachers: 75,
    plan: 'Standard',
    status: 'Inactive',
    createdDate: '2025-01-15',
  },
  {
    id: '10',
    name: 'Vasant Valley School',
    code: 'VVS901',
    city: 'Delhi',
    state: 'NCR',
    adminName: 'Rekha Krishnan',
    adminEmail: 'rekha@vasantvalley.edu',
    students: 1350,
    teachers: 98,
    plan: 'Premium',
    status: 'Active',
    createdDate: '2023-10-05',
  },
  {
    id: '11',
    name: 'The Heritage School',
    code: 'THS771',
    city: 'Kolkata',
    state: 'West Bengal',
    adminName: 'S. Bose',
    adminEmail: 'bose@heritage.edu',
    students: 2100,
    teachers: 145,
    plan: 'Premium',
    status: 'Active',
    createdDate: '2022-08-12',
  },
  {
    id: '12',
    name: 'Bishop Cotton School',
    code: 'BCS112',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    adminName: 'Roy Christopher',
    adminEmail: 'roy@bishopcotton.edu',
    students: 550,
    teachers: 48,
    plan: 'Standard',
    status: 'Suspended',
    createdDate: '2024-04-22',
  }
];

// --- SUB-COMPONENTS ---

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, subtext, type }) => {
  const typeStyles = {
    primary: {
      bg: 'bg-[#EFF6FF] text-[#3B82F6]',
      badge: 'bg-[#EFF6FF] text-[#3B82F6]',
    },
    tertiary: {
      bg: 'bg-[#ECFDF5] text-[#10B981]',
      badge: 'bg-[#ECFDF5] text-[#10B981]',
    },
    accent: {
      bg: 'bg-[#F5F3FF] text-[#8B5CF6]',
      badge: 'bg-[#F3F4F6] text-[#6B7280]',
    },
    destructive: {
      bg: 'bg-[#FEF2F2] text-[#EF4444]',
      badge: 'bg-[#F3F4F6] text-[#6B7280]',
    },
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeStyles[type].bg}`}>
          <Icon icon={icon} className="text-xl" />
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${typeStyles[type].badge}`}>
          {change}
        </span>
      </div>
      <p className="mt-5 text-sm text-[#6B7280]">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#111827]">{value}</p>
      <p className="mt-1 text-xs text-[#6B7280]">{subtext}</p>
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  planFilter,
  onPlanChange,
  cityFilter,
  onCityChange,
  onReset,
  cities,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const planDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (planDropdownRef.current && !planDropdownRef.current.contains(event.target as Node)) {
        setIsPlanOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4 border-b border-[#E5E7EB] p-5 xl:flex-row xl:items-center">
      <div className="relative flex-1">
        <Icon icon="lucide:search" className="absolute left-3 top-3.5 text-lg text-[#6B7280]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          placeholder="Search schools by name, code or email..."
        />
      </div>

      {/* Status Filter */}
      <div className="relative" ref={statusDropdownRef}>
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
        >
          Status: {statusFilter}
          <Icon icon="lucide:chevron-down" className="text-lg text-[#6B7280]" />
        </button>
        {isStatusOpen && (
          <div className="absolute left-0 z-10 mt-1 w-40 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">
            {['All', 'Active', 'Inactive', 'Suspended'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setIsStatusOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Plan Filter */}
      <div className="relative" ref={planDropdownRef}>
        <button
          onClick={() => setIsPlanOpen(!isPlanOpen)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
        >
          Plan: {planFilter}
          <Icon icon="lucide:chevron-down" className="text-lg text-[#6B7280]" />
        </button>
        {isPlanOpen && (
          <div className="absolute left-0 z-10 mt-1 w-40 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">
            {['All', 'Premium', 'Enterprise', 'Standard'].map((plan) => (
              <button
                key={plan}
                onClick={() => {
                  onPlanChange(plan);
                  setIsPlanOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
              >
                {plan}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City Filter */}
      <div className="relative" ref={cityDropdownRef}>
        <button
          onClick={() => setIsCityOpen(!isCityOpen)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] hover:bg-[#F9FAFB] transition-colors"
        >
          City: {cityFilter}
          <Icon icon="lucide:chevron-down" className="text-lg text-[#6B7280]" />
        </button>
        {isCityOpen && (
          <div className="absolute left-0 z-10 mt-1 w-48 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg max-h-60 overflow-y-auto">
            <button
              onClick={() => {
                onCityChange('All');
                setIsCityOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  onCityChange(city);
                  setIsCityOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="min-h-11 px-2 text-sm font-semibold text-[#3B82F6] hover:text-[#3B82F6]/80 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

const SchoolRow: React.FC<SchoolRowProps> = ({
  school,
  isMenuOpen,
  onToggleMenu,
  onStatusChange,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isMenuOpen) onToggleMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, onToggleMenu]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#ECFDF5] text-[#10B981]';
      case 'Inactive':
        return 'bg-[#FEF3C7] text-[#F59E0B]';
      case 'Suspended':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Premium':
        return 'bg-[#F5F3FF] text-[#8B5CF6]';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280]';
    }
  };

  const getAvatarBg = (id: string) => {
    const colors = [
      'bg-[#EFF6FF] text-[#3B82F6]',
      'bg-[#F5F3FF] text-[#8B5CF6]',
      'bg-[#ECFDF5] text-[#10B981]',
      'bg-[#FEF2F2] text-[#EF4444]',
    ];
    const index = parseInt(id) % colors.length;
    return colors[isNaN(index) ? 0 : index];
  };

  return (
    <tr className="hover:bg-[#F9FAFB] transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm ${getAvatarBg(school.id)}`}>
            {getInitials(school.name)}
          </div>
          <div>
            <button className="font-semibold text-[#111827] hover:text-[#3B82F6] transition-colors text-left">
              {school.name}
            </button>
            <p className="text-xs text-[#6B7280]">
              {school.city}, {school.state}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 font-mono text-xs text-[#111827]">{school.code}</td>
      <td className="px-5 py-4">
        <p className="font-medium text-[#111827]">{school.adminName}</p>
        <p className="text-xs text-[#6B7280]">{school.adminEmail}</p>
      </td>
      <td className="px-5 py-4 text-[#111827]">{school.students.toLocaleString()}</td>
      <td className="px-5 py-4 text-[#111827]">{school.teachers}</td>
      <td className="px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPlanBadge(school.plan)}`}>
          {school.plan}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(school.status)}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${
            school.status === 'Active' ? 'bg-[#10B981]' : 
            school.status === 'Inactive' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
          }`}></span>
          {school.status}
        </span>
      </td>
      <td className="px-5 py-4 text-[#6B7280]">
        {new Date(school.createdDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </td>
      <td className="px-5 py-4 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className="min-h-11 rounded-lg px-2 text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <Icon icon="lucide:ellipsis" className="text-xl" />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-5 top-12 z-20 w-48 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg"
          >
            <button
              onClick={() => onStatusChange(school.id, 'Active')}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
            >
              <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
              Mark Active
            </button>
            <button
              onClick={() => onStatusChange(school.id, 'Inactive')}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
            >
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]"></span>
              Mark Inactive
            </button>
            <button
              onClick={() => onStatusChange(school.id, 'Suspended')}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
            >
              <span className="h-2 w-2 rounded-full bg-[#EF4444]"></span>
              Suspend School
            </button>
            <div className="border-t border-[#E5E7EB] my-1"></div>
            <button
              onClick={() => onDelete(school.id)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#FEF2F2]"
            >
              <Icon icon="lucide:trash-2" className="text-sm" />
              Delete School
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

const SchoolTable: React.FC<SchoolTableProps> = ({
  schools,
  activeActionMenuId,
  onToggleActionMenu,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left">
        <thead className="bg-[#F9FAFB] text-xs uppercase tracking-wide text-[#6B7280]">
          <tr>
            <th className="px-5 py-4 font-semibold">School</th>
            <th className="px-5 py-4 font-semibold">School Code</th>
            <th className="px-5 py-4 font-semibold">School Admin</th>
            <th className="px-5 py-4 font-semibold">Students</th>
            <th className="px-5 py-4 font-semibold">Teachers</th>
            <th className="px-5 py-4 font-semibold">Subscription Plan</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Created Date</th>
            <th className="px-5 py-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB] text-sm">
          {schools.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-5 py-8 text-center text-[#6B7280]">
                No schools found matching the filters.
              </td>
            </tr>
          ) : (
            schools.map((school) => (
              <SchoolRow
                key={school.id}
                school={school}
                isMenuOpen={activeActionMenuId === school.id}
                onToggleMenu={() =>
                  onToggleActionMenu(activeActionMenuId === school.id ? null : school.id)
                }
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(totalCount / pageSize);
  const startRow = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalCount);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] px-5 py-4 text-sm text-[#6B7280] md:flex-row md:items-center md:justify-between">
      <p>
        Showing <span className="font-semibold text-[#111827]">{startRow}–{endRow}</span> of{' '}
        <span className="font-semibold text-[#111827]">{totalCount}</span> schools
      </p>
      <div className="flex items-center gap-3">
        <div className="relative" ref={pageSizeRef}>
          <button
            onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
            className="flex items-center rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-[#111827] hover:bg-[#F9FAFB] transition-colors"
          >
            {pageSize} / page <Icon icon="lucide:chevron-down" className="ml-1" />
          </button>
          {isPageSizeOpen && (
            <div className="absolute bottom-12 left-0 z-10 w-24 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg">
              {[5, 10, 20, 50].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    onPageSizeChange(size);
                    setIsPageSizeOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-[#111827] hover:bg-[#F9FAFB]"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-3 text-[#111827] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-h-11 rounded-lg px-4 font-semibold transition-colors ${
              currentPage === page
                ? 'bg-[#3B82F6] text-white'
                : 'text-[#111827] hover:bg-[#F9FAFB]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-3 text-[#111827] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [students, setStudents] = useState('');
  const [teachers, setTeachers] = useState('');
  const [plan, setPlan] = useState<'Premium' | 'Enterprise' | 'Standard'>('Standard');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Active');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onAdd({
        name,
        code,
        city,
        state,
        adminName,
        adminEmail,
        students: parseInt(students) || 0,
        teachers: parseInt(teachers) || 0,
        plan,
        status,
      });
      setIsLoading(false);
      onClose();
      // Reset form
      setName('');
      setCode('');
      setCity('');
      setState('');
      setAdminName('');
      setAdminEmail('');
      setStudents('');
      setTeachers('');
      setPlan('Standard');
      setStatus('Active');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <h2 className="text-xl font-bold text-[#111827]">Add New School</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827]">
            <Icon icon="lucide:x" className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">School Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. Riverside Academy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">School Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. RSA001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. Pune"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. Maharashtra"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Admin Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. Dr. Mehta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. mehta@riverside.edu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Students Count</label>
              <input
                type="number"
                required
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Teachers Count</label>
              <input
                type="number"
                required
                value={teachers}
                onChange={(e) => setTeachers(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                placeholder="e.g. 80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Subscription Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E5E7EB] pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-5 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#3B82F6]/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Icon icon="lucide:loader-2" className="animate-spin text-lg" />
                  Saving...
                </>
              ) : (
                'Save School'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const Schools: React.FC = () => {
  // State variables
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Derived list of unique cities for filter dropdown
  const cities = Array.from(new Set(schools.map((s) => s.city))).sort();

  // Event Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePlanFilterChange = (plan: string) => {
    setPlanFilter(plan);
    setCurrentPage(1);
  };

  const handleCityFilterChange = (city: string) => {
    setCityFilter(city);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPlanFilter('All');
    setCityFilter('All');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleToggleActionMenu = (id: string | null) => {
    setActiveActionMenuId(id);
  };

  const handleOpenAddSchoolModal = () => {
    setIsAddSchoolModalOpen(true);
  };

  const handleCloseAddSchoolModal = () => {
    setIsAddSchoolModalOpen(false);
  };

  const handleAddSchool = (newSchool: Omit<School, 'id' | 'createdDate'>) => {
    const schoolWithMeta: School = {
      ...newSchool,
      id: (schools.length + 1).toString(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setSchools([schoolWithMeta, ...schools]);
  };

  const handleStatusChange = (id: string, newStatus: 'Active' | 'Inactive' | 'Suspended') => {
    setSchools(
      schools.map((school) => (school.id === id ? { ...school, status: newStatus } : school))
    );
    setActiveActionMenuId(null);
  };

  const handleDeleteSchool = (id: string) => {
    if (confirm('Are you sure you want to delete this school?')) {
      setSchools(schools.filter((school) => school.id !== id));
      setActiveActionMenuId(null);
    }
  };

  // Filter & Search Logic
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || school.status === statusFilter;
    const matchesPlan = planFilter === 'All' || school.plan === planFilter;
    const matchesCity = cityFilter === 'All' || school.city === cityFilter;

    return matchesSearch && matchesStatus && matchesPlan && matchesCity;
  });

  // Pagination Logic
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Metrics calculations
  const totalSchools = schools.length;
  const activeSchools = schools.filter((s) => s.status === 'Active').length;
  const inactiveSchools = schools.filter((s) => s.status === 'Inactive').length;
  const suspendedSchools = schools.filter((s) => s.status === 'Suspended').length;

  const activePercentage = totalSchools > 0 ? ((activeSchools / totalSchools) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen w-full bg-[#F7F9FC] p-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#3B82F6]">Super Admin / Schools</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Schools</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Manage all schools registered on the School ERP SaaS platform.
          </p>
        </div>
        <button
          onClick={handleOpenAddSchoolModal}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#3B82F6]/90 transition-colors"
        >
          <Icon icon="lucide:plus" className="text-lg" />
          Add School
        </button>
      </div>

      {/* Stats Section */}
      <section className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="lucide:school"
          title="Total Schools"
          value={totalSchools}
          change="+12.4%"
          subtext="28 added this quarter"
          type="primary"
        />
        <StatCard
          icon="lucide:circle-check"
          title="Active Schools"
          value={activeSchools}
          change="+8.1%"
          subtext={`${activePercentage}% of all tenants`}
          type="tertiary"
        />
        <StatCard
          icon="lucide:clock"
          title="Inactive Schools"
          value={inactiveSchools}
          change="-2.0%"
          subtext="Awaiting renewal"
          type="accent"
        />
        <StatCard
          icon="lucide:circle-alert"
          title="Suspended Schools"
          value={suspendedSchools}
          change={`${suspendedSchools} cases`}
          subtext="Require follow-up"
          type="destructive"
        />
      </section>

      {/* Table & Filters Section */}
      <section className="mt-7 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusFilterChange}
          planFilter={planFilter}
          onPlanChange={handlePlanFilterChange}
          cityFilter={cityFilter}
          onCityChange={handleCityFilterChange}
          onReset={handleResetFilters}
          cities={cities}
        />

        <SchoolTable
          schools={paginatedSchools}
          activeActionMenuId={activeActionMenuId}
          onToggleActionMenu={handleToggleActionMenu}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteSchool}
        />

        <Pagination
          currentPage={currentPage}
          totalCount={filteredSchools.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>

      {/* Add School Modal */}
      <AddSchoolModal
        isOpen={isAddSchoolModalOpen}
        onClose={handleCloseAddSchoolModal}
        onAdd={handleAddSchool}
      />
    </div>
  );
};

export default Schools;