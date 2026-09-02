// import React, { useEffect, useMemo, useState } from "react";
// import { Icon } from "@iconify/react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import HomeworkStats from "../../../components/homework/HomeworkStats";
// import HomeworkFilters, { type FilterOption } from "../../../components/homework/HomeworkFilters";
// import HomeworkTable from "../../../components/homework/HomeworkTable";
// import HomeworkCalendar from "../../../components/homework/HomeworkCalendar";
// import HomeworkState from "../../../components/homework/HomeworkState";
// import { deleteHomework, getHomeworks, getHomeworkStats } from "../../../features/homework/homework.slice";
// import type { HomeworkFilters as HomeworkFilterType } from "../../../features/homework/homework.types";

// const optionOf = (list: any[], fallback = "name"): FilterOption[] => list.map((x:any)=>({ value: x._id ?? x.id, label: x.name ?? x.sessionName ?? x.title ?? x[fallback] ?? "Unnamed" })).filter(x=>x.value);

// const HomeworkList: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();
//   const { homeworks = [], stats = null, pagination = null, loading = false, error = null } = useSelector((s:any)=>s.homework ?? {});
//   const [view, setView] = useState<"list"|"calendar">("list");
//   const [filters, setFilters] = useState<HomeworkFilterType>({ page: 1, limit: 10 });

//   const sessions = useSelector((s:any)=>s.sessions?.sessions ?? s.academicSessions?.sessions ?? []);
//   const classes = useSelector((s:any)=>s.classes?.classes ?? []);
//   const sections = useSelector((s:any)=>s.sections?.sections ?? []);
//   const subjects = useSelector((s:any)=>s.subjects?.subjects ?? []);
//   const teachers = useSelector((s:any)=>s.teachers?.teachers ?? []);

//   useEffect(()=>{ dispatch(getHomeworks(filters)); dispatch(getHomeworkStats()); }, [dispatch, filters]);

//   const options = useMemo(()=>({ sessions:optionOf(sessions), classes:optionOf(classes), sections:optionOf(sections), subjects:optionOf(subjects), teachers:optionOf(teachers) }),[sessions,classes,sections,subjects,teachers]);
//   const remove = async (id:string) => { if (!window.confirm("Delete this homework?")) return; await dispatch(deleteHomework(id)); dispatch(getHomeworkStats()); };

//   return <div className="min-h-screen bg-slate-50"><main className="mx-auto w-full max-w-[1400px] space-y-6 p-6 lg:p-8">
//     <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="text-sm text-slate-500">Academics / Homework</div><h1 className="mt-2 text-2xl font-bold text-slate-900">Homework</h1><p className="mt-1 text-sm text-slate-500">Monitor assignments, deadlines and student submissions.</p></div><div className="flex flex-wrap gap-3"><div className="inline-flex rounded-lg border border-slate-200 bg-white p-1"><button onClick={()=>setView("list")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${view==="list"?"bg-blue-600 text-white":"text-slate-600 hover:bg-slate-50"}`}><Icon icon="lucide:list" className="h-4 w-4"/>List</button><button onClick={()=>setView("calendar")} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${view==="calendar"?"bg-blue-600 text-white":"text-slate-600 hover:bg-slate-50"}`}><Icon icon="lucide:calendar" className="h-4 w-4"/>Calendar</button></div><button onClick={()=>navigate("/school-admin/homework/add")} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"><Icon icon="lucide:plus" className="h-4 w-4"/>Add Homework</button></div></div>

//     <HomeworkStats stats={stats}/>
//     <HomeworkFilters filters={filters} {...options} onChange={setFilters} onReset={()=>setFilters({page:1,limit:10})}/>
//     {loading && homeworks.length===0 ? <HomeworkState type="loading"/> : error ? <HomeworkState type="error" message={error} onRetry={()=>dispatch(getHomeworks(filters))}/> : homeworks.length===0 ? <HomeworkState type="empty"/> : view==="calendar" ? <HomeworkCalendar homeworks={homeworks} onView={(id)=>navigate(`/school-admin/homework/${id}`)}/> : <HomeworkTable homeworks={homeworks} onView={(id)=>navigate(`/school-admin/homework/${id}`)} onSubmissions={(id)=>navigate(`/school-admin/homework/${id}/submissions`)} onDelete={remove}/>} 

