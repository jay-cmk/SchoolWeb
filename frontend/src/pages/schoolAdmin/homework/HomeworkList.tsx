

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

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
  clearHomeworkState,
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
    useAppDispatch();


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
    useAppSelector(
      (state) =>
        state.homework
    );


  const sessions =
    useAppSelector(
      (state) =>
        state.sessions.sessions
    );


  const classes =
    useAppSelector(
      (state) =>
        state.classes.classes
    );


  const sections =
    useAppSelector(
      (state) =>
        state.sections.sections
    );


  const subjects =
    useAppSelector(
      (state) =>
        state.subjects.subjects
    );


  const teachers =
    useAppSelector(
      (state) =>
        state.teachers.teachers
    );


  const selectedSessionId =
    useAppSelector(
      (state) =>
        state.sessionSelection
          .selectedSessionId
    );


  const selectedSession =
    useMemo(
      () =>
        sessions.find(
          (session) =>
            session._id ===
            selectedSessionId
        ) ?? null,
      [
        sessions,
        selectedSessionId,
      ]
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
    if (sessions.length === 0) {
      dispatch(
        getSessions()
      );
    }

    dispatch(
      getTeachers(
        undefined
      )
    );
  }, [
    dispatch,
    sessions.length,
  ]);


  // ====================================================
  // GLOBAL SESSION CHANGE
  // ====================================================

  useEffect(() => {
    setViewMode(
      "list"
    );

    setFilters(
      selectedSessionId
        ? {
            sessionId:
              selectedSessionId,
          }
        : {}
    );

    dispatch(
      clearHomeworkState()
    );

    if (!selectedSessionId) {
      return;
    }

    dispatch(
      getClasses({
        sessionId:
          selectedSessionId,
      })
    );

    dispatch(
      getSections({
        sessionId:
          selectedSessionId,
      })
    );

    dispatch(
      getSubjects({
        sessionId:
          selectedSessionId,
      })
    );
  }, [
    dispatch,
    selectedSessionId,
  ]);


  const sessionClasses =
    useMemo(
      () =>
        selectedSessionId
          ? classes.filter(
              (item) =>
                item.sessionId ===
                selectedSessionId
            )
          : [],
      [classes, selectedSessionId]
    );


  const sessionSections =
    useMemo(
      () =>
        selectedSessionId
          ? sections.filter(
              (item) =>
                item.sessionId ===
                  selectedSessionId &&
                (
                  !filters.classId ||
                  item.classId ===
                    filters.classId
                )
            )
          : [],
      [
        sections,
        selectedSessionId,
        filters.classId,
      ]
    );


  const sessionSubjects =
    useMemo(
      () =>
        selectedSessionId
          ? subjects.filter(
              (item) =>
                item.sessionId ===
                selectedSessionId
            )
          : [],
      [subjects, selectedSessionId]
    );


  // ====================================================
  // FETCH HOMEWORK
  // ====================================================

  useEffect(() => {
    if (!selectedSessionId) {
      return;
    }

    dispatch(
      getHomeworks(
        {
          ...filters,
          sessionId:
            selectedSessionId,
        }
      )
    );

    dispatch(
      getHomeworkStats()
    );
  }, [
    dispatch,
    filters,
    selectedSessionId,
  ]);


  // ====================================================
  // RESET FILTER
  // ====================================================

  const handleReset =
    () => {
      setFilters(
        selectedSessionId
          ? {
              sessionId:
                selectedSessionId,
            }
          : {}
      );
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

            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              <Icon
                icon="lucide:calendar-days"
              />

              <span className="font-medium">
                {selectedSession
                  ? `Academic Session: ${selectedSession.name}`
                  : "Select an academic session from the Topbar"}
              </span>
            </div>

          </div>


          <button
            type="button"
            disabled={
              !selectedSessionId
            }
            onClick={() =>
              navigate(
                "/school-admin/homework/add"
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            classes={sessionClasses}
            sections={sessionSections}
            subjects={sessionSubjects}
            teachers={teachers}
            onChange={(
              newFilters
            ) =>
              setFilters({
                ...newFilters,
                ...(selectedSessionId
                  ? {
                      sessionId:
                        selectedSessionId,
                    }
                  : {}),
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
              onView={
                handleView
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
