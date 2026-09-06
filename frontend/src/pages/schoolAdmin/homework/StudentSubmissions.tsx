import React, { useEffect, useMemo, useState } from "react";

import { Icon } from "@iconify/react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import SubmissionTable from "../../../components/homework/SubmissionTable";
import HomeworkState from "../../../components/homework/HomeworkState";

import { getHomeworkById } from "../../../features/homework/homework.slice";

import {
  getHomeworkSubmissions,
  getHomeworkSubmissionStats,
  reviewHomeworkSubmission,
} from "../../../features/homework/homeworkSubmission.slice";

import {
  HomeworkSubmissionStatus,
  type HomeworkSubmission,
  type HomeworkSubmissionFilters,
} from "../../../features/homework/homeworkSubmission.types";

const labelOf = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "name" in value) {
    const name = (
      value as {
        name?: unknown;
      }
    ).name;

    return typeof name === "string" ? name : "—";
  }

  return "—";
};

const getId = (value: unknown): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "_id" in value) {
    return (
      (
        value as {
          _id?: string;
        }
      )._id ?? ""
    );
  }

  return "";
};

const studentNameOf = (submission: HomeworkSubmission) => {
  if (typeof submission.studentId === "string") {
    return submission.studentId;
  }

  const student = submission.studentId;

  return (
    student.name ??
    [student.firstName, student.lastName].filter(Boolean).join(" ") ??
    "Student"
  );
};

