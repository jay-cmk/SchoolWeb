import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  clearSelectedStudent,
  getStudentById,
} from "../../../features/student/student.slice";
import {
  clearEnrollmentHistory,
  getStudentEnrollmentHistory,
} from "../../../features/student/studentPromotion.slice";
import type { StudentRelation } from "../../../features/student/student.types";
import type {
  PromotionClass,
  PromotionSection,
  PromotionSession,
  StudentEnrollment,
} from "../../../features/student/studentPromotion.types";

type PromotionRelation =
  | string
  | PromotionSession
  | PromotionClass
  | PromotionSection;

type EnrollmentWithStream = StudentEnrollment & {
  stream?: string;
};

const EMPTY_VALUE = "—";

const displayValue = (
  value: string | number | null | undefined,
): string | number => {
  return value === null || value === undefined || value === ""
    ? EMPTY_VALUE
    : value;
};

const formatDate = (value?: string): string => {
  if (!value) return EMPTY_VALUE;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const relationName = (
  relation: string | StudentRelation | PromotionRelation,
): string => {
  if (typeof relation === "string") return relation;
  return relation?.name || relation?._id || EMPTY_VALUE;
};

const prettyText = (value?: string): string => {
  if (!value) return EMPTY_VALUE;
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const statusTone = (status?: string): string => {
  switch (status) {
    case "ACTIVE":
    case "PROMOTED":
    case "GRADUATED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "INACTIVE":
    case "CANCELLED":
    case "LEFT":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "RETAINED":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
};

const StudentDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const {
    selectedStudent,
    loading,
    error: studentError,
  } = useAppSelector((state) => state.students);

  const {
    enrollmentHistory,
    enrollmentHistoryLoading,
    error: promotionError,
  } = useAppSelector((state) => state.studentPromotion);

  useEffect(() => {
    if (!studentId) return;

    dispatch(getStudentById(studentId));
    dispatch(getStudentEnrollmentHistory(studentId));

    return () => {
      dispatch(clearSelectedStudent());
      dispatch(clearEnrollmentHistory());
    };
  }, [dispatch, studentId]);

  const sortedEnrollmentHistory = useMemo(
    () =>
      [...enrollmentHistory].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      ),
    [enrollmentHistory],
  );

  const currentEnrollment = useMemo(
    () =>
      sortedEnrollmentHistory.find(
        (enrollment) => enrollment.enrollmentStatus === "ACTIVE",
      ) ?? null,
    [sortedEnrollmentHistory],
  );

  const handleRetry = () => {
    if (!studentId) return;
    dispatch(getStudentById(studentId));
    dispatch(getStudentEnrollmentHistory(studentId));
  };

  if (loading && !selectedStudent) {
    return (
      <PageState
        icon="lucide:loader-circle"
        title="Loading student profile"
        message="Please wait while the student record is prepared."
        iconClassName="animate-spin text-blue-600"
      />
    );
  }

  if (studentError && !selectedStudent) {
    return (
      <PageState
        icon="lucide:circle-alert"
        title="Unable to load student"
        message={studentError}
        iconClassName="text-rose-600"
        actions={
          <>
            <SecondaryButton onClick={() => navigate("/school-admin/students")}>
              Back
            </SecondaryButton>
            <PrimaryButton onClick={handleRetry} icon="lucide:refresh-cw">
              Retry
            </PrimaryButton>
          </>
        }
      />
    );
  }

  if (!selectedStudent) {
    return (
      <PageState
        icon="lucide:user-x"
        title="Student not found"
        message="The requested student record is not available."
        actions={
          <PrimaryButton
            onClick={() => navigate("/school-admin/students")}
            icon="lucide:arrow-left"
          >
            Back to Students
          </PrimaryButton>
        }
      />
    );
  }

  const student = selectedStudent;
  const primaryAddress =
    student.currentAddress ?? student.address;
  const permanentAddress =
    student.permanentAddress ?? student.address;
  const enrollmentStream =
    (currentEnrollment as EnrollmentWithStream | null)?.stream;
  const stream =
    enrollmentStream ??
    ("stream" in student
      ? (student as typeof student & { stream?: string }).stream
      : undefined);
  const studentInitial =
    student.name?.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 md:px-6 md:py-7 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <nav className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate("/school-admin/students")}
            className="font-medium transition hover:text-blue-700"
          >
            Students
          </button>
          <Icon icon="lucide:chevron-right" className="h-4 w-4" />
          <span className="font-semibold text-slate-800">Profile</span>
        </nav>

        <section className="relative overflow-hidden rounded-2xl border border-blue-900/10 bg-gradient-to-br from-[#102A56] via-[#174F91] to-[#2874C6] p-5 text-white shadow-[0_18px_45px_rgba(15,42,86,0.18)] md:p-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-48 h-52 w-52 rounded-full bg-cyan-300/10" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/25 bg-white/95 text-3xl font-bold text-blue-700 shadow-lg">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name || "Student"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  studentInitial
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="truncate text-2xl font-bold md:text-3xl">
                    {displayValue(student.name)}
                  </h1>
                  <StatusBadge status={student.status ?? "ACTIVE"} />
                </div>
                <p className="mt-2 text-sm text-blue-100">
                  Student profile and academic record
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <HeaderMeta
                    icon="lucide:badge-check"
                    label="Admission No."
                    value={student.admissionNumber}
                  />
                  <HeaderMeta
                    icon="lucide:hash"
                    label="Roll No."
                    value={displayValue(
                      currentEnrollment?.rollNumber ?? student.rollNumber,
                    )}
                  />
                  <HeaderMeta
                    icon="lucide:mail"
                    label="Email"
                    value={displayValue(student.email)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(`/school-admin/students/${studentId}/edit`)
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <Icon icon="lucide:pencil" className="h-4 w-4" />
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => navigate("/school-admin/students")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Icon icon="lucide:arrow-left" className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <MetricCard
            icon="lucide:calendar-days"
            label="Session"
            value={
              currentEnrollment
                ? relationName(currentEnrollment.sessionId)
                : relationName(student.sessionId)
            }
          />
          <MetricCard
            icon="lucide:school"
            label="Class"
            value={
              currentEnrollment
                ? relationName(currentEnrollment.classId)
                : relationName(student.classId)
            }
          />
          <MetricCard
            icon="lucide:layers-3"
            label="Section"
            value={
              currentEnrollment
                ? relationName(currentEnrollment.sectionId)
                : relationName(student.sectionId)
            }
          />
          <MetricCard
            icon="lucide:hash"
            label="Roll Number"
            value={displayValue(
              currentEnrollment?.rollNumber ?? student.rollNumber,
            )}
          />
          <MetricCard
            icon="lucide:book-open-check"
            label="Stream"
            value={prettyText(stream)}
            className="col-span-2 lg:col-span-1"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <SectionCard
              icon="lucide:user-round"
              title="Personal & Identity Details"
              description="Basic, admission and government identity information."
            >
              <DetailsGrid>
                <DetailItem icon="lucide:user" label="Full Name" value={student.name} />
                <DetailItem icon="lucide:users" label="Gender" value={prettyText(student.gender)} />
                <DetailItem icon="lucide:cake" label="Date of Birth" value={formatDate(student.dob)} />
                <DetailItem icon="lucide:droplets" label="Blood Group" value={displayValue(student.bloodGroup)} />
                <DetailItem icon="lucide:tags" label="Category" value={prettyText(student.category)} />
                <DetailItem icon="lucide:sparkles" label="Religion" value={displayValue(student.religion)} />
                <DetailItem icon="lucide:users-round" label="Caste" value={displayValue(student.caste)} />
                <DetailItem icon="lucide:badge-check" label="Admission Number" value={student.admissionNumber} />
                <DetailItem icon="lucide:calendar-check" label="Admission Date" value={formatDate(student.admissionDate)} />
                <DetailItem icon="lucide:clipboard-list" label="Admission Type" value={prettyText(student.admissionType)} />
                <DetailItem icon="lucide:layout-list" label="Admission Category" value={prettyText(student.admissionCategory)} />
                <DetailItem icon="lucide:fingerprint" label="Aadhaar Number" value={displayValue(student.aadhaarNumber)} />
                <DetailItem icon="lucide:id-card" label="APAAR ID" value={displayValue(student.apaarId)} />
                <DetailItem icon="lucide:file-badge" label="PEN Number" value={displayValue(student.penNumber)} />
              </DetailsGrid>
            </SectionCard>

            <SectionCard
              icon="lucide:map-pinned"
              title="Address Details"
              description="Current and permanent residential addresses."
            >
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                <AddressCard
                  title="Current Address"
                  icon="lucide:map-pin"
                  address={primaryAddress}
                />
                <AddressCard
                  title="Permanent Address"
                  icon="lucide:home"
                  address={permanentAddress}
                />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 xl:col-span-4">
            <SectionCard
              icon="lucide:contact"
              title="Contact Details"
              description="Primary student communication details."
            >
              <div className="space-y-1 p-5">
                <DetailItem icon="lucide:mail" label="Email Address" value={displayValue(student.email)} />
                <DetailItem icon="lucide:phone" label="Mobile Number" value={displayValue(student.mobile)} />
              </div>
            </SectionCard>

            <SectionCard
              icon="lucide:users-round"
              title="Parent Details"
              description="Parent identity and contact information."
            >
              <div className="space-y-4 p-5">
                <ParentCard title="Father" details={student.father} />
                <ParentCard title="Mother" details={student.mother} />
              </div>
            </SectionCard>

            <SectionCard
              icon="lucide:file-clock"
              title="Record Details"
              description="System status and audit information."
            >
              <div className="space-y-1 p-5">
                <DetailItem icon="lucide:activity" label="Student Status" value={prettyText(student.status)} />
                <DetailItem icon="lucide:calendar-plus" label="Created On" value={formatDate(student.createdAt)} />
                <DetailItem icon="lucide:calendar-clock" label="Last Updated" value={formatDate(student.updatedAt)} />
              </div>
            </SectionCard>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon icon="lucide:history" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Enrollment History</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Academic placement across sessions.
                </p>
              </div>
            </div>
            {!enrollmentHistoryLoading && (
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {sortedEnrollmentHistory.length}{" "}
                {sortedEnrollmentHistory.length === 1 ? "record" : "records"}
              </span>
            )}
          </div>

          {enrollmentHistoryLoading ? (
            <InlineState
              icon="lucide:loader-circle"
              text="Loading enrollment history..."
              iconClassName="animate-spin text-blue-600"
            />
          ) : promotionError && sortedEnrollmentHistory.length === 0 ? (
            <div className="p-5">
              <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center">
                <Icon icon="lucide:circle-alert" className="h-5 w-5 shrink-0 text-rose-600" />
                <p className="flex-1 text-sm text-rose-700">{promotionError}</p>
                <button
                  type="button"
                  onClick={() =>
                    studentId &&
                    dispatch(getStudentEnrollmentHistory(studentId))
                  }
                  className="text-sm font-bold text-rose-700 hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : sortedEnrollmentHistory.length === 0 ? (
            <InlineState
              icon="lucide:folder-open"
              text="No enrollment history is available."
            />
          ) : (
            <EnrollmentTable enrollments={sortedEnrollmentHistory} />
          )}
        </section>
      </div>
    </div>
  );
};