//     {view==="list" && pagination && pagination.totalPages>1 && <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm"><span className="text-slate-500">Page {pagination.page} of {pagination.totalPages}</span><div className="flex gap-2"><button disabled={pagination.page<=1} onClick={()=>setFilters(f=>({...f,page:(pagination.page||1)-1}))} className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40">Previous</button><button disabled={pagination.page>=pagination.totalPages} onClick={()=>setFilters(f=>({...f,page:(pagination.page||1)+1}))} className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40">Next</button></div></div>}
//   </main></div>;
// };
// export default HomeworkList;


import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import { Icon } from "@iconify/react";

import HomeworkStats from "../../../components/homework/HomeworkStats";
import HomeworkFilters from "../../../components/homework/HomeworkFilters";
import HomeworkTable from "../../../components/homework/HomeworkTable";
import HomeworkCalendar from "../../../components/homework/HomeworkCalendar";
import HomeworkState from "../../../components/homework/HomeworkState";

import {
  deleteHomework,
  getHomeworks,
  getHomeworkStats,
} from "../../../features/homework/homework.slice";

import type {
  HomeworkFilters as HomeworkFiltersType,
} from "../../../features/homework/homework.types";

import { getSessions } from "../../../features/academic/sessions/session.slice";
import { getClasses } from "../../../features/academic/classes/class.slice";
import { getSections } from "../../../features/academic/sections/section.slice";
import { getSubjects } from "../../../features/academic/subjects/subject.slice";
import { getTeachers } from "../../../features/teachers/teacher.slice";


// ======================================================
// TYPES
// ======================================================

type ViewMode =
  | "list"
  | "calendar";


// ======================================================
// COMPONENT
// ======================================================

