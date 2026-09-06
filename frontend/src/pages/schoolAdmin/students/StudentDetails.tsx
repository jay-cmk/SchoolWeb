import React, {
  useEffect,
  useMemo,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Icon,
} from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearSelectedStudent,
  getStudentById,
} from "../../../features/student/student.slice";

import {
  clearEnrollmentHistory,
  getStudentEnrollmentHistory,
} from "../../../features/student/studentPromotion.slice";

import type {
  StudentRelation,
} from "../../../features/student/student.types";

import type {
  PromotionClass,
  PromotionSection,
  PromotionSession,
  StudentEnrollment,
} from "../../../features/student/studentPromotion.types";


const StudentDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    studentId,
  } = useParams<{
    studentId: string;
  }>();


  // ============================================
  // REDUX
  // ============================================

  const {
    selectedStudent,
    loading,
    error: studentError,
  } = useAppSelector(
    (state) => state.students
  );

  const {
    enrollmentHistory,
    enrollmentHistoryLoading,
    error: promotionError,
  } = useAppSelector(
    (state) => state.studentPromotion
  );


  // ============================================
  // FETCH STUDENT + ENROLLMENT HISTORY
  // ============================================

  useEffect(() => {
    if (!studentId) {
      return;
    }

    dispatch(
      getStudentById(studentId)
    );

    dispatch(
      getStudentEnrollmentHistory(studentId)
    );

    return () => {
      dispatch(
        clearSelectedStudent()
      );

      dispatch(
        clearEnrollmentHistory()
      );
    };
  }, [
    dispatch,
    studentId,
  ]);


  // ============================================
  // HELPERS
  // ============================================

  const getRelationName = (
    relation:
      | string
      | StudentRelation
  ) => {
    if (
      typeof relation ===
      "string"
    ) {
      return relation;
    }

    return (
      relation.name ||
      relation._id
    );
  };


  const getPromotionRelationName = (
    relation:
      | string
      | PromotionSession
      | PromotionClass
      | PromotionSection
  ) => {
    if (
      typeof relation ===
      "string"
    ) {
      return relation;
    }

    return (
      relation.name ||
      relation._id
    );
  };


  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const displayValue = (
    value:
      | string
      | number
      | null
      | undefined
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };


  const sortedEnrollmentHistory =
    useMemo(() => {
      return [
        ...enrollmentHistory,
      ].sort((a, b) => {
        const aTime =
          new Date(
            a.createdAt
          ).getTime();

        const bTime =
          new Date(
            b.createdAt
          ).getTime();

        return bTime - aTime;
      });
    }, [
      enrollmentHistory,
    ]);


  const currentEnrollment =
    useMemo(() => {
      return (
        sortedEnrollmentHistory.find(
          (enrollment) =>
            enrollment.enrollmentStatus ===
            "ACTIVE"
        ) ?? null
      );
    }, [
      sortedEnrollmentHistory,
    ]);


  // ============================================
  // RETRY
  // ============================================

  const handleRetry = () => {
    if (!studentId) {
      return;
    }

    dispatch(
      getStudentById(studentId)
    );

    dispatch(
      getStudentEnrollmentHistory(studentId)
    );
  };


  // ============================================
  // LOADING
  // ============================================

  if (
    loading &&
    !selectedStudent
  ) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <Icon
            icon="lucide:loader-circle"
            className="mx-auto animate-spin text-4xl text-[#1F5FAE]"
          />

          <p className="mt-3 text-sm font-medium text-[#6B7280]">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }


  // ============================================
  // STUDENT ERROR
  // ============================================

  if (
    studentError &&
    !selectedStudent
  ) {
    return (
      <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon
                icon="lucide:circle-alert"
                className="text-2xl"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#15243B]">
              Unable to load student
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              {studentError}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/school-admin/students"
                  )
                }
                className="min-h-10 rounded-lg border border-[#D1D5DB] px-4 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB]"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white hover:bg-[#174F91]"
              >
                <Icon
                  icon="lucide:refresh-cw"
                />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ============================================
  // NOT FOUND
  // ============================================

  if (!selectedStudent) {
    return (
      <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-center">
            <Icon
              icon="lucide:user-x"
              className="mx-auto text-4xl text-[#9CA3AF]"
            />

            <h2 className="mt-4 font-semibold text-[#15243B]">
              Student not found
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/school-admin/students"
                )
              }
              className="mt-5 rounded-lg bg-[#1F5FAE] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#174F91]"
            >
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }


  const student =
    selectedStudent;


  return (
    <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">

      {/* ========================================
          BREADCRUMB
      ======================================== */}

      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-[#6B7280]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/school-admin/students"
            )
          }
          className="transition-colors hover:text-[#1F5FAE]"
        >
          Students
        </button>

        <Icon
          icon="lucide:chevron-right"
          className="text-sm"
        />

        <span className="text-[#15243B]">
          Student Details
        </span>
      </div>


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#15243B] md:text-3xl">
            Student Details
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            View student profile, current academic placement and enrollment history.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/school-admin/students"
            )
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#15243B] transition-colors hover:bg-[#F9FAFB]"
        >
          <Icon
            icon="lucide:arrow-left"
            className="text-lg"
          />
          Back
        </button>
      </div>


      {/* ========================================
          PROFILE SUMMARY
      ======================================== */}

      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-5 md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F0FB] text-3xl font-bold uppercase text-[#1F5FAE]">
            {student.photo ? (
              <img
                src={student.photo}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            ) : (
              student.name
                ?.charAt(0) ||
              "S"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-[#15243B] md:text-2xl">
                {student.name}
              </h2>

              {student.status && (
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#374151]">
                  {student.status}
                </span>
              )}

              {currentEnrollment && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ACTIVE ENROLLMENT
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B7280]">
              <span className="flex items-center gap-2">
                <Icon
                  icon="lucide:badge-check"
                  className="text-[#1F5FAE]"
                />
                Admission No:{" "}
                <strong className="font-semibold text-[#15243B]">
                  {student.admissionNumber}
                </strong>
              </span>

              <span className="flex items-center gap-2">
                <Icon
                  icon="lucide:hash"
                />
                Roll No:{" "}
                <strong className="font-semibold text-[#15243B]">
                  {displayValue(
                    currentEnrollment?.rollNumber ??
                    student.rollNumber
                  )}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ======================================
            CURRENT ACADEMIC INFORMATION
        ====================================== */}

        <SectionCard
          icon="lucide:graduation-cap"
          title="Current Academic Information"
          description="Current active enrollment and academic placement."
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <DetailItem
              icon="lucide:calendar-days"
              label="Academic Session"
              value={
                currentEnrollment
                  ? getPromotionRelationName(
                      currentEnrollment.sessionId
                    )
                  : getRelationName(
                      student.sessionId
                    )
              }
            />

            <DetailItem
              icon="lucide:school"
              label="Class"
              value={
                currentEnrollment
                  ? getPromotionRelationName(
                      currentEnrollment.classId
                    )
                  : getRelationName(
                      student.classId
                    )
              }
            />

            <DetailItem
              icon="lucide:layers"
              label="Section"
              value={
                currentEnrollment
                  ? getPromotionRelationName(
                      currentEnrollment.sectionId
                    )
                  : getRelationName(
                      student.sectionId
                    )
              }
            />

            <DetailItem
              icon="lucide:hash"
              label="Roll Number"
              value={
                displayValue(
                  currentEnrollment?.rollNumber ??
                  student.rollNumber
                )
              }
            />
          </div>
        </SectionCard>


        {/* ======================================
            PERSONAL INFORMATION
        ====================================== */}

        <SectionCard
          icon="lucide:user"
          title="Personal Information"
          description="Student personal details."
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <DetailItem
              icon="lucide:user"
              label="Full Name"
              value={student.name}
            />

            <DetailItem
              icon="lucide:users"
              label="Gender"
              value={
                displayValue(
                  student.gender
                )
              }
            />

            <DetailItem
              icon="lucide:cake"
              label="Date of Birth"
              value={
                formatDate(
                  student.dob
                )
              }
            />

            <DetailItem
              icon="lucide:badge-check"
              label="Admission Number"
              value={student.admissionNumber}
            />

            <DetailItem
              icon="lucide:droplets"
              label="Blood Group"
              value={
                displayValue(
                  student.bloodGroup
                )
              }
            />

            <DetailItem
              icon="lucide:tags"
              label="Category"
              value={
                displayValue(
                  student.category
                )
              }
            />

            <DetailItem
              icon="lucide:calendar-check"
              label="Admission Date"
              value={
                formatDate(
                  student.admissionDate
                )
              }
            />

            <DetailItem
              icon="lucide:clipboard-list"
              label="Admission Type"
              value={
                displayValue(
                  student.admissionType
                )
              }
            />
          </div>
        </SectionCard>


        {/* ======================================
            CONTACT INFORMATION
        ====================================== */}

        <SectionCard
          icon="lucide:contact"
          title="Contact Information"
          description="Email and mobile details."
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <DetailItem
              icon="lucide:mail"
              label="Email"
              value={
                displayValue(
                  student.email
                )
              }
            />

            <DetailItem
              icon="lucide:phone"
              label="Mobile"
              value={
                displayValue(
                  student.mobile
                )
              }
            />
          </div>
        </SectionCard>


        {/* ======================================
            PARENT INFORMATION
        ====================================== */}

        <SectionCard
          icon="lucide:users-round"
          title="Parent Information"
          description="Father and mother details."
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <DetailItem
              icon="lucide:user-round"
              label="Father Name"
              value={
                displayValue(
                  student.father?.name
                )
              }
            />

            <DetailItem
              icon="lucide:phone"
              label="Father Mobile"
              value={
                displayValue(
                  student.father?.mobile
                )
              }
            />

            <DetailItem
              icon="lucide:user-round"
              label="Mother Name"
              value={
                displayValue(
                  student.mother?.name
                )
              }
            />

            <DetailItem
              icon="lucide:phone"
              label="Mother Mobile"
              value={
                displayValue(
                  student.mother?.mobile
                )
              }
            />
          </div>
        </SectionCard>


        {/* ======================================
            ADDRESS
        ====================================== */}

        <SectionCard
          icon="lucide:map-pin"
          title="Address"
          description="Residential address information."
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <DetailItem
                icon="lucide:map"
                label="Address Line"
                value={
                  displayValue(
                    student.address
                      ?.addressLine
                  )
                }
              />
            </div>

            <DetailItem
              icon="lucide:building-2"
              label="City"
              value={
                displayValue(
                  student.address?.city
                )
              }
            />

            <DetailItem
              icon="lucide:map"
              label="District"
              value={
                displayValue(
                  student.address?.district
                )
              }
            />

            <DetailItem
              icon="lucide:map"
              label="State"
              value={
                displayValue(
                  student.address?.state
                )
              }
            />

            <DetailItem
              icon="lucide:map-pin"
              label="Pincode"
              value={
                displayValue(
                  student.address?.pincode
                )
              }
            />

            <DetailItem
              icon="lucide:globe-2"
              label="Country"
              value={
                displayValue(
                  student.address?.country
                )
              }
            />
          </div>
        </SectionCard>


        {/* ======================================
            RECORD INFORMATION
        ====================================== */}

        <SectionCard
          icon="lucide:file-clock"
          title="Record Information"
          description="Student record timestamps and status."
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <DetailItem
              icon="lucide:calendar-plus"
              label="Created At"
              value={
                formatDate(
                  student.createdAt
                )
              }
            />

            <DetailItem
              icon="lucide:calendar-clock"
              label="Updated At"
              value={
                formatDate(
                  student.updatedAt
                )
              }
            />

            <DetailItem
              icon="lucide:activity"
              label="Student Status"
              value={
                displayValue(
                  student.status
                )
              }
            />
          </div>
        </SectionCard>
      </div>


      {/* ========================================
          ENROLLMENT HISTORY
      ======================================== */}

      <div className="mt-6 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
              <Icon
                icon="lucide:history"
                className="text-xl"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#15243B]">
                Enrollment History
              </h3>

              <p className="text-xs text-[#6B7280]">
                Academic placement history across sessions.
              </p>
            </div>
          </div>

          {!enrollmentHistoryLoading && (
            <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#374151]">
              {sortedEnrollmentHistory.length}{" "}
              Record
              {sortedEnrollmentHistory.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>


        {enrollmentHistoryLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="text-center">
              <Icon
                icon="lucide:loader-circle"
                className="mx-auto animate-spin text-3xl text-[#1F5FAE]"
              />

              <p className="mt-2 text-sm text-[#6B7280]">
                Loading enrollment history...
              </p>
            </div>
          </div>
        ) : promotionError && sortedEnrollmentHistory.length === 0 ? (
          <div className="p-5">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <Icon
                icon="lucide:circle-alert"
                className="mt-0.5 shrink-0 text-xl text-red-500"
              />

              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Failed to load enrollment history
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {promotionError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (studentId) {
                    dispatch(
                      getStudentEnrollmentHistory(
                        studentId
                      )
                    );
                  }
                }}
                className="text-sm font-semibold text-red-700 hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : sortedEnrollmentHistory.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center p-5">
            <div className="text-center">
              <Icon
                icon="lucide:history"
                className="mx-auto text-3xl text-[#9CA3AF]"
              />

              <p className="mt-3 text-sm font-semibold text-[#15243B]">
                No enrollment history found
              </p>

              <p className="mt-1 text-xs text-[#6B7280]">
                Enrollment records for this student are not available.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-[#F9FAFB]">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Session
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Class
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Section
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Roll No.
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Enrollment
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Promotion
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Promotion Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">
                {sortedEnrollmentHistory.map(
                  (enrollment) => (
                    <EnrollmentHistoryRow
                      key={enrollment._id}
                      enrollment={enrollment}
                      formatDate={formatDate}
                      getRelationName={
                        getPromotionRelationName
                      }
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


// ============================================
// SECTION CARD
// ============================================

interface SectionCardProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}


const SectionCard: React.FC<
  SectionCardProps
> = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
          <Icon
            icon={icon}
            className="text-xl"
          />
        </div>

        <div>
          <h3 className="font-semibold text-[#15243B]">
            {title}
          </h3>

          <p className="text-xs text-[#6B7280]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};


// ============================================
// DETAIL ITEM
// ============================================

interface DetailItemProps {
  icon: string;
  label: string;
  value:
    | string
    | number;
}


const DetailItem: React.FC<
  DetailItemProps
> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#6B7280]">
        <Icon
          icon={icon}
          className="text-base"
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#6B7280]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-[#15243B]">
          {value}
        </p>
      </div>
    </div>
  );
};


// ============================================
// ENROLLMENT HISTORY ROW
// ============================================

interface EnrollmentHistoryRowProps {
  enrollment: StudentEnrollment;
  formatDate: (
    value?: string
  ) => string;
  getRelationName: (
    relation:
      | string
      | PromotionSession
      | PromotionClass
      | PromotionSection
  ) => string;
}


const EnrollmentHistoryRow: React.FC<
  EnrollmentHistoryRowProps
> = ({
  enrollment,
  formatDate,
  getRelationName,
}) => {
  return (
    <tr className="transition-colors hover:bg-[#F9FAFB]">
      <td className="px-5 py-4 text-sm font-semibold text-[#15243B]">
        {getRelationName(
          enrollment.sessionId
        )}
      </td>

      <td className="px-5 py-4 text-sm text-[#15243B]">
        {getRelationName(
          enrollment.classId
        )}
      </td>

      <td className="px-5 py-4 text-sm text-[#15243B]">
        {getRelationName(
          enrollment.sectionId
        )}
      </td>

      <td className="px-5 py-4 text-sm text-[#6B7280]">
        {enrollment.rollNumber ?? "-"}
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            enrollment.enrollmentStatus ===
            "ACTIVE"
              ? "bg-emerald-50 text-emerald-700"
              : enrollment.enrollmentStatus ===
                  "COMPLETED"
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {enrollment.enrollmentStatus}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            enrollment.promotionStatus ===
            "NOT_DECIDED"
              ? "bg-gray-100 text-gray-600"
              : enrollment.promotionStatus ===
                    "PROMOTED" ||
                  enrollment.promotionStatus ===
                    "GRADUATED"
                ? "bg-emerald-50 text-emerald-700"
                : enrollment.promotionStatus ===
                    "RETAINED"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-blue-50 text-blue-700"
          }`}
        >
          {enrollment.promotionStatus}
        </span>
      </td>

      <td className="px-5 py-4 text-sm text-[#6B7280]">
        {formatDate(
          enrollment.promotionDate
        )}
      </td>

      <td className="max-w-[260px] px-5 py-4 text-sm text-[#6B7280]">
        <span className="line-clamp-2">
          {enrollment.remarks || "-"}
        </span>
      </td>
    </tr>
  );
};


export default StudentDetails;