const PageState = ({
  icon,
  title,
  message,
  actions,
  iconClassName = "text-slate-400",
}: {
  icon: string;
  title: string;
  message: string;
  actions?: React.ReactNode;
  iconClassName?: string;
}) => (
  <div className="flex min-h-[520px] items-center justify-center bg-slate-50 p-5">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Icon icon={icon} className={`h-7 w-7 ${iconClassName}`} />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
      {actions && <div className="mt-6 flex justify-center gap-3">{actions}</div>}
    </div>
  </div>
);

const PrimaryButton = ({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800"
  >
    {icon && <Icon icon={icon} className="h-4 w-4" />}
    {children}
  </button>
);

const SecondaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
  >
    {children}
  </button>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-extrabold tracking-wide ${statusTone(
      status,
    )}`}
  >
    {prettyText(status)}
  </span>
);

const HeaderMeta = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => (
  <span className="inline-flex min-w-0 items-center gap-2 text-blue-50">
    <Icon icon={icon} className="h-4 w-4 shrink-0 text-blue-200" />
    <span className="text-blue-200">{label}</span>
    <strong className="max-w-[240px] truncate font-semibold">{value}</strong>
  </span>
);

const MetricCard = ({
  icon,
  label,
  value,
  className = "",
}: {
  icon: string;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon icon={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

const SectionCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon icon={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const DetailsGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-5 gap-y-1 p-5 sm:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => (
  <div className="flex min-h-[72px] items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-slate-50">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
      <Icon icon={icon} className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

type Address = {
  addressLine?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  country?: string;
};

const AddressCard = ({
  title,
  icon,
  address,
}: {
  title: string;
  icon: string;
  address?: Address;
}) => {
  const addressText = [
    address?.addressLine,
    address?.city,
    address?.district,
    address?.state,
    address?.pincode,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Icon icon={icon} className="h-4 w-4 text-blue-700" />
        {title}
      </div>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
        {addressText || EMPTY_VALUE}
      </p>
    </div>
  );
};

type ParentDetails = {
  name?: string;
  mobile?: string;
  aadhaarNumber?: string;
  occupation?: string;
};

const ParentCard = ({
  title,
  details,
}: {
  title: string;
  details?: ParentDetails;
}) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <Icon icon="lucide:user-round" className="h-4 w-4 text-blue-700" />
    </div>
    <dl className="mt-3 space-y-2 text-sm">
      <ParentLine label="Name" value={displayValue(details?.name)} />
      <ParentLine label="Mobile" value={displayValue(details?.mobile)} />
      <ParentLine label="Occupation" value={displayValue(details?.occupation)} />
      <ParentLine label="Aadhaar" value={displayValue(details?.aadhaarNumber)} />
    </dl>
  </div>
);

const ParentLine = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-start justify-between gap-4">
    <dt className="text-slate-500">{label}</dt>
    <dd className="break-all text-right font-semibold text-slate-800">{value}</dd>
  </div>
);

const InlineState = ({
  icon,
  text,
  iconClassName = "text-slate-400",
}: {
  icon: string;
  text: string;
  iconClassName?: string;
}) => (
  <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
    <Icon icon={icon} className={`h-8 w-8 ${iconClassName}`} />
    <p className="mt-3 text-sm font-medium text-slate-500">{text}</p>
  </div>
);

const EnrollmentTable = ({
  enrollments,
}: {
  enrollments: StudentEnrollment[];
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[1050px] text-left">
      <thead className="bg-slate-50">
        <tr className="border-b border-slate-200">
          {[
            "Session",
            "Class",
            "Section",
            "Stream",
            "Roll No.",
            "Enrollment",
            "Promotion",
            "Promotion Date",
            "Remarks",
          ].map((heading) => (
            <th
              key={heading}
              className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {enrollments.map((enrollment) => {
          const withStream = enrollment as EnrollmentWithStream;
          return (
            <tr key={enrollment._id} className="transition hover:bg-blue-50/30">
              <td className="px-5 py-4 text-sm font-bold text-slate-900">{relationName(enrollment.sessionId)}</td>
              <td className="px-5 py-4 text-sm text-slate-700">{relationName(enrollment.classId)}</td>
              <td className="px-5 py-4 text-sm text-slate-700">{relationName(enrollment.sectionId)}</td>
              <td className="px-5 py-4 text-sm text-slate-700">{prettyText(withStream.stream)}</td>
              <td className="px-5 py-4 text-sm text-slate-700">{displayValue(enrollment.rollNumber)}</td>
              <td className="px-5 py-4"><StatusBadge status={enrollment.enrollmentStatus} /></td>
              <td className="px-5 py-4"><StatusBadge status={enrollment.promotionStatus} /></td>
              <td className="px-5 py-4 text-sm text-slate-600">{formatDate(enrollment.promotionDate)}</td>
              <td className="max-w-[260px] px-5 py-4 text-sm text-slate-600">
                <span className="line-clamp-2">{enrollment.remarks || EMPTY_VALUE}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default StudentDetails;
