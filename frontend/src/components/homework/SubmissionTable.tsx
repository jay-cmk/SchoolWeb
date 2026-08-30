import React from "react";
import { Icon } from "@iconify/react";

import type {
  HomeworkSubmission,
} from "../../features/homework/homeworkSubmission.types";


// ============================================
// HELPERS
// ============================================

const studentName = (v: any) => {
  if (typeof v === "string") {
    return v;
  }

  const fullName = [
    v?.firstName,
    v?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    v?.name ??
    (fullName || "Student")
  );
};


const studentField = (
  v: any,
  key: "admissionNumber" | "rollNumber"
) => {

  if (typeof v === "string") {
    return "—";
  }

  return (
    v?.[key] ??
    "—"
  );
};


// ============================================
// PROPS
// ============================================

interface SubmissionTableProps {
  submissions: HomeworkSubmission[];

  onView: (
    submission: HomeworkSubmission
  ) => void;

  onDownload: (
    submission: HomeworkSubmission
  ) => void;

  onReview: (
    submission: HomeworkSubmission
  ) => void;
}


// ============================================
// COMPONENT
// ============================================

const SubmissionTable:
React.FC<
  SubmissionTableProps
> = ({
  submissions,
  onView,
  onDownload,
  onReview,
}) => {

  return (

    <div className="overflow-x-auto">

      <table
        className="
          min-w-[1100px]
          w-full
          text-left
        "
      >

        {/* ======================================
            TABLE HEADER
        ====================================== */}

        <thead
          className="
            border-y
            border-slate-200

            bg-slate-50

            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-slate-500
          "
        >

          <tr>

            <th className="px-5 py-4">
              Student
            </th>

            <th className="px-4 py-4">
              Admission Number
            </th>

            <th className="px-4 py-4">
              Roll Number
            </th>

            <th className="px-4 py-4">
              Submission Date
            </th>

            <th className="px-4 py-4">
              Submission Status
            </th>

            <th className="px-4 py-4">
              Attachment
            </th>

            <th className="px-4 py-4">
              Teacher Remark
            </th>

            <th className="px-5 py-4">
              Actions
            </th>

          </tr>

        </thead>


        {/* ======================================
            TABLE BODY
        ====================================== */}

        <tbody
          className="
            divide-y
            divide-slate-100

            text-sm
          "
        >

          {submissions.map(
            (submission) => {

              const isLate =
                submission
                  .submissionStatus ===
                "LATE";

              const hasAttachment =
                !!submission.attachment;

              return (

                <tr
                  key={
                    submission._id
                  }
                  className="
                    transition-colors

                    hover:bg-slate-50/70
                  "
                >

                  {/* STUDENT */}

                  <td
                    className="
                      px-5
                      py-4

                      font-semibold
                      text-slate-900
                    "
                  >
                    {
                      studentName(
                        submission.studentId
                      )
                    }
                  </td>


                  {/* ADMISSION NUMBER */}

                  <td
                    className="
                      px-4
                      py-4

                      text-slate-500
                    "
                  >
                    {
                      studentField(
                        submission.studentId,
                        "admissionNumber"
                      )
                    }
                  </td>


                  {/* ROLL NUMBER */}

                  <td
                    className="
                      px-4
                      py-4

                      text-slate-500
                    "
                  >
                    {
                      studentField(
                        submission.studentId,
                        "rollNumber"
                      )
                    }
                  </td>


                  {/* SUBMISSION DATE */}

                  <td
                    className={`
                      px-4
                      py-4

                      ${
                        isLate
                          ? `
                              font-medium
                              text-red-600
                            `
                          : `
                              text-slate-500
                            `
                      }
                    `}
                  >
                    {
                      new Date(
                        submission
                          .submittedAt
                      ).toLocaleString()
                    }
                  </td>


                  {/* SUBMISSION STATUS */}

                  <td
                    className="
                      px-4
                      py-4
                    "
                  >

                    <span
                      className={`
                        rounded-full

                        px-2.5
                        py-1

                        text-xs
                        font-semibold

                        ${
                          isLate
                            ? `
                                bg-amber-50
                                text-amber-700
                              `
                            : `
                                bg-emerald-50
                                text-emerald-700
                              `
                        }
                      `}
                    >

                      {
                        isLate
                          ? "Late"
                          : "Submitted"
                      }

                    </span>

                  </td>


                  {/* ATTACHMENT */}

                  <td
                    className="
                      px-4
                      py-4
                    "
                  >

                    {
                      hasAttachment ? (

                        <button
                          type="button"
                          onClick={() =>
                            onDownload(
                              submission
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1

                            font-semibold
                            text-blue-600

                            hover:underline
                          "
                        >

                          <Icon
                            icon="lucide:file-text"
                            className="
                              h-4
                              w-4
                            "
                          />

                          {
                            submission
                              .attachment
                              ?.fileName
                          }

                        </button>

                      ) : (

                        <span
                          className="
                            text-slate-400
                          "
                        >
                          —
                        </span>

                      )
                    }

                  </td>


                  {/* TEACHER REMARK */}

                  <td
                    className="
                      max-w-56
                      truncate

                      px-4
                      py-4

                      text-slate-500
                    "
                    title={
                      submission
                        .remarks
                    }
                  >

                    {
                      submission
                        .remarks ||
                      "—"
                    }

                  </td>


                  {/* ACTIONS */}

                  <td
                    className="
                      px-5
                      py-4
                    "
                  >

                    <div
                      className="
                        flex
                        gap-2
                      "
                    >

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          onView(
                            submission
                          )
                        }
                        title="View"
                        className="
                          rounded-lg

                          border
                          border-slate-200

                          p-2

                          text-blue-600

                          transition-colors

                          hover:bg-blue-50
                        "
                      >

                        <Icon
                          icon="lucide:eye"
                          className="
                            h-4
                            w-4
                          "
                        />

                      </button>


                      {/* DOWNLOAD */}

                      {
                        hasAttachment && (

                          <button
                            type="button"
                            onClick={() =>
                              onDownload(
                                submission
                              )
                            }
                            title="Download"
                            className="
                              rounded-lg

                              border
                              border-slate-200

                              p-2

                              text-slate-600

                              transition-colors

                              hover:bg-slate-50
                            "
                          >

                            <Icon
                              icon="lucide:download"
                              className="
                                h-4
                                w-4
                              "
                            />

                          </button>

                        )
                      }


                      {/* REVIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          onReview(
                            submission
                          )
                        }
                        title="Review"
                        className="
                          rounded-lg

                          border
                          border-slate-200

                          p-2

                          text-emerald-600

                          transition-colors

                          hover:bg-emerald-50
                        "
                      >

                        <Icon
                          icon="lucide:message-square-text"
                          className="
                            h-4
                            w-4
                          "
                        />

                      </button>

                    </div>

                  </td>

                </tr>

              );
            }
          )}

        </tbody>

      </table>

    </div>

  );
};


export default SubmissionTable;