const StudentSubmissions: React.FC = () => {
  const { homeworkId } = useParams<{
    homeworkId: string;
  }>();

  const dispatch = useDispatch<any>();

  const navigate = useNavigate();

  const homeworkState = useSelector((state: any) => state.homework ?? {});

  const homework = homeworkState?.selectedHomework ?? null;

  const homeworkLoading = Boolean(homeworkState?.loading);

  const homeworkError = homeworkState?.error ?? null;

  const selectedSessionId = useSelector(
    (state: any) => state.sessionSelection?.selectedSessionId ?? "",
  ) as string;

  const {
    submissions = [],
    stats = null,
    loading = false,
    error = null,
  } = useSelector((state: any) => state.homeworkSubmission ?? {});

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<"" | HomeworkSubmissionStatus>("");

  const [selected, setSelected] = useState<HomeworkSubmission | null>(null);

  const [reviewing, setReviewing] = useState<HomeworkSubmission | null>(null);

  const [remarks, setRemarks] = useState("");

  const [marks, setMarks] = useState("");

  const filters: HomeworkSubmissionFilters = useMemo(
    () => ({
      ...(search ? { search } : {}),

      ...(status
        ? {
            submissionStatus: status,
          }
        : {}),
    }),
    [search, status],
  );

  const homeworkMatchesSession = Boolean(
    homeworkId &&
    homework?._id === homeworkId &&
    selectedSessionId &&
    getId(homework.sessionId) === selectedSessionId,
  );

  useEffect(() => {
    setSelected(null);
    setReviewing(null);

    if (!homeworkId || !selectedSessionId) {
      return;
    }

    dispatch(getHomeworkById(homeworkId));
  }, [dispatch, homeworkId, selectedSessionId]);

  useEffect(() => {
    if (!homeworkId || !homeworkMatchesSession) {
      return;
    }

    dispatch(
      getHomeworkSubmissions({
        homeworkId,
        filters,
      }),
    );

    dispatch(getHomeworkSubmissionStats(homeworkId));
  }, [dispatch, homeworkId, homeworkMatchesSession, filters]);

  const submitted = stats?.onTimeSubmitted ?? 0;

  const late = stats?.lateSubmitted ?? 0;

  const totalSubmitted = stats?.totalSubmitted ?? 0;

  const pendingReview = stats?.pendingReview ?? 0;

  const download = (submission: HomeworkSubmission) => {
    if (!homeworkMatchesSession || !submission.attachment?.fileUrl) {
      return;
    }

    window.open(submission.attachment.fileUrl, "_blank", "noopener,noreferrer");
  };

  const openReview = (submission: HomeworkSubmission) => {
    if (!homeworkMatchesSession) {
      return;
    }

    setReviewing(submission);
    setRemarks(submission.remarks ?? "");
    setMarks(submission.marks?.toString() ?? "");
  };

  const saveReview = async () => {
    if (!reviewing || !homeworkId || !homeworkMatchesSession) {
      return;
    }

    const result = await dispatch(
      reviewHomeworkSubmission({
        submissionId: reviewing._id,

        data: {
          ...(remarks.trim()
            ? {
                remarks: remarks.trim(),
              }
            : {}),

          ...(marks !== ""
            ? {
                marks: Number(marks),
              }
            : {}),
        },
      }),
    );

    if (reviewHomeworkSubmission.fulfilled.match(result)) {
      setReviewing(null);

      dispatch(
        getHomeworkSubmissions({
          homeworkId,
          filters,
        }),
      );

      dispatch(getHomeworkSubmissionStats(homeworkId));
    }
  };

  const exportCsv = () => {
    if (!homeworkId || !homeworkMatchesSession || submissions.length === 0) {
      return;
    }

    const rows = [
      [
        "Student",
        "Submitted At",
        "Status",
        "Review Status",
        "Marks",
        "Remarks",
      ],

      ...submissions.map((submission: HomeworkSubmission) => [
        studentNameOf(submission),
        submission.submittedAt,
        submission.submissionStatus,
        submission.reviewStatus,
        submission.marks ?? "",
        submission.remarks ?? "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value: unknown) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `homework-submissions-${homeworkId}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  if (!homeworkId) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState
          type="error"
          title="Invalid homework"
          message="Homework ID was not found."
        />
      </div>
    );
  }

  if (!selectedSessionId) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState
          type="error"
          title="Academic session required"
          message="Please select an academic session from the topbar."
        />
      </div>
    );
  }

  if (homeworkLoading && (!homework || homework._id !== homeworkId)) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState type="loading" />
      </div>
    );
  }

  if (homeworkError || !homework || homework._id !== homeworkId) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState
          type="error"
          message={homeworkError ?? "Homework not found"}
        />
      </div>
    );
  }

  if (!homeworkMatchesSession) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState
          type="error"
          title="Submissions unavailable"
          message="This homework does not belong to the academic session selected in the topbar."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-[1320px] space-y-6 p-6 lg:p-8">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/school-admin/homework/${homeworkId}`)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <Icon icon="lucide:arrow-left" className="h-4 w-4" />
            Back to {homework.title}
          </button>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm text-slate-500">
                Homework / {homework.title} / Submissions
              </div>

              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                Student Submissions
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {labelOf(homework.classId)} · {labelOf(homework.sectionId)} ·{" "}
                {labelOf(homework.subjectId)} · Due{" "}
                {new Date(homework.dueDate).toLocaleDateString()}
              </p>
            </div>

            <button
              type="button"
              onClick={exportCsv}
              disabled={submissions.length === 0}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="lucide:download" className="h-4 w-4" />
              Export submissions
            </button>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Submission summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {totalSubmitted} submissions received
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-sm">
              <span>
                <b className="text-emerald-600">{submitted}</b> submitted
              </span>

              <span>
                <b className="text-amber-700">{late}</b> late
              </span>

              <span>
                <b className="text-slate-900">{pendingReview}</b> pending review
              </span>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${
                  totalSubmitted
                    ? Math.round(((submitted + late) / totalSubmitted) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Submission records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review submitted work and teacher remarks.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Icon
                  icon="lucide:search"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student..."
                  className="min-h-11 w-64 rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "" | HomeworkSubmissionStatus)
                }
                className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">All statuses</option>

                <option value={HomeworkSubmissionStatus.SUBMITTED}>
                  Submitted
                </option>

                <option value={HomeworkSubmissionStatus.LATE}>Late</option>
              </select>
            </div>
          </div>

          {loading && submissions.length === 0 ? (
            <div className="p-5">
              <HomeworkState type="loading" />
            </div>
          ) : error ? (
            <div className="p-5">
              <HomeworkState type="error" message={error} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-5">
              <HomeworkState type="no-submissions" />
            </div>
          ) : (
            <SubmissionTable
              submissions={submissions}
              onView={setSelected}
              onDownload={download}
              onReview={openReview}
            />
          )}
        </section>
      </main>

      {selected && (
        <Modal title="Submission Details" onClose={() => setSelected(null)}>
          <div className="space-y-3 text-sm">
            <p>
              <b>Status:</b> {selected.submissionStatus}
            </p>

            <p>
              <b>Submitted:</b>{" "}
              {new Date(selected.submittedAt).toLocaleString()}
            </p>

            <p>
              <b>Text:</b> {selected.submissionText || "—"}
            </p>

            <p>
              <b>Review:</b> {selected.reviewStatus}
            </p>

            <p>
              <b>Remarks:</b> {selected.remarks || "—"}
            </p>

            <p>
              <b>Marks:</b> {selected.marks ?? "—"}
            </p>
          </div>
        </Modal>
      )}

      {reviewing && (
        <Modal title="Review Submission" onClose={() => setReviewing(null)}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Teacher Remark
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Marks
              <input
                type="number"
                min="0"
                value={marks}
                onChange={(event) => setMarks(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-500"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewing(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void saveReview()}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Review
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Icon icon="lucide:x" className="h-5 w-5" />
        </button>
      </div>

      {children}
    </div>
  </div>
);

export default StudentSubmissions;