const HomeworkList = () => {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch<any>();


  // ====================================================
  // LOCAL STATE
  // ====================================================

  const [
    viewMode,
    setViewMode,
  ] =
    useState<ViewMode>(
      "list"
    );


  const [
    filters,
    setFilters,
  ] =
    useState<HomeworkFiltersType>(
      {}
    );


  // ====================================================
  // REDUX STATE
  // ====================================================

  const homeworkState =
    useSelector(
      (state: any) =>
        state.homework
    );


  const sessions =
    useSelector(
      (state: any) =>
        state.sessions
          ?.sessions ?? []
    );


  const classes =
    useSelector(
      (state: any) =>
        state.classes
          ?.classes ?? []
    );


  const sections =
    useSelector(
      (state: any) =>
        state.sections
          ?.sections ?? []
    );


  const subjects =
    useSelector(
      (state: any) =>
        state.subjects
          ?.subjects ?? []
    );


  const teachers =
    useSelector(
      (state: any) =>
        state.teachers
          ?.teachers ?? []
    );


  // ====================================================
  // HOMEWORK STATE
  // ====================================================

  const homeworks =
    homeworkState?.homeworks ??
    [];


  const stats =
    homeworkState?.stats ??
    null;


  const pagination =
    homeworkState?.pagination ??
    null;


  const loading =
    Boolean(
      homeworkState?.loading
    );


  const error =
    homeworkState?.error ??
    null;


  // ====================================================
  // FETCH FILTER OPTIONS
  // ====================================================

  useEffect(() => {
    dispatch(
      getSessions()
    );

    dispatch(
      getClasses()
    );

    dispatch(
      getSections(
        undefined
      )
    );

    dispatch(
      getSubjects(
        undefined
      )
    );

    dispatch(
      getTeachers(
        undefined
      )
    );
  }, [dispatch]);


  // ====================================================
  // FETCH HOMEWORK
  // ====================================================

  useEffect(() => {
    dispatch(
      getHomeworks(
        filters
      )
    );

    dispatch(
      getHomeworkStats()
    );
  }, [
    dispatch,
    filters,
  ]);


  // ====================================================
  // RESET FILTER
  // ====================================================

  const handleReset =
    () => {
      setFilters({});
    };


  // ====================================================
  // PAGINATION
  // ====================================================

  const handlePageChange = (
    page: number
  ) => {
    setFilters(
      (current) => ({
        ...current,
        page,
      })
    );
  };


  // ====================================================
  // VIEW HOMEWORK
  // ====================================================

  const handleView = (
    homeworkId: string
  ) => {
    navigate(
      `/school-admin/homework/${homeworkId}`
    );
  };


  // ====================================================
  // VIEW SUBMISSIONS
  // ====================================================

  const handleSubmissions = (
    homeworkId: string
  ) => {
    navigate(
      `/school-admin/homework/${homeworkId}/submissions`
    );
  };


  // ====================================================
  // DELETE HOMEWORK
  // ====================================================

  const handleDelete =
    async (
      homeworkId: string
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this homework?"
        );


      if (!confirmed) {
        return;
      }


      try {
        await dispatch(
          deleteHomework(
            homeworkId
          )
        ).unwrap();


        // Refresh stats after deletion
        dispatch(
          getHomeworkStats()
        );

      } catch (error) {
        console.error(
          "Failed to delete homework:",
          error
        );
      }
    };


  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1600px]">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">

          <span>
            Academic
          </span>


          <Icon
            icon="lucide:chevron-right"
          />


          <span className="font-medium text-slate-800">
            Homework
          </span>

        </div>


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Homework
            </h1>


            <p className="mt-1 text-sm text-slate-500">
              Create, manage and track
              student homework.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/school-admin/homework/add"
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          >

            <Icon
              icon="lucide:plus"
              className="text-lg"
            />

            Add Homework

          </button>

        </div>


        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mb-6">

          <HomeworkStats
            stats={stats}
          />

        </div>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="mb-6">

          <HomeworkFilters
            filters={filters}
            sessions={sessions}
            classes={classes}
            sections={sections}
            subjects={subjects}
            teachers={teachers}
            onChange={(
              newFilters
            ) =>
              setFilters({
                ...newFilters,
                page: 1,
              })
            }
            onReset={
              handleReset
            }
          />

        </div>


        {/* ==================================================
            MAIN
        ================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">

            <div>

              <h2 className="font-semibold text-slate-900">
                Homework Records
              </h2>


              <p className="mt-0.5 text-xs text-slate-500">

                {pagination?.total ??
                  homeworks.length}{" "}

                homework found

              </p>

            </div>


            {/* ==================================================
                VIEW SWITCH
            ================================================== */}

            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">

              {/* LIST */}

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    "list"
                  )
                }
                className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  viewMode ===
                  "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >

                <Icon
                  icon="lucide:list"
                />

                List

              </button>


              {/* CALENDAR */}

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    "calendar"
                  )
                }
                className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  viewMode ===
                  "calendar"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >

                <Icon
                  icon="lucide:calendar-days"
                />

                Calendar

              </button>

            </div>

          </div>


          {/* ==================================================
              CONTENT
          ================================================== */}

          {loading &&
          homeworks.length ===
            0 ? (

            <HomeworkState
              type="loading"
            />

          ) : error ? (

            <HomeworkState
              type="error"
              message={
                error
              }
            />

          ) : homeworks.length ===
            0 ? (

            <HomeworkState
              type="empty"
              title="No homework found"
              message="Create your first homework or change the selected filters."
            />

          ) : viewMode ===
            "calendar" ? (

            <HomeworkCalendar
              homeworks={
                homeworks
              }
            />

          ) : (

            <>

              {/* ==================================================
                  HOMEWORK TABLE
              ================================================== */}

              <HomeworkTable
                homeworks={
                  homeworks
                }
                onView={
                  handleView
                }
                onSubmissions={
                  handleSubmissions
                }
                onDelete={
                  handleDelete
                }
              />


              {/* ==================================================
                  PAGINATION
              ================================================== */}

              {pagination &&
                pagination.totalPages >
                  1 && (

                  <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row">

                    <p className="text-sm text-slate-500">

                      Page{" "}

                      {
                        pagination.page
                      }{" "}

                      of{" "}

                      {
                        pagination.totalPages
                      }

                    </p>


                    <div className="flex gap-2">

                      {/* PREVIOUS */}

                      <button
                        type="button"
                        disabled={
                          pagination.page <=
                          1
                        }
                        onClick={() =>
                          handlePageChange(
                            pagination.page -
                              1
                          )
                        }
                        className="flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        <Icon
                          icon="lucide:chevron-left"
                        />

                        Previous

                      </button>


                      {/* NEXT */}

                      <button
                        type="button"
                        disabled={
                          pagination.page >=
                          pagination.totalPages
                        }
                        onClick={() =>
                          handlePageChange(
                            pagination.page +
                              1
                          )
                        }
                        className="flex h-9 items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >

                        Next

                        <Icon
                          icon="lucide:chevron-right"
                        />

                      </button>

                    </div>

                  </div>
                )}

            </>

          )}

        </div>

      </div>

    </div>
  );
};


export default HomeworkList;