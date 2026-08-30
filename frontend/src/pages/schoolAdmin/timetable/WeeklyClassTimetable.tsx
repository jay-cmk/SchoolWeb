import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { getSessions } from "../../../features/academic/sessions/session.slice";
import { getClasses } from "../../../features/academic/classes/class.slice";
import { getSections } from "../../../features/academic/sections/section.slice";
import { getTeachers } from "../../../features/teachers/teacher.slice";

import {
  clearCopyResult,
  clearTimetableError,
  copyTimetable,
  getTimetable,
} from "../../../features/timetable/timetable.slice";

import {
  TimetableDay,
  TimetablePeriodType,
} from "../../../features/timetable/timetable.types";

import type {
  Timetable,
  CopyTimetableData,
} from "../../../features/timetable/timetable.types";

import AddTimetablePeriod from "../../../components/timetable/AddTimetablePeriod";
import EditTimetablePeriod from "../../../components/timetable/EditTimetablePeriod";
import ConflictWarningModal from "../../../components/timetable/ConflictWarningModal";

const DAYS = [
  TimetableDay.MONDAY,
  TimetableDay.TUESDAY,
  TimetableDay.WEDNESDAY,
  TimetableDay.THURSDAY,
  TimetableDay.FRIDAY,
  TimetableDay.SATURDAY,
] as const;

const DAY_LABEL: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

const getRelationId = (value: unknown): string => {
  if (typeof value === "string") return value;

  if (
    value &&
    typeof value === "object" &&
    "_id" in value
  ) {
    const id = (
      value as {
        _id?: unknown;
      }
    )._id;

    return typeof id === "string"
      ? id
      : String(id ?? "");
  }

  return "";
};

const getRelationName = (
  value: unknown
): string => {
  if (
    !value ||
    typeof value !== "object" ||
    !("name" in value)
  ) {
    return "";
  }

  const name = (
    value as {
      name?: unknown;
    }
  ).name;

  return typeof name === "string"
    ? name
    : "";
};

const formatTime = (
  time: string
): string => {
  if (!time) return "-";

  const [
    hoursText = "0",
    minutes = "00",
  ] = time.split(":");

  const hours =
    Number(hoursText);

  const suffix =
    hours >= 12
      ? "PM"
      : "AM";

  const display =
    hours % 12 || 12;

  return `${String(display).padStart(
    2,
    "0"
  )}:${minutes} ${suffix}`;
};

const currentTimetableDay =
  (): string => {
    const jsDay =
      new Date().getDay();

    const map:
      Record<number, string> = {
      1: TimetableDay.MONDAY,
      2: TimetableDay.TUESDAY,
      3: TimetableDay.WEDNESDAY,
      4: TimetableDay.THURSDAY,
      5: TimetableDay.FRIDAY,
      6: TimetableDay.SATURDAY,
    };

    return map[jsDay] ?? "";
  };

type Slot = {
  periodNumber: number;
  startTime: string;
  endTime: string;
};

type AddContext = {
  day?: string;
  periodNumber?: number;
  startTime?: string;
  endTime?: string;
};

