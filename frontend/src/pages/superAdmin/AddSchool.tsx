import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { Icon } from "@iconify/react";
import { useAppDispatch } from "../../app/hooks";
import { createSchool } from "../../features/schools/school.slice";
import { createSchoolAdmin } from "../../features/schoolAdmins/schoolAdmin.slice";

type Errors = Record<string, string>;

interface SchoolPayload {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

interface SchoolAdminPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

interface SubscriptionForm {
  plan: string;
  status: string;
  startDate: string;
  expiryDate: string;
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface FormSectionProps {
  title: string;
  description: string;
  icon: string;
  accent?: boolean;
  children: ReactNode;
}

const FormSection = ({
  title,
  description,
  icon,
  accent = false,
  children,
}: FormSectionProps) => (
  <section className="border-t border-[#E5E7EB] pt-8 first:border-t-0 first:pt-0">
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          accent ? "bg-[#8B5CF6] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
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

const InputField = ({ label, error, ...props }: InputFieldProps) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>
    <input
      {...props}
      className={`min-h-11 w-full rounded-lg border bg-white px-3 text-sm text-[#111827] outline-none transition-all focus:ring-2 focus:ring-[#3B82F6]/20 ${
        error
          ? "border-[#EF4444] focus:border-[#EF4444]"
          : "border-[#D1D5DB] focus:border-[#3B82F6]"
      }`}
    />
    {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
  </label>
);

const AddSchool = () => {
  const dispatch = useAppDispatch();
  const [school, setSchool] = useState<SchoolPayload>({
    name: "",
    code: "",
    email: "",
    phone: "",
    address: {
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const [admin, setAdmin] = useState<SchoolAdminPayload>({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionForm>({
    plan: "Premium",
    status: "Active",
    startDate: "",
    expiryDate: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [createdSchoolId, setCreatedSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  const updateSchool = (field: keyof Omit<SchoolPayload, "address">, value: string) => {
    setSchool((current) => ({ ...current, [field]: value }));
  };

  const updateAddress = (field: keyof SchoolPayload["address"], value: string) => {
    setSchool((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  };

  const updateAdmin = (field: keyof SchoolAdminPayload, value: string) => {
    setAdmin((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const next: Errors = {};
    const emailPattern = /^\S+@\S+\.\S+$/;
    const mobilePattern = /^\d{10}$/;

    if (!school.name.trim()) next.schoolName = "School name is required";
    if (!school.code.trim()) next.schoolCode = "School code is required";
    if (!emailPattern.test(school.email)) next.schoolEmail = "Valid school email is required";
    if (!mobilePattern.test(school.phone)) next.schoolPhone = "Enter a 10 digit phone number";
    if (!school.address.addressLine.trim()) next.addressLine = "Address is required";
    if (!school.address.city.trim()) next.city = "City is required";
    if (!school.address.state.trim()) next.state = "State is required";
    if (!/^\d{6}$/.test(school.address.pincode)) next.pincode = "Enter a 6 digit pincode";
    if (!school.address.country.trim()) next.country = "Country is required";

    if (!admin.name.trim()) next.adminName = "Admin name is required";
    if (!emailPattern.test(admin.email)) next.adminEmail = "Valid admin email is required";
    if (!mobilePattern.test(admin.mobile)) next.adminMobile = "Enter a 10 digit mobile number";
    if (admin.password.length < 8) next.adminPassword = "Password must contain at least 8 characters";

    if (subscriptionEnabled) {
      if (!subscription.startDate) next.startDate = "Start date is required";
      if (!subscription.expiryDate) next.expiryDate = "Expiry date is required";
      if (
        subscription.startDate &&
        subscription.expiryDate &&
        new Date(subscription.expiryDate) <= new Date(subscription.startDate)
      ) {
        next.expiryDate = "Expiry date must be after start date";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setSchool({
      name: "",
      code: "",
      email: "",
      phone: "",
      address: { addressLine: "", city: "", state: "", pincode: "", country: "India" },
    });
    setAdmin({ name: "", email: "", mobile: "", password: "" });
    setSubscriptionEnabled(false);
    setSubscription({ plan: "Premium", status: "Active", startDate: "", expiryDate: "" });
    setCreatedSchoolId(null);
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage("");
    let schoolId = createdSchoolId;

    try {
      if (!schoolId) {
        // API 1: POST /super-admin/schools
        const createdSchool = await dispatch(
          createSchool({
            ...school,
            name: school.name.trim(),
            code: school.code.trim().toUpperCase(),
            email: school.email.trim().toLowerCase(),
            phone: school.phone.trim(),
            address: {
              addressLine: school.address.addressLine.trim(),
              city: school.address.city.trim(),
              state: school.address.state.trim(),
              pincode: school.address.pincode.trim(),
              country: school.address.country.trim(),
            },
          }),
        ).unwrap();

        schoolId = createdSchool._id;
        setCreatedSchoolId(schoolId);
      }

      // API 2: POST /super-admin/schools/:schoolId/admin
      await dispatch(
        createSchoolAdmin({
          schoolId,
          data: {
            name: admin.name.trim(),
            email: admin.email.trim().toLowerCase(),
            mobile: admin.mobile.trim(),
            password: admin.password,
          },
        }),
      ).unwrap();

      // Subscription is optional UI data for now. When its backend API is ready,
      // call it here with schoolId and `subscription`.
      setMessage("School and school admin created successfully.");
      resetForm();
    } catch (error: unknown) {
      setMessage(
        schoolId
          ? `School is already created. Admin creation failed: ${
              typeof error === "string" ? error : "Please try again."
            }`
          : typeof error === "string"
            ? error
            : "School setup could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F9FC] p-1">
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] px-7 py-4">
          <p className="text-sm font-medium text-[#3B82F6]">Super Admin / Schools / New</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Add School</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Create the school first and then its primary school administrator.
          </p>
        </div>

        {message && (
          <div className="mx-5 mt-5 rounded-lg border border-[#3B82F6]/30 bg-[#EFF6FF] p-3 text-sm text-[#1D4ED8]">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 p-5">
          <FormSection
            title="School Information"
            description="Main school details used while creating the school."
            icon="lucide:school"
          >
            <InputField label="School Name" value={school.name} onChange={(e) => updateSchool("name", e.target.value)} error={errors.schoolName} placeholder="XYZ Public School" />
            <InputField label="School Code" value={school.code} onChange={(e) => updateSchool("code", e.target.value)} error={errors.schoolCode} placeholder="XYZ001" />
            <InputField label="School Email" type="email" value={school.email} onChange={(e) => updateSchool("email", e.target.value)} error={errors.schoolEmail} placeholder="info@abcschool.com" />
            <InputField label="School Phone" value={school.phone} onChange={(e) => updateSchool("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} error={errors.schoolPhone} placeholder="9876543650" />
            <div className="md:col-span-2">
              <InputField label="Address Line" value={school.address.addressLine} onChange={(e) => updateAddress("addressLine", e.target.value)} error={errors.addressLine} placeholder="Main Road Gopiganj" />
            </div>
            <InputField label="City" value={school.address.city} onChange={(e) => updateAddress("city", e.target.value)} error={errors.city} placeholder="Bhopal" />
            <InputField label="State" value={school.address.state} onChange={(e) => updateAddress("state", e.target.value)} error={errors.state} placeholder="Madhya Pradesh" />
            <InputField label="Pincode" value={school.address.pincode} onChange={(e) => updateAddress("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} error={errors.pincode} placeholder="462001" />
            <InputField label="Country" value={school.address.country} onChange={(e) => updateAddress("country", e.target.value)} error={errors.country} placeholder="India" />
          </FormSection>

          <FormSection
            title="School Admin"
            description="Login details for the school's first administrator."
            icon="lucide:user-round"
          >
            <InputField label="Admin Name" value={admin.name} onChange={(e) => updateAdmin("name", e.target.value)} error={errors.adminName} placeholder="JayAdmin" />
            <InputField label="Admin Email" type="email" value={admin.email} onChange={(e) => updateAdmin("email", e.target.value)} error={errors.adminEmail} placeholder="jay@abcschool.com" />
            <InputField label="Admin Mobile" value={admin.mobile} onChange={(e) => updateAdmin("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} error={errors.adminMobile} placeholder="9876543210" />
            <div>
              <span className="mb-2 block text-sm font-semibold text-[#111827]">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={admin.password}
                  onChange={(e) => updateAdmin("password", e.target.value)}
                  placeholder="Admin@12345"
                  className={`min-h-11 w-full rounded-lg border bg-white px-3 pr-10 text-sm outline-none ${errors.adminPassword ? "border-[#EF4444]" : "border-[#D1D5DB]"}`}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-[#6B7280]">
                  <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                </button>
              </div>
              {errors.adminPassword && <p className="mt-1 text-xs text-[#EF4444]">{errors.adminPassword}</p>}
            </div>
          </FormSection>

          <FormSection
            title="Subscription (Optional)"
            description="Enable this only when you want to configure a plan now."
            icon="lucide:credit-card"
            accent
          >
            <label className="flex items-center gap-3 md:col-span-2">
              <input type="checkbox" checked={subscriptionEnabled} onChange={(e) => setSubscriptionEnabled(e.target.checked)} className="h-4 w-4" />
              <span className="text-sm font-semibold text-[#111827]">Configure subscription now</span>
            </label>

            {subscriptionEnabled && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Plan</span>
                  <select value={subscription.plan} onChange={(e) => setSubscription((current) => ({ ...current, plan: e.target.value }))} className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm">
                    <option value="Premium">Premium</option>
                    <option value="Standard">Standard</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Status</span>
                  <select value={subscription.status} onChange={(e) => setSubscription((current) => ({ ...current, status: e.target.value }))} className="min-h-11 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
                <InputField label="Start Date" type="date" value={subscription.startDate} onChange={(e) => setSubscription((current) => ({ ...current, startDate: e.target.value }))} error={errors.startDate} />
                <InputField label="Expiry Date" type="date" value={subscription.expiryDate} onChange={(e) => setSubscription((current) => ({ ...current, expiryDate: e.target.value }))} error={errors.expiryDate} />
              </>
            )}
          </FormSection>

          <div className="flex justify-end gap-3 border-t border-[#E5E7EB] pt-6">
            <button type="button" onClick={resetForm} className="min-h-11 rounded-lg border border-[#D1D5DB] px-5 text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={loading} className="flex min-h-11 items-center gap-2 rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white disabled:opacity-60">
              <Icon icon={loading ? "lucide:loader-2" : "lucide:plus"} className={loading ? "animate-spin" : ""} />
              {loading ? "Creating..." : "Create School & Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchool;