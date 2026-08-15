import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

// ==========================================
// TypeScript Interfaces
// ==========================================

interface FormSectionProps {
  title: string;
  description: string;
  icon: string;
  isAccent?: boolean;
  children: React.ReactNode;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

interface LogoUploaderProps {
  logoPreview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

// ==========================================
// Helper Sub-components
// ==========================================

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  isAccent = false,
  children,
}) => {
  return (
    <section className="border-t border-[#E5E7EB] pt-8 first:border-t-0 first:pt-0">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            isAccent
              ? 'bg-[#8B5CF6] text-white'
              : 'bg-[#F3F4F6] text-[#6B7280]'
          }`}
        >
          <Icon icon={icon} className="text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
          <p className="text-sm text-[#6B7280]">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
};

const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>
      <input
        {...props}
        className={`min-h-11 w-full rounded-lg border bg-white px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all ${
          error ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#D1D5DB] focus:border-[#3B82F6]'
        }`}
      />
      {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
    </label>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({ label, options, ...props }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>
      <select
        {...props}
        className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

const LogoUploader: React.FC<LogoUploaderProps> = ({ logoPreview, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="md:col-span-2">
      <span className="mb-2 block text-sm font-semibold text-[#111827]">School Logo</span>
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-[#3B82F6] border border-[#E5E7EB] overflow-hidden shrink-0">
          {logoPreview ? (
            <img src={logoPreview} alt="School Logo Preview" className="h-full w-full object-cover" />
          ) : (
            <Icon icon="lucide:image" className="text-2xl" />
          )}
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleButtonClick}
              className="text-sm font-semibold text-[#3B82F6] hover:underline cursor-pointer"
            >
              Upload logo
            </button>
            {logoPreview && (
              <button
                type="button"
                onClick={onRemove}
                className="text-sm font-semibold text-[#EF4444] hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-[#6B7280]">PNG, JPG or SVG up to 2MB</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Main Page Component
// ==========================================

const AddSchool: React.FC = () => {
  // State Variables
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState('Premium');
  const [subscriptionStatus, setSubscriptionStatus] = useState('Active');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // UI Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Event Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      setSchoolLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSchoolLogo(null);
    setLogoPreview(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCancel = () => {
    // Reset all form fields
    setSchoolLogo(null);
    setLogoPreview(null);
    setSchoolName('');
    setSchoolCode('');
    setSchoolEmail('');
    setSchoolPhone('');
    setAddress('');
    setCity('');
    setState('');
    setCountry('India');
    setPincode('');
    setAdminName('');
    setAdminEmail('');
    setAdminMobile('');
    setAdminPassword('');
    setSelectedPlan('Premium');
    setSubscriptionStatus('Active');
    setStartDate('');
    setExpiryDate('');
    setErrors({});
    setSuccessMessage(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!schoolName.trim()) newErrors.schoolName = 'School name is required';
    if (!schoolCode.trim()) newErrors.schoolCode = 'School code is required';
    if (!schoolEmail.trim()) {
      newErrors.schoolEmail = 'School email is required';
    } else if (!/\S+@\S+\.\S+/.test(schoolEmail)) {
      newErrors.schoolEmail = 'Invalid email address';
    }
    if (!schoolPhone.trim()) {
      newErrors.schoolPhone = 'School phone is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(schoolPhone.replace(/\s/g, ''))) {
      newErrors.schoolPhone = 'Invalid phone number format';
    }

    if (!adminName.trim()) newErrors.adminName = 'Admin name is required';
    if (!adminEmail.trim()) {
      newErrors.adminEmail = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(adminEmail)) {
      newErrors.adminEmail = 'Invalid email address';
    }
    if (!adminMobile.trim()) {
      newErrors.adminMobile = 'Admin mobile is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(adminMobile.replace(/\s/g, ''))) {
      newErrors.adminMobile = 'Invalid mobile number';
    }
    if (!adminPassword.trim()) {
      newErrors.adminPassword = 'Password is required';
    } else if (adminPassword.length < 6) {
      newErrors.adminPassword = 'Password must be at least 6 characters';
    }

    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (startDate && expiryDate && new Date(startDate) >= new Date(expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('School tenant registered successfully!');
      setTimeout(() => {
        handleCancel();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F9FC] p-1">
      {/* Back Button */}
      <button
        onClick={handleCancel}
        className="mb-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#3B82F6]/80 transition-colors cursor-pointer"
      >
        <Icon icon="lucide:arrow-left" className="text-lg" />
        Back to Schools
      </button>

      {/* Success Toast */}
      {successMessage && (
        <div className="mb-6 p-4 bg-[#10B981]/10 border border-[#10B981] text-[#065F46] rounded-xl flex items-center gap-3">
          <Icon icon="lucide:check-circle" className="text-xl shrink-0 text-[#10B981]" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Main Form Card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] px-7 py-3">
          <p className="text-sm font-medium text-[#3B82F6]">Super Admin / Schools / New</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Add School</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Register a new school tenant and set up its first administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-5">
          {/* Section 1: School Information */}
          <FormSection
            title="School Information"
            description="Core school profile and contact details."
            icon="lucide:school"
          >
            <LogoUploader
              logoPreview={logoPreview}
              onUpload={handleLogoUpload}
              onRemove={handleRemoveLogo}
            />

            <InputField
              label="School Name"
              placeholder="e.g. Riverside Academy"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              error={errors.schoolName}
            />

            <InputField
              label="School Code"
              placeholder="e.g. RSA001"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              error={errors.schoolCode}
            />

            <InputField
              label="School Email"
              type="email"
              placeholder="admin@school.edu"
              value={schoolEmail}
              onChange={(e) => setSchoolEmail(e.target.value)}
              error={errors.schoolEmail}
            />

            <InputField
              label="School Phone"
              placeholder="+91 20 4455 9200"
              value={schoolPhone}
              onChange={(e) => setSchoolPhone(e.target.value)}
              error={errors.schoolPhone}
            />

            <div className="md:col-span-2">
              <InputField
                label="Address"
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <InputField
              label="City"
              placeholder="Pune"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <InputField
              label="State"
              placeholder="Maharashtra"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />

            <InputField
              label="Country"
              placeholder="India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <InputField
              label="Pincode"
              placeholder="411001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </FormSection>

          {/* Section 2: School Admin */}
          <FormSection
            title="School Admin"
            description="Invite the primary administrator for this tenant."
            icon="lucide:user-round"
          >
            <InputField
              label="Admin Name"
              placeholder="Full name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              error={errors.adminName}
            />

            <InputField
              label="Admin Email"
              type="email"
              placeholder="admin@school.edu"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              error={errors.adminEmail}
            />

            <InputField
              label="Admin Mobile"
              placeholder="+91 98765 43210"
              value={adminMobile}
              onChange={(e) => setAdminMobile(e.target.value)}
              error={errors.adminMobile}
            />

            <div className="block">
              <span className="mb-2 block text-sm font-semibold text-[#111827]">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`min-h-11 w-full rounded-lg border bg-white px-3 pr-10 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all ${
                    errors.adminPassword ? 'border-[#EF4444]' : 'border-[#D1D5DB] focus:border-[#3B82F6]'
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-lg text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                  <Icon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} />
                </button>
              </div>
              {errors.adminPassword && (
                <p className="mt-1 text-xs text-[#EF4444]">{errors.adminPassword}</p>
              )}
            </div>
          </FormSection>

          {/* Section 3: Subscription */}
          <FormSection
            title="Subscription"
            description="Set the plan and its initial billing window."
            icon="lucide:credit-card"
            isAccent={true}
          >
            <SelectField
              label="Select Plan"
              options={['Premium', 'Standard', 'Enterprise']}
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />

            <SelectField
              label="Subscription Status"
              options={['Active', 'Inactive']}
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
            />

            <InputField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={errors.startDate}
            />

            <InputField
              label="Expiry Date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              error={errors.expiryDate}
            />
          </FormSection>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-5 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-11 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#3B82F6]/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Icon icon="lucide:loader-2" className="animate-spin text-lg" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon icon="lucide:plus" className="text-lg" />
                  Create School
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchool;