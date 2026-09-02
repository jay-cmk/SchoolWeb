// import React, { useEffect } from "react";
// import { Icon } from "@iconify/react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import HomeworkState from "../../../components/homework/HomeworkState";
// import { getHomeworkById } from "../../../features/homework/homework.slice";
// import { getHomeworkSubmissionStats } from "../../../features/homework/homeworkSubmission.slice";

// const labelOf = (v:any) => typeof v === "string" ? v : v?.name ?? v?.sessionName ?? "—";
// const sizeOf = (n?:number) => !n ? "" : n > 1024*1024 ? `${(n/1024/1024).toFixed(1)} MB` : `${Math.round(n/1024)} KB`;

// const HomeworkDetails: React.FC = () => {
//   const { homeworkId } = useParams(); const dispatch = useDispatch<any>(); const navigate = useNavigate();
//   const { selectedHomework: h, loading, error } = useSelector((s:any)=>s.homework ?? {});
//   const stats = useSelector((s:any)=>s.homeworkSubmission?.stats ?? null);
//   useEffect(()=>{ if(homeworkId){ dispatch(getHomeworkById(homeworkId)); dispatch(getHomeworkSubmissionStats(homeworkId)); } },[dispatch,homeworkId]);
//   if (loading && !h) return <div className="min-h-screen bg-slate-50 p-8"><HomeworkState type="loading"/></div>;
//   if (error || !h) return <div className="min-h-screen bg-slate-50 p-8"><HomeworkState type="error" message={error ?? "Homework not found"} onRetry={()=>homeworkId&&dispatch(getHomeworkById(homeworkId))}/></div>;
//   const submitted = stats?.totalSubmitted ?? 0, late = stats?.lateSubmitted ?? 0, total = submitted, pending = 0;
//   const progress = total ? Math.round((submitted/total)*100) : 0;
//   const status = h.status === "DRAFT" ? "Draft" : h.status === "CLOSED" ? "Completed" : new Date(h.dueDate).getTime() < Date.now() ? "Overdue" : "Active";

//   return <div className="min-h-screen bg-slate-50"><main className="mx-auto w-full max-w-[1240px] space-y-6 p-6 lg:p-8">
//     <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><button onClick={()=>navigate("/school-admin/homework")} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"><Icon icon="lucide:arrow-left"/>Back to Homework</button><div className="mt-4 text-sm text-slate-500">Academics / Homework / {h.title}</div><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-slate-900">{h.title}</h1><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{status}</span></div><p className="mt-2 text-sm text-slate-500">{labelOf(h.subjectId)} · {labelOf(h.classId)} · {labelOf(h.sectionId)} · Created by {labelOf(h.teacherId)}</p></div><div className="flex gap-3"><button onClick={()=>navigate(`/school-admin/homework/${h._id}/edit`)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon icon="lucide:pencil"/>Edit Homework</button><button onClick={()=>navigate(`/school-admin/homework/${h._id}/submissions`)} className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">View Submissions</button></div></div>
//     <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[["Total Students",total,"text-slate-900"],["Submitted",submitted,"text-emerald-600"],["Pending",pending,"text-slate-900"],["Late",late,"text-red-600"]].map(([a,b,c])=><div key={String(a)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{a}</p><p className={`mt-2 text-3xl font-bold ${c}`}>{b}</p></div>)}</section>
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"><h2 className="text-lg font-semibold text-slate-900">Homework brief</h2><p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{h.description}</p>{h.attachment&&<div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="rounded-lg bg-white p-2 text-blue-600"><Icon icon="lucide:file-text" className="h-5 w-5"/></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{h.attachment.fileName}</p><p className="text-xs text-slate-500">{h.attachment.fileType ?? "Attachment"} {sizeOf(h.attachment.fileSize)}</p></div></div><a href={h.attachment.fileUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-blue-600"><Icon icon="lucide:download"/>Download</a></div>}
//     <div className="mt-6 border-t border-slate-200 pt-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-900">Submission progress</h2><p className="mt-1 text-sm text-slate-500">{submitted} submissions received</p></div><button onClick={()=>navigate(`/school-admin/homework/${h._id}/submissions`)} className="text-sm font-semibold text-blue-600 hover:underline">Review submissions</button></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{width:`${progress}%`}}/></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{progress}% submitted</span><span>{stats?.pendingReview ?? 0} pending review</span></div></div></section>
//     <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">Assignment details</h2><dl className="mt-5 space-y-5 text-sm">{[["Academic Year",labelOf(h.sessionId)],["Class",labelOf(h.classId)],["Section",labelOf(h.sectionId)],["Subject",labelOf(h.subjectId)],["Teacher",labelOf(h.teacherId)],["Assigned Date",new Date(h.assignedDate).toLocaleDateString()],["Due Date",new Date(h.dueDate).toLocaleDateString()]].map(([k,v])=><div key={k}><dt className="text-slate-500">{k}</dt><dd className="mt-1 font-semibold text-slate-900">{v}</dd></div>)}</dl></aside></div>
//   </main></div>;
// };
// export default HomeworkDetails;