const WeeklyClassTimetable:
  React.FC = () => {

  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const {
    timetable,
    loading,
    error,
    copyResult,
  } = useAppSelector(
    (state) =>
      state.timetable
  );

  const {
    sessions,
  } = useAppSelector(
    (state) =>
      state.sessions
  );

  const {
    classes,
  } = useAppSelector(
    (state) =>
      state.classes
  );

  const {
    sections,
  } = useAppSelector(
    (state) =>
      state.sections
  );

  const {
    teachers,
  } = useAppSelector(
    (state) =>
      state.teachers
  );

  const [
    sessionId,
    setSessionId,
  ] = useState(
    searchParams.get(
      "sessionId"
    ) || ""
  );

  const [
    classId,
    setClassId,
  ] = useState(
    searchParams.get(
      "classId"
    ) || ""
  );

  const [
    sectionId,
    setSectionId,
  ] = useState(
    searchParams.get(
      "sectionId"
    ) || ""
  );

  const [
    teacherId,
    setTeacherId,
  ] = useState(
    searchParams.get(
      "teacherId"
    ) || ""
  );

  const [
    isAddOpen,
    setIsAddOpen,
  ] = useState(false);

  const [
    addContext,
    setAddContext,
  ] = useState<AddContext>(
    {}
  );

  const [
    selectedPeriodId,
    setSelectedPeriodId,
  ] = useState<
    string | null
  >(null);

  const [
    conflictMessage,
    setConflictMessage,
  ] = useState<
    string | null
  >(null);

  const [
    copyOpen,
    setCopyOpen,
  ] = useState(false);

  const [
    targetClassId,
    setTargetClassId,
  ] = useState("");

  const [
    targetSectionId,
    setTargetSectionId,
  ] = useState("");

  useEffect(() => {
    dispatch(
      getSessions()
    );

    dispatch(
      getClasses(
        undefined
      )
    );

    dispatch(
      getSections(
        undefined
      )
    );

    dispatch(
      getTeachers()
    );
  }, [
    dispatch,
  ]);

  useEffect(() => {
    if (
      sessionId ||
      sessions.length === 0
    ) {
      return;
    }

    const current =
      sessions.find(
        (item) =>
          item.isCurrent
      );

    setSessionId(
      current?._id ||
        sessions[0]?._id ||
        ""
    );
  }, [
    sessions,
    sessionId,
  ]);

  const availableClasses =
    useMemo(() => {
      if (!sessionId) {
        return [];
      }

      return classes.filter(
        (item) =>
          getRelationId(
            item.sessionId
          ) === sessionId
      );
    }, [
      classes,
      sessionId,
    ]);

  const availableSections =
    useMemo(() => {
      if (
        !sessionId ||
        !classId
      ) {
        return [];
      }

      return sections.filter(
        (item) =>
          getRelationId(
            item.sessionId
          ) ===
            sessionId &&
          getRelationId(
            item.classId
          ) ===
            classId &&
          item.isActive !== false
      );
    }, [
      sections,
      sessionId,
      classId,
    ]);

  const targetSections =
    useMemo(() => {
      if (
        !sessionId ||
        !targetClassId
      ) {
        return [];
      }

      return sections.filter(
        (item) =>
          getRelationId(
            item.sessionId
          ) ===
            sessionId &&
          getRelationId(
            item.classId
          ) ===
            targetClassId &&
          item.isActive !== false
      );
    }, [
      sections,
      sessionId,
      targetClassId,
    ]);

  useEffect(() => {
    const params =
      new URLSearchParams();

    if (sessionId) {
      params.set(
        "sessionId",
        sessionId
      );
    }

    if (classId) {
      params.set(
        "classId",
        classId
      );
    }

    if (sectionId) {
      params.set(
        "sectionId",
        sectionId
      );
    }

    if (teacherId) {
      params.set(
        "teacherId",
        teacherId
      );
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  }, [
    sessionId,
    classId,
    sectionId,
    teacherId,
    setSearchParams,
  ]);

  const fetchTimetable =
    () => {
      if (
        !sessionId ||
        !classId ||
        !sectionId
      ) {
        return;
      }

      const filters: {
        sessionId: string;
        classId: string;
        sectionId: string;
        teacherId?: string;
        isActive: boolean;
      } = {
        sessionId,
        classId,
        sectionId,
        isActive: true,
      };

      if (teacherId) {
        filters.teacherId =
          teacherId;
      }

      dispatch(
        getTimetable(
          filters
        )
      );
    };

  useEffect(() => {
    fetchTimetable();
  }, [
    dispatch,
    sessionId,
    classId,
    sectionId,
    teacherId,
  ]);

  const selectedSession =
    sessions.find(
      (item) =>
        item._id ===
        sessionId
    );

  const selectedClass =
    availableClasses.find(
      (item) =>
        item._id ===
        classId
    );

  const selectedSection =
    availableSections.find(
      (item) =>
        item._id ===
        sectionId
    );

  const slots =
    useMemo<
      Slot[]
    >(() => {
      const map =
        new Map<
          number,
          Slot
        >();

      timetable.forEach(
        (item) => {
          const existing =
            map.get(
              item.periodNumber
            );

          if (
            !existing ||
            item.startTime <
              existing.startTime
          ) {
            map.set(
              item.periodNumber,
              {
                periodNumber:
                  item.periodNumber,
                startTime:
                  item.startTime,
                endTime:
                  item.endTime,
              }
            );
          }
        }
      );

      return [
        ...map.values(),
      ].sort(
        (a, b) =>
          a.periodNumber -
          b.periodNumber
      );
    }, [
      timetable,
    ]);

  const findPeriod =
    (
      day: string,
      periodNumber: number
    ):
      | Timetable
      | undefined =>
      timetable.find(
        (item) =>
          item.day ===
            day &&
          item.periodNumber ===
            periodNumber
      );

  const todayPeriods =
    useMemo(() => {
      const day =
        currentTimetableDay();

      if (!day) {
        return 0;
      }

      return timetable.filter(
        (item) =>
          item.day === day
      ).length;
    }, [
      timetable,
    ]);

  const totalActiveClasses =
    useMemo(
      () =>
        new Set(
          timetable
            .map(
              (item) =>
                getRelationId(
                  item.classId
                )
            )
            .filter(
              Boolean
            )
        ).size,
      [
        timetable,
      ]
    );

  const totalActiveSections =
    useMemo(
      () =>
        new Set(
          timetable
            .map(
              (item) =>
                getRelationId(
                  item.sectionId
                )
            )
            .filter(
              Boolean
            )
        ).size,
      [
        timetable,
      ]
    );

  const unassignedPeriods =
    useMemo(
      () =>
        timetable.filter(
          (item) =>
            item.periodType ===
              TimetablePeriodType.REGULAR &&
            (
              !item.subjectId ||
              !item.teacherId
            )
        ).length,
      [
        timetable,
      ]
    );

  const openAdd =
    (
      context:
        AddContext = {}
    ) => {
      setAddContext(
        context
      );

      setIsAddOpen(
        true
      );
    };

  const handleAddSuccess =
    () => {
      setIsAddOpen(
        false
      );

      fetchTimetable();
    };

  const handleEditSuccess =
    () => {
      setSelectedPeriodId(
        null
      );

      fetchTimetable();
    };

  const handleCopy =
    async () => {
      if (
        !sessionId ||
        !classId ||
        !sectionId ||
        !targetClassId ||
        !targetSectionId
      ) {
        return;
      }

      const payload:
        CopyTimetableData = {
        sessionId,
        sourceClassId:
          classId,
        sourceSectionId:
          sectionId,
        targetClassId,
        targetSectionId,
      };

      const result =
        await dispatch(
          copyTimetable(
            payload
          )
        );

      if (
        copyTimetable.fulfilled.match(
          result
        )
      ) {
        setCopyOpen(
          false
        );

        if (
          result.payload
            .conflicts.length >
          0
        ) {
          setConflictMessage(
            result.payload
              .conflicts.join(
                "\n"
              )
          );
        }
      }
    };

  const periodCardClass =
    (
      type: string
    ) => {
      if (
        type ===
          TimetablePeriodType.BREAK ||
        type ===
          TimetablePeriodType.LUNCH
      ) {
        return "border-sky-200 bg-sky-50";
      }

      if (
        type ===
        TimetablePeriodType.ACTIVITY
      ) {
        return "border-teal-200 bg-teal-50";
      }

      return "border-blue-100 bg-blue-50";
    };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">

      <div className="mx-auto max-w-[1600px] space-y-5">

        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

          <div>

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <span>
                Academics
              </span>

              <Icon
                icon="lucide:chevron-right"
              />

              <span className="font-medium text-gray-900">
                Timetable
              </span>

            </div>


            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Timetable
            </h1>


            <p className="mt-1 text-sm text-gray-500">
              Create and manage class, section and teacher schedules.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              openAdd()
            }
            disabled={
              !sessionId ||
              !classId ||
              !sectionId
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon
              icon="lucide:plus"
            />

            Create Timetable
          </button>

        </div>


        {/* STATS */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Total Classes"
            value={
              totalActiveClasses
            }
            icon="lucide:graduation-cap"
            helper="Classes in current result"
          />

          <StatCard
            label="Total Sections"
            value={
              totalActiveSections
            }
            icon="lucide:layers"
            helper="Sections in current result"
          />

          <StatCard
            label="Today's Periods"
            value={
              todayPeriods
            }
            icon="lucide:calendar-days"
            helper="Scheduled for today"
          />

          <StatCard
            label="Unassigned Periods"
            value={
              unassignedPeriods
            }
            icon="lucide:circle-alert"
            helper="Require subject/teacher"
          />

        </section>


        {/* FILTERS */}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="mb-4">

            <h2 className="font-bold text-gray-900">
              Schedule filters
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Academic Session → Class → Section controls timetable context.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <SelectField
              label="Academic Year"
              value={
                sessionId
              }
              required
              onChange={(
                value
              ) => {
                setSessionId(
                  value
                );

                setClassId(
                  ""
                );

                setSectionId(
                  ""
                );
              }}
              options={
                sessions.map(
                  (item) => ({
                    value:
                      item._id,

                    label:
                      `${item.name}${
                        item.isCurrent
                          ? " (Current)"
                          : ""
                      }`,
                  })
                )
              }
            />


            <SelectField
              label="Class"
              value={
                classId
              }
              required
              disabled={
                !sessionId
              }
              onChange={(
                value
              ) => {
                setClassId(
                  value
                );

                setSectionId(
                  ""
                );
              }}
              options={
                availableClasses.map(
                  (item) => ({
                    value:
                      item._id,

                    label:
                      item.name,
                  })
                )
              }
            />


            <SelectField
              label="Section"
              value={
                sectionId
              }
              required
              disabled={
                !classId
              }
              onChange={
                setSectionId
              }
              options={
                availableSections.map(
                  (item) => ({
                    value:
                      item._id,

                    label:
                      `Section ${item.name}`,
                  })
                )
              }
            />


            <SelectField
              label="Teacher (optional)"
              value={
                teacherId
              }
              onChange={
                setTeacherId
              }
              placeholder="All teachers"
              options={
                teachers.map(
                  (item) => ({
                    value:
                      item._id,

                    label:
                      `${item.name}${
                        item.employeeId
                          ? ` — ${item.employeeId}`
                          : ""
                      }`,
                  })
                )
              }
            />

          </div>

        </section>


        {/* ERROR */}

        {error && (
          <div className="flex items-start justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <div className="flex gap-2">

              <Icon
                icon="lucide:triangle-alert"
                className="mt-0.5 text-lg"
              />

              <span>
                {error}
              </span>

            </div>


            <button
              type="button"
              onClick={() =>
                dispatch(
                  clearTimetableError()
                )
              }
            >
              <Icon
                icon="lucide:x"
              />
            </button>

          </div>
        )}


        {/* COPY RESULT */}

        {copyResult && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">

            <div className="flex items-center justify-between gap-3">

              <p className="font-semibold">
                Copy completed:{" "}
                {copyResult.copied} copied,{" "}
                {copyResult.skipped} skipped.
              </p>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    clearCopyResult()
                  )
                }
              >
                <Icon
                  icon="lucide:x"
                />
              </button>

            </div>

          </div>
        )}


        {/* TIMETABLE */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-950">

                {selectedClass?.name ||
                  "Select Class"}

                {" · Section "}

                {selectedSection?.name ||
                  "-"}

              </h2>


              <p className="mt-1 text-sm text-gray-500">

                {selectedSession?.name ||
                  "Academic Year"}

                {" · Weekly schedule"}

              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <ActionButton
                icon="lucide:calendar-days"
                label="Daily View"
                onClick={() => {

                  const params =
                    new URLSearchParams();

                  if (
                    sessionId
                  ) {
                    params.set(
                      "sessionId",
                      sessionId
                    );
                  }

                  if (
                    classId
                  ) {
                    params.set(
                      "classId",
                      classId
                    );
                  }

                  if (
                    sectionId
                  ) {
                    params.set(
                      "sectionId",
                      sectionId
                    );
                  }

                  navigate(
                    `/school-admin/timetable/daily?${params.toString()}`
                  );
                }}
              />


              <ActionButton
                icon="lucide:user-round"
                label="Teacher Timetable"
                onClick={() =>
                  navigate(
                    "/school-admin/timetable/teacher"
                  )
                }
              />


              <ActionButton
                icon="lucide:copy"
                label="Copy Timetable"
                disabled={
                  !sectionId
                }
                onClick={() =>
                  setCopyOpen(
                    true
                  )
                }
              />


              <ActionButton
                icon="lucide:printer"
                label=""
                onClick={() =>
                  window.print()
                }
              />

            </div>

          </div>


          {!sessionId ||
          !classId ||
          !sectionId ? (

            <EmptyState
              icon="lucide:calendar-plus"
              title="Select timetable context"
              description="Select academic year, class and section to load its weekly timetable."
            />

          ) : loading ? (

            <LoadingState />

          ) : timetable.length ===
            0 ? (

            <EmptyState
              icon="lucide:calendar-clock"
              title="No timetable created yet"
              description="Create the first period to start building this class timetable."
              actionLabel="Add Period"
              onAction={() =>
                openAdd()
              }
            />

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1180px] table-fixed text-sm">

                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">

                  <tr>

                    <th className="w-36 px-4 py-3 text-left">
                      Time / Period
                    </th>


                    {DAYS.map(
                      (day) => (
                        <th
                          key={
                            day
                          }
                          className="px-2 py-3 text-left"
                        >
                          {
                            DAY_LABEL[
                              day
                            ]
                          }
                        </th>
                      )
                    )}

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-200">

                  {slots.map(
                    (slot) => (

                      <tr
                        key={
                          slot.periodNumber
                        }
                        className="align-top"
                      >

                        <td className="bg-gray-50/60 px-4 py-3">

                          <p className="font-semibold text-gray-900">
                            Period{" "}
                            {
                              slot.periodNumber
                            }
                          </p>


                          <p className="mt-1 text-xs text-gray-500">

                            {formatTime(
                              slot.startTime
                            )}

                            {" – "}

                            {formatTime(
                              slot.endTime
                            )}

                          </p>

                        </td>


                        {DAYS.map(
                          (day) => {

                            const period =
                              findPeriod(
                                day,
                                slot.periodNumber
                              );


                            if (
                              !period
                            ) {
                              return (
                                <td
                                  key={
                                    day
                                  }
                                  className="p-2"
                                >

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openAdd({
                                        day,

                                        periodNumber:
                                          slot.periodNumber,

                                        startTime:
                                          slot.startTime,

                                        endTime:
                                          slot.endTime,
                                      })
                                    }
                                    className="flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-xs font-semibold text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                                  >
                                    + Add period
                                  </button>

                                </td>
                              );
                            }


                            return (
                              <td
                                key={
                                  day
                                }
                                className="p-2"
                              >

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedPeriodId(
                                      period._id
                                    )
                                  }
                                  className={`min-h-24 w-full rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${periodCardClass(
                                    period.periodType
                                  )}`}
                                >

                                  <p className="font-bold text-gray-900">

                                    {getRelationName(
                                      period.subjectId
                                    ) ||
                                      (
                                        period.periodType ===
                                        TimetablePeriodType.BREAK
                                          ? "Break"
                                          : period.periodType ===
                                              TimetablePeriodType.LUNCH
                                            ? "Lunch"
                                            : "Activity"
                                      )}

                                  </p>


                                  <p className="mt-1 text-xs text-gray-600">
                                    {getRelationName(
                                      period.teacherId
                                    ) ||
                                      "No teacher"}
                                  </p>


                                  <p className="mt-1 text-xs text-gray-500">
                                    {period.roomNumber ||
                                      "No room"}
                                  </p>

                                </button>

                              </td>
                            );
                          }
                        )}

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>


      {/* ADD MODAL */}

      {isAddOpen && (
        <AddTimetablePeriod
          sessionId={
            sessionId
          }
          classId={
            classId
          }
          sectionId={
            sectionId
          }
          day={
            addContext.day
          }
          periodNumber={
            addContext.periodNumber
          }
          startTime={
            addContext.startTime
          }
          endTime={
            addContext.endTime
          }
          onClose={() =>
            setIsAddOpen(
              false
            )
          }
          onSuccess={
            handleAddSuccess
          }
          onConflict={
            setConflictMessage
          }
        />
      )}


      {/* EDIT MODAL */}

      {selectedPeriodId && (
        <EditTimetablePeriod
          timetableId={
            selectedPeriodId
          }
          onClose={() =>
            setSelectedPeriodId(
              null
            )
          }
          onSuccess={
            handleEditSuccess
          }
          onConflict={
            setConflictMessage
          }
        />
      )}


      {/* CONFLICT MODAL */}

      {conflictMessage && (
        <ConflictWarningModal
          message={
            conflictMessage
          }
          onClose={() =>
            setConflictMessage(
              null
            )
          }
        />
      )}


      {/* COPY MODAL */}

      {copyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setCopyOpen(
                false
              );
            }
          }}
        >

          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-gray-200 p-5">

              <div>

                <h2 className="text-xl font-bold text-gray-950">
                  Copy timetable
                </h2>


                <p className="mt-1 text-sm text-gray-500">
                  Existing target conflicts will be skipped and reported.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setCopyOpen(
                    false
                  )
                }
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <Icon
                  icon="lucide:x"
                />
              </button>

            </div>


            <div className="space-y-4 p-5">

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">

                Source:{" "}

                <strong>
                  {selectedClass?.name ||
                    "-"}
                </strong>

                {" · Section "}

                <strong>
                  {selectedSection?.name ||
                    "-"}
                </strong>

              </div>


              <SelectField
                label="Target Class"
                value={
                  targetClassId
                }
                required
                onChange={(
                  value
                ) => {
                  setTargetClassId(
                    value
                  );

                  setTargetSectionId(
                    ""
                  );
                }}
                options={
                  availableClasses.map(
                    (item) => ({
                      value:
                        item._id,

                      label:
                        item.name,
                    })
                  )
                }
              />


              <SelectField
                label="Target Section"
                value={
                  targetSectionId
                }
                required
                disabled={
                  !targetClassId
                }
                onChange={
                  setTargetSectionId
                }
                options={
                  targetSections.map(
                    (item) => ({
                      value:
                        item._id,

                      label:
                        `Section ${item.name}`,
                    })
                  )
                }
              />

            </div>


            <div className="flex justify-end gap-3 border-t border-gray-200 p-5">

              <button
                type="button"
                onClick={() =>
                  setCopyOpen(
                    false
                  )
                }
                className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleCopy
                }
                disabled={
                  loading ||
                  !targetSectionId
                }
                className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Copying..."
                  : "Copy Timetable"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};


