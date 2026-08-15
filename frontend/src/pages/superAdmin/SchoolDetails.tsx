import React, { useState } from 'react';
import { Icon } from '@iconify/react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface SchoolData {
  name: string;
  code: string;
  location: string;
  registeredDate: string;
  email: string;
  phone: string;
  address: string;
  cityState: string;
  country: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface AdminData {
  name: string;
  role: string;
  email: string;
  mobile: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

interface SubscriptionData {
  plan: string;
  startDate: string;
  expiryDate: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Overdue';
  renewalAmount: string;
}

interface Activity {
  id: string;
  title: string;
  time: string;
  category: 'academic' | 'billing' | 'system';
  icon: string;
}

interface SchoolProfileHeaderProps {
  school: SchoolData;
  onEdit: () => void;
}

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'neutral' | 'negative';
  iconBgClass?: string;
}

interface SchoolInfoCardProps {
  school: SchoolData;
}

interface RecentActivityCardProps {
  activities: Activity[];
  onViewAuditLog: () => void;
}

interface SchoolAdminCardProps {
  admin: AdminData;
  onManage: () => void;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onViewSubscription: () => void;
}

interface EditSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolData;
  onSave: (updatedSchool: SchoolData) => void;
}

interface ManageAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminData;
  onSave: (updatedAdmin: AdminData) => void;
}

// ==========================================
// HELPER SUB-COMPONENTS
// ==========================================

const SchoolProfileHeader: React.FC<SchoolProfileHeaderProps> = ({ school, onEdit }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white  p-4 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#3B82F6] text-xl font-bold text-white">
            {getInitials(school.name)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{school.name}</h1>
              <span className="rounded-full bg-[#10B981] px-3 py-1 text-xs font-semibold text-white">
                {school.status}
              </span>
            </div>
            <p className="mt-2 font-mono text-sm text-[#6B7280]">School Code: {school.code}</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              {school.location} · Registered {school.registeredDate}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#3B82F6]/90 transition-colors cursor-pointer"
        >
          <Icon icon="lucide:pencil" className="text-lg" />
          Edit School
        </button>
      </div>
    </section>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  change,
  changeType = 'neutral',
  iconBgClass = 'bg-[#F3F4F6] text-[#6B7280]',
}) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBgClass}`}>
        <Icon icon={icon} className="text-xl" />
      </div>
      <p className="mt-4 text-sm text-[#6B7280]">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#111827]">{value}</p>
      {change && (
        <p
          className={`mt-1 text-xs font-medium ${
            changeType === 'positive'
              ? 'text-[#10B981]'
              : changeType === 'negative'
              ? 'text-[#EF4444]'
              : 'text-[#6B7280]'
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
};

const SchoolInfoCard: React.FC<SchoolInfoCardProps> = ({ school }) => {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">School Information</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Tenant profile and primary contact details.</p>
        </div>
        <Icon icon="lucide:school" className="text-2xl text-[#3B82F6]" />
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Email</dt>
          <dd className="mt-1 text-sm font-medium text-[#111827]">{school.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Phone</dt>
          <dd className="mt-1 text-sm font-medium text-[#111827]">{school.phone}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Address</dt>
          <dd className="mt-1 text-sm font-medium text-[#111827]">{school.address}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">City / State</dt>
          <dd className="mt-1 text-sm font-medium text-[#111827]">{school.cityState}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Country</dt>
          <dd className="mt-1 text-sm font-medium text-[#111827]">{school.country}</dd>
        </div>
      </dl>
    </section>
  );
};

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities, onViewAuditLog }) => {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Recent Activity</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Latest activity from this school tenant.</p>
        </div>
        <button
          onClick={onViewAuditLog}
          className="text-sm font-semibold text-[#3B82F6] hover:underline cursor-pointer"
        >
          View audit log
        </button>
      </div>
      <div className="mt-5 space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                activity.category === 'academic'
                  ? 'bg-[#EFF6FF] text-[#3B82F6]'
                  : activity.category === 'billing'
                  ? 'bg-[#F5F3FF] text-[#8B5CF6]'
                  : 'bg-[#F3F4F6] text-[#6B7280]'
              }`}
            >
              <Icon icon={activity.icon} className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#111827]">{activity.title}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SchoolAdminCard: React.FC<SchoolAdminCardProps> = ({ admin, onManage }) => {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#6B7280]">
          <Icon icon="lucide:user-round" className="text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">School Admin</h2>
          <p className="text-sm text-[#6B7280]">Primary tenant administrator</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-[#F9FAFB] p-4">
        <div className="flex items-center gap-3">
          <img className="h-11 w-11 rounded-full object-cover" src={admin.avatar} alt={admin.name} />
          <div>
            <p className="font-semibold text-[#111827]">{admin.name}</p>
            <p className="text-xs text-[#6B7280]">{admin.role}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Email</dt>
            <dd className="font-medium text-[#111827] break-all">{admin.email}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Mobile</dt>
            <dd className="font-medium text-[#111827]">{admin.mobile}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Last Login</dt>
            <dd className="font-medium text-[#111827]">{admin.lastLogin}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#6B7280]">Status</dt>
            <dd>
              <span className="rounded-full bg-[#10B981] px-2 py-1 text-xs font-semibold text-white">
                {admin.status}
              </span>
            </dd>
          </div>
        </dl>
      </div>
      <button
        onClick={onManage}
        className="mt-4 min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
      >
        Manage School Admin
      </button>
    </section>
  );
};

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onViewSubscription }) => {
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Subscription</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Current tenant billing plan</p>
        </div>
        <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-semibold text-[#6B7280]">
          {subscription.plan}
        </span>
      </div>
      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[#6B7280]">Start Date</dt>
          <dd className="font-medium text-[#111827]">{subscription.startDate}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#6B7280]">Expiry Date</dt>
          <dd className="font-medium text-[#111827]">{subscription.expiryDate}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#6B7280]">Payment Status</dt>
          <dd>
            <span className="rounded-full bg-[#10B981] px-2 py-1 text-xs font-semibold text-white">
              {subscription.paymentStatus}
            </span>
          </dd>
        </div>
      </dl>
      <div className="mt-5 border-t border-[#E5E7EB] pt-4">
        <p className="text-xs text-[#6B7280]">Next renewal</p>
        <p className="mt-1 text-sm font-semibold text-[#111827]">
          {subscription.renewalAmount} · {subscription.expiryDate}
        </p>
      </div>
      <button
        onClick={onViewSubscription}
        className="mt-5 min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white text-sm font-semibold text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
      >
        View Subscription
      </button>
    </section>
  );
};

// ==========================================
// MODALS
// ==========================================

const EditSchoolModal: React.FC<EditSchoolModalProps> = ({ isOpen, onClose, school, onSave }) => {
  const [formData, setFormData] = useState<SchoolData>({ ...school });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg border border-[#E5E7EB]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <h3 className="text-lg font-bold text-[#111827]">Edit School Profile</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827]">
            <Icon icon="lucide:x" className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">School Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase">School Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase">City / State</label>
              <input
                type="text"
                required
                value={formData.cityState}
                onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase">Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-10 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#3B82F6]/90 transition-colors flex items-center gap-2"
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

const ManageAdminModal: React.FC<ManageAdminModalProps> = ({ isOpen, onClose, admin, onSave }) => {
  const [formData, setFormData] = useState<AdminData>({ ...admin });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg border border-[#E5E7EB]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <h3 className="text-lg font-bold text-[#111827]">Manage School Admin</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827]">
            <Icon icon="lucide:x" className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Admin Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Role</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Mobile Number</label>
            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] uppercase">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="mt-1 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-10 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#3B82F6]/90 transition-colors flex items-center gap-2"
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

// ==========================================
// MAIN COMPONENT
// ==========================================

const SchoolDetails: React.FC = () => {
  // State variables
  const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] = useState<boolean>(false);
  const [isManageAdminModalOpen, setIsManageAdminModalOpen] = useState<boolean>(false);

  // Mock Data States
  const [school, setSchool] = useState<SchoolData>({
    name: 'Riverside Academy',
    code: 'RSA001',
    location: 'Pune, Maharashtra',
    registeredDate: '12 Jan 2024',
    email: 'admin@riverside.edu',
    phone: '+91 20 4455 9200',
    address: '42 Riverbank Road, Koregaon Park',
    cityState: 'Pune, Maharashtra',
    country: 'India',
    status: 'Active',
  });

  const [admin, setAdmin] = useState<AdminData>({
    name: 'Dr. Arvind Mehta',
    role: 'School Administrator',
    email: 'mehta@riverside.edu',
    mobile: '+91 98220 14560',
    lastLogin: 'Today, 09:14 AM',
    status: 'Active',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  });

  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: 'Premium',
    startDate: '12 Jan 2026',
    expiryDate: '11 Jan 2027',
    paymentStatus: 'Paid',
    renewalAmount: '₹86,400',
  });

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: '18 students enrolled for Grade 7',
      time: 'Today, 10:42 AM · Academic Office',
      category: 'academic',
      icon: 'lucide:user-plus',
    },
    {
      id: '2',
      title: 'Premium subscription invoice paid',
      time: '12 Aug 2026 · ₹86,400',
      category: 'billing',
      icon: 'lucide:credit-card',
    },
    {
      id: '3',
      title: 'Term 2 timetable published',
      time: '08 Aug 2026 · Dr. Mehta',
      category: 'system',
      icon: 'lucide:refresh-cw',
    },
  ]);

  // Event Handlers
  const handleEditSchool = () => {
    setIsEditSchoolModalOpen(true);
  };

  const handleManageAdmin = () => {
    setIsManageAdminModalOpen(true);
  };

  const handleViewAuditLog = () => {
    alert('Navigating to full audit log for Riverside Academy...');
  };

  const handleViewSubscription = () => {
    alert('Navigating to detailed subscription and billing management page...');
  };

  const handleSaveSchool = (updatedSchool: SchoolData) => {
    setSchool(updatedSchool);
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: 'School profile details updated by Super Admin',
      time: 'Just now · System',
      category: 'system',
      icon: 'lucide:refresh-cw',
    };
    setActivities([newActivity, ...activities]);
  };

  const handleSaveAdmin = (updatedAdmin: AdminData) => {
    setAdmin(updatedAdmin);
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: `Primary Admin updated to ${updatedAdmin.name}`,
      time: 'Just now · System',
      category: 'system',
      icon: 'lucide:user-round',
    };
    setActivities([newActivity, ...activities]);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F9FC] p-2">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#3B82F6]/80 transition-colors cursor-pointer"
      >
        <Icon icon="lucide:arrow-left" className="text-lg" />
        Back to Schools
      </button>

      {/* School Profile Header */}
      <SchoolProfileHeader school={school} onEdit={handleEditSchool} />

      {/* Stats Grid */}
      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="lucide:graduation-cap"
          title="Total Students"
          value="1,248"
          change="+6.8% this term"
          changeType="positive"
        />
        <StatCard
          icon="lucide:users"
          title="Total Teachers"
          value="86"
          change="4 new this term"
          changeType="neutral"
        />
        <StatCard
          icon="lucide:briefcase-business"
          title="Total Staff"
          value="42"
          change="Academic & operations"
          changeType="neutral"
          iconBgClass="bg-[#F5F3FF] text-[#8B5CF6]"
        />
        <StatCard
          icon="lucide:layers"
          title="Total Classes"
          value="38"
          change="Grades 1–12"
          changeType="neutral"
        />
      </section>

      {/* Detailed Info Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column: School Info & Recent Activity */}
        <div className="space-y-6 xl:col-span-2">
          <SchoolInfoCard school={school} />
          <RecentActivityCard activities={activities} onViewAuditLog={handleViewAuditLog} />
        </div>

        {/* Right Column: Admin & Subscription */}
        <div className="space-y-6">
          <SchoolAdminCard admin={admin} onManage={handleManageAdmin} />
          <SubscriptionCard subscription={subscription} onViewSubscription={handleViewSubscription} />
        </div>
      </div>

      {/* Modals */}
      <EditSchoolModal
        isOpen={isEditSchoolModalOpen}
        onClose={() => setIsEditSchoolModalOpen(false)}
        school={school}
        onSave={handleSaveSchool}
      />

      <ManageAdminModal
        isOpen={isManageAdminModalOpen}
        onClose={() => setIsManageAdminModalOpen(false)}
        admin={admin}
        onSave={handleSaveAdmin}
      />
    </div>
  );
};

export default SchoolDetails;