import React, {
  useEffect,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import HomeworkState from "../../../components/homework/HomeworkState";

import {
  changeHomeworkStatus,
  getHomeworkById,
} from "../../../features/homework/homework.slice";

import { getHomeworkSubmissionStats } from "../../../features/homework/homeworkSubmission.slice";


// ======================================================
// HELPERS
// ======================================================

const labelOf = (value: any) => {
  if (typeof value === "string") {
    return value;
  }

  return (
    value?.name ??
    value?.sessionName ??
    "—"
  );
};


const sizeOf = (size?: number) => {
  if (!size) {
    return "";
  }

  if (size > 1024 * 1024) {
    return `${(
      size /
      1024 /
      1024
    ).toFixed(1)} MB`;
  }

  return `${Math.round(
    size / 1024
  )} KB`;
};


// ======================================================
// COMPONENT
// ======================================================

const HomeworkDetails: React.FC = () => {
  const {
    homeworkId,
  } = useParams();

  const dispatch =
    useDispatch<any>();

  const navigate =
    useNavigate();


  // ====================================================
  // LOCAL STATE
  // ====================================================

  const [
    confirmAction,
    setConfirmAction,
  ] = useState<
    "PUBLISH" | "CLOSE" | null
  >(null);


  // ====================================================
  // REDUX STATE
  // ====================================================

  const {
    selectedHomework: h,
    loading,
    error,
  } = useSelector(
    (state: any) =>
      state.homework ?? {}
  );


  const stats = useSelector(
    (state: any) =>
      state.homeworkSubmission
        ?.stats ?? null
  );


  // ====================================================
  // FETCH HOMEWORK
  // ====================================================

  useEffect(() => {
    if (!homeworkId) {
      return;
    }

    dispatch(
      getHomeworkById(
        homeworkId
      )
    );

    dispatch(
      getHomeworkSubmissionStats(
        homeworkId
      )
    );
  }, [
    dispatch,
    homeworkId,
  ]);


  // ====================================================
  // CHANGE STATUS
  // ====================================================

  const handleStatusChange =
    async (
      status:
        | "PUBLISHED"
        | "CLOSED"
    ) => {
      if (!h?._id) {
        return;
      }

      try {
        await dispatch(
          changeHomeworkStatus({
            homeworkId:
              h._id,

            status,
          })
        ).unwrap();

        setConfirmAction(
          null
        );

      } catch (err) {
        console.error(
          "Failed to change homework status:",
          err
        );
      }
    };


  // ====================================================
  // LOADING
  // ====================================================

  if (
    loading &&
    !h
  ) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState
          type="loading"
        />
      </div>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (
    error ||
    !h
  ) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <HomeworkState
          type="error"
          message={
            error ??
            "Homework not found"
          }
          onRetry={() => {
            if (homeworkId) {
              dispatch(
                getHomeworkById(
                  homeworkId
                )
              );
            }
          }}
        />
      </div>
    );
  }


  // ====================================================
  // SUBMISSION STATS
  // ====================================================

  const submitted =
    stats?.totalSubmitted ??
    0;

  const late =
    stats?.lateSubmitted ??
    0;

  /*
   * Student module / total students
   * properly integrate hone ke baad
   * totalStudents backend se aayega.
   */

  const total =
    stats?.totalStudents ??
    submitted;

  const pending =
    stats?.pendingStudents ??
    Math.max(
      total - submitted,
      0
    );


  const progress =
    total > 0
      ? Math.round(
          (submitted / total) *
            100
        )
      : 0;


  // ====================================================
  // DERIVED STATUS
  // ====================================================

  let displayStatus:
    | "Draft"
    | "Active"
    | "Overdue"
    | "Completed";


  if (
    h.status === "DRAFT"
  ) {
    displayStatus =
      "Draft";

  } else if (
    h.status === "CLOSED"
  ) {
    displayStatus =
      "Completed";

  } else if (
    new Date(
      h.dueDate
    ).getTime() <
    Date.now()
  ) {
    displayStatus =
      "Overdue";

  } else {
    displayStatus =
      "Active";
  }


  // ====================================================
  // STATUS BADGE
  // ====================================================

  const statusClass =
    displayStatus ===
    "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : displayStatus ===
          "Overdue"
        ? "bg-red-50 text-red-700"
        : displayStatus ===
            "Draft"
          ? "bg-amber-50 text-amber-700"
          : "bg-blue-50 text-blue-700";


  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="mx-auto w-full max-w-[1240px] space-y-6 p-6 lg:p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

          {/* LEFT */}

          <div>

            <button
              onClick={() =>
                navigate(
                  "/school-admin/homework"
                )
              }
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              <Icon icon="lucide:arrow-left" />

              Back to Homework
            </button>


            <div className="mt-4 text-sm text-slate-500">
              Academics / Homework /{" "}
              {h.title}
            </div>


            <div className="mt-2 flex flex-wrap items-center gap-3">

              <h1 className="text-2xl font-bold text-slate-900">
                {h.title}
              </h1>


              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
              >
                {displayStatus}
              </span>

            </div>


            <p className="mt-2 text-sm text-slate-500">

              {labelOf(
                h.subjectId
              )}

              {" · "}

              {labelOf(
                h.classId
              )}

              {" · "}

              {labelOf(
                h.sectionId
              )}

              {" · Created by "}

              {labelOf(
                h.teacherId
              )}

            </p>

          </div>


          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="flex flex-wrap gap-3">

            {/* ----------------------------------------------
                DRAFT
            ---------------------------------------------- */}

            {h.status ===
              "DRAFT" && (
              <>

                <button
                  onClick={() =>
                    navigate(
                      `/school-admin/homework/${h._id}/edit`
                    )
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Icon icon="lucide:pencil" />

                  Edit Homework
                </button>


                <button
                  onClick={() =>
                    setConfirmAction(
                      "PUBLISH"
                    )
                  }
                  disabled={
                    loading
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon icon="lucide:send" />

                  Publish Homework
                </button>

              </>
            )}


            {/* ----------------------------------------------
                PUBLISHED
            ---------------------------------------------- */}

            {h.status ===
              "PUBLISHED" && (
              <>

                <button
                  onClick={() =>
                    navigate(
                      `/school-admin/homework/${h._id}/edit`
                    )
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Icon icon="lucide:pencil" />

                  Edit Homework
                </button>


                <button
                  onClick={() =>
                    navigate(
                      `/school-admin/homework/${h._id}/submissions`
                    )
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Icon icon="lucide:users" />

                  View Submissions
                </button>


                <button
                  onClick={() =>
                    setConfirmAction(
                      "CLOSE"
                    )
                  }
                  disabled={
                    loading
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-600 bg-white px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon icon="lucide:circle-check" />

                  Close Homework
                </button>

              </>
            )}


            {/* ----------------------------------------------
                CLOSED / COMPLETED
            ---------------------------------------------- */}

            {h.status ===
              "CLOSED" && (
              <>

                <button
                  onClick={() =>
                    navigate(
                      `/school-admin/homework/${h._id}/submissions`
                    )
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Icon icon="lucide:users" />

                  View Submissions
                </button>


                <div className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700">

                  <Icon icon="lucide:circle-check-big" />

                  Completed

                </div>

              </>
            )}

          </div>

        </div>


        {/* ==================================================
            STATS
        ================================================== */}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {[
            [
              "Total Students",
              total,
              "text-slate-900",
            ],

            [
              "Submitted",
              submitted,
              "text-emerald-600",
            ],

            [
              "Pending",
              pending,
              "text-slate-900",
            ],

            [
              "Late",
              late,
              "text-red-600",
            ],
          ].map(
            ([
              title,
              value,
              className,
            ]) => (
              <div
                key={String(
                  title
                )}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">
                  {title}
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${className}`}
                >
                  {value}
                </p>

              </div>
            )
          )}

        </section>


        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ==================================================
              HOMEWORK BRIEF
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="text-lg font-semibold text-slate-900">
              Homework brief
            </h2>


            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">
              {h.description}
            </p>


            {/* ATTACHMENT */}

            {h.attachment && (

              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-3">

                  <span className="rounded-lg bg-white p-2 text-blue-600">
                    <Icon
                      icon="lucide:file-text"
                      className="h-5 w-5"
                    />
                  </span>


                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {
                        h.attachment
                          .fileName
                      }
                    </p>


                    <p className="text-xs text-slate-500">

                      {h.attachment
                        .fileType ??
                        "Attachment"}

                      {" "}

                      {sizeOf(
                        h.attachment
                          .fileSize
                      )}

                    </p>

                  </div>

                </div>


                <a
                  href={
                    h.attachment
                      .fileUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-blue-600"
                >
                  <Icon icon="lucide:download" />

                  Download
                </a>

              </div>
            )}


            {/* ==================================================
                SUBMISSION PROGRESS
            ================================================== */}

            <div className="mt-6 border-t border-slate-200 pt-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Submission progress
                  </h2>


                  <p className="mt-1 text-sm text-slate-500">
                    {submitted} submissions received
                  </p>

                </div>


                <button
                  onClick={() =>
                    navigate(
                      `/school-admin/homework/${h._id}/submissions`
                    )
                  }
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Review submissions
                </button>

              </div>


              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>


              <div className="mt-2 flex justify-between text-xs text-slate-500">

                <span>
                  {progress}% submitted
                </span>

                <span>
                  {stats?.pendingReview ??
                    0}{" "}
                  pending review
                </span>

              </div>

            </div>

          </section>


          {/* ==================================================
              ASSIGNMENT DETAILS
          ================================================== */}

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Assignment details
            </h2>


            <dl className="mt-5 space-y-5 text-sm">

              {[
                [
                  "Academic Year",
                  labelOf(
                    h.sessionId
                  ),
                ],

                [
                  "Class",
                  labelOf(
                    h.classId
                  ),
                ],

                [
                  "Section",
                  labelOf(
                    h.sectionId
                  ),
                ],

                [
                  "Subject",
                  labelOf(
                    h.subjectId
                  ),
                ],

                [
                  "Teacher",
                  labelOf(
                    h.teacherId
                  ),
                ],

                [
                  "Assigned Date",
                  new Date(
                    h.assignedDate
                  ).toLocaleDateString(),
                ],

                [
                  "Due Date",
                  new Date(
                    h.dueDate
                  ).toLocaleDateString(),
                ],
              ].map(
                ([
                  key,
                  value,
                ]) => (
                  <div
                    key={String(
                      key
                    )}
                  >
                    <dt className="text-slate-500">
                      {key}
                    </dt>

                    <dd className="mt-1 font-semibold text-slate-900">
                      {value}
                    </dd>
                  </div>
                )
              )}

            </dl>

          </aside>

        </div>

      </main>


      {/* ======================================================
          CONFIRM MODAL
      ====================================================== */}

      {confirmAction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                confirmAction ===
                "CLOSE"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >

              <Icon
                icon={
                  confirmAction ===
                  "CLOSE"
                    ? "lucide:circle-check"
                    : "lucide:send"
                }
                className="h-6 w-6"
              />

            </div>


            <h2 className="mt-4 text-xl font-bold text-slate-900">

              {confirmAction ===
              "CLOSE"
                ? "Close Homework?"
                : "Publish Homework?"}

            </h2>


            <p className="mt-2 text-sm leading-6 text-slate-500">

              {confirmAction ===
              "CLOSE"
                ? "After closing this homework, students will no longer be able to submit it."
                : "After publishing this homework, it will become available for student submissions."}

            </p>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                disabled={
                  loading
                }
                onClick={() =>
                  setConfirmAction(
                    null
                  )
                }
                className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>


              <button
                type="button"
                disabled={
                  loading
                }
                onClick={() =>
                  handleStatusChange(
                    confirmAction ===
                      "CLOSE"
                      ? "CLOSED"
                      : "PUBLISHED"
                  )
                }
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmAction ===
                  "CLOSE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >

                {loading ? (
                  <>
                    <Icon
                      icon="lucide:loader-circle"
                      className="animate-spin"
                    />

                    Please wait...
                  </>
                ) : (
                  <>
                    <Icon
                      icon={
                        confirmAction ===
                        "CLOSE"
                          ? "lucide:circle-check"
                          : "lucide:send"
                      }
                    />

                    {confirmAction ===
                    "CLOSE"
                      ? "Close Homework"
                      : "Publish Homework"}
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};


export default HomeworkDetails;