// ============================================
// HELPERS
// ============================================

const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = "Select",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) => (
  <label className="block text-sm font-medium text-gray-700">

    {label}

    {required && (
      <span className="text-red-500">
        {" "}*
      </span>
    )}


    <select
      value={
        value
      }
      disabled={
        disabled
      }
      onChange={(
        event
      ) =>
        onChange(
          event.target.value
        )
      }
      className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
    >

      <option value="">
        {placeholder}
      </option>


      {options.map(
        (item) => (
          <option
            key={
              item.value
            }
            value={
              item.value
            }
          >
            {item.label}
          </option>
        )
      )}

    </select>

  </label>
);


const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={
      onClick
    }
    disabled={
      disabled
    }
    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
  >

    <Icon
      icon={
        icon
      }
    />

    {label}

  </button>
);


const StatCard = ({
  label,
  value,
  icon,
  helper,
}: {
  label: string;
  value: number;
  icon: string;
  helper: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

    <div className="flex items-center justify-between">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
        <Icon
          icon={
            icon
          }
          className="text-xl"
        />
      </div>

    </div>


    <p className="mt-4 text-2xl font-bold text-gray-950">
      {value}
    </p>


    <p className="mt-1 text-xs text-gray-500">
      {helper}
    </p>

  </div>
);


const LoadingState = () => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3">

    <Icon
      icon="lucide:loader-2"
      className="animate-spin text-4xl text-blue-600"
    />

    <p className="text-sm text-gray-500">
      Loading timetable...
    </p>

  </div>
);


const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">

    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

      <Icon
        icon={
          icon
        }
        className="text-2xl text-gray-400"
      />

    </div>


    <h3 className="mt-4 text-lg font-bold text-gray-950">
      {title}
    </h3>


    <p className="mt-1 max-w-lg text-sm text-gray-500">
      {description}
    </p>


    {actionLabel &&
      onAction && (
        <button
          type="button"
          onClick={
            onAction
          }
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Icon
            icon="lucide:plus"
          />

          {actionLabel}
        </button>
      )}

  </div>
);


export default WeeklyClassTimetable;
