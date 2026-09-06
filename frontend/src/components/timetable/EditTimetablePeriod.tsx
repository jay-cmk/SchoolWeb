import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import {
  getSubjectAssignments,
} from "../../features/academic/subjectAssignments/subjectAssignment.slice";

import {
  clearSelectedTimetable,
  clearTimetableError,
  deleteTimetable,
  getTimetableById,
  updateTimetable,
} from "../../features/timetable/timetable.slice";

import {
  TimetableDay,
  TimetablePeriodType,
} from "../../features/timetable/timetable.types";

import type {
  TimetableDay as TimetableDayType,
  TimetablePeriodType as TimetablePeriodTypeType,
  UpdateTimetableData,
} from "../../features/timetable/timetable.types";

interface EditTimetablePeriodProps {
  timetableId: string;
  onClose: () => void;
  onSuccess: () => void;
  onConflict: (
    message: string
  ) => void;
}

const DAY_OPTIONS = [
  [TimetableDay.MONDAY, "Monday"],
  [TimetableDay.TUESDAY, "Tuesday"],
  [TimetableDay.WEDNESDAY, "Wednesday"],
  [TimetableDay.THURSDAY, "Thursday"],
  [TimetableDay.FRIDAY, "Friday"],
  [TimetableDay.SATURDAY, "Saturday"],
] as const;

const getRelationId = (
  value: unknown
): string => {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    value &&
    typeof value ===
      "object" &&
    "_id" in value
  ) {
    const id =
      (
        value as {
          _id?: unknown;
        }
      )._id;

    return typeof id ===
      "string"
      ? id
      : String(
          id ?? ""
        );
  }

  return "";
};

const getRelationName = (
  value: unknown
): string => {
  if (
    !value ||
    typeof value !==
      "object" ||
    !("name" in value)
  ) {
    return "";
  }

  const name =
    (
      value as {
        name?: unknown;
      }
    ).name;

  return typeof name ===
    "string"
      ? name
      : "";
};

const EditTimetablePeriod:
  React.FC<
    EditTimetablePeriodProps
  > = ({
    timetableId,
    onClose,
    onSuccess,
    onConflict,
  }) => {

  const dispatch =
    useAppDispatch();

  const {
    selectedTimetable,
    loading,
    error,
  } = useAppSelector(
    (state) =>
      state.timetable
  );

  const {
    assignments,
  } = useAppSelector(
    (state) =>
      state.subjectAssignments
  );

  const [
    day,
    setDay,
  ] = useState<
    TimetableDayType
  >(
    TimetableDay.MONDAY
  );

  const [
    periodNumber,
    setPeriodNumber,
  ] = useState(1);

  const [
    startTime,
    setStartTime,
  ] = useState(
    "08:00"
  );

  const [
    endTime,
    setEndTime,
  ] = useState(
    "08:45"
  );

  const [
    periodType,
    setPeriodType,
  ] = useState<
    TimetablePeriodTypeType
  >(
    TimetablePeriodType.REGULAR
  );

  const [
    subjectId,
    setSubjectId,
  ] = useState("");

  const [
    teacherId,
    setTeacherId,
  ] = useState("");

  const [
    roomNumber,
    setRoomNumber,
  ] = useState("");

  const [
    confirmDelete,
    setConfirmDelete,
  ] = useState(false);

  useEffect(() => {
    dispatch(
      getTimetableById(
        timetableId
      )
    );

    return () => {
      dispatch(
        clearSelectedTimetable()
      );

      dispatch(
        clearTimetableError()
      );
    };
  }, [
    dispatch,
    timetableId,
  ]);

  useEffect(() => {
    if (
      !selectedTimetable
    ) {
      return;
    }

    setDay(
      selectedTimetable.day
    );

    setPeriodNumber(
      selectedTimetable.periodNumber
    );

    setStartTime(
      selectedTimetable.startTime
    );

    setEndTime(
      selectedTimetable.endTime
    );

    setPeriodType(
      selectedTimetable.periodType
    );

    setSubjectId(
      getRelationId(
        selectedTimetable.subjectId
      )
    );

    setTeacherId(
      getRelationId(
        selectedTimetable.teacherId
      )
    );

    setRoomNumber(
      selectedTimetable.roomNumber ||
        ""
    );

    const sessionId =
      getRelationId(
        selectedTimetable.sessionId
      );

    const classId =
      getRelationId(
        selectedTimetable.classId
      );

    const sectionId =
      getRelationId(
        selectedTimetable.sectionId
      );

    if (
      sessionId &&
      classId &&
      sectionId
    ) {
      dispatch(
        getSubjectAssignments({
          sessionId,
          classId,
          sectionId,
          isActive: true,
        })
      );
    }
  }, [
    dispatch,
    selectedTimetable,
  ]);

  const subjectOptions =
    useMemo(() => {
      const map =
        new Map<
          string,
          string
        >();

      assignments.forEach(
        (item) => {
          const id =
            getRelationId(
              item.subjectId
            );

          if (id) {
            map.set(
              id,
              getRelationName(
                item.subjectId
              ) ||
                "Subject"
            );
          }
        }
      );

      return [
        ...map.entries(),
      ].map(
        ([
          value,
          label,
        ]) => ({
          value,
          label,
        })
      );
    }, [
      assignments,
    ]);

  const teacherOptions =
    useMemo(() => {
      const map =
        new Map<
          string,
          string
        >();

      assignments
        .filter(
          (item) =>
            !subjectId ||
            getRelationId(
              item.subjectId
            ) === subjectId
        )
        .forEach(
          (item) => {
            const id =
              getRelationId(
                item.teacherId
              );

            if (id) {
              map.set(
                id,
                getRelationName(
                  item.teacherId
                ) ||
                  "Teacher"
              );
            }
          }
        );

      return [
        ...map.entries(),
      ].map(
        ([
          value,
          label,
        ]) => ({
          value,
          label,
        })
      );
    }, [
      assignments,
      subjectId,
    ]);

  const isBreakLike =
    periodType ===
      TimetablePeriodType.BREAK ||
    periodType ===
      TimetablePeriodType.LUNCH;

  const isRegular =
    periodType ===
    TimetablePeriodType.REGULAR;

  useEffect(() => {
    if (
      isBreakLike
    ) {
      setSubjectId(
        ""
      );

      setTeacherId(
        ""
      );
    }
  }, [
    isBreakLike,
  ]);

  const handleSave =
    async () => {
      const data:
        UpdateTimetableData = {
        day,
        periodNumber,
        startTime,
        endTime,
        periodType,
      };

      if (
        isBreakLike
      ) {
        data.subjectId =
          null;

        data.teacherId =
          null;
      } else {
        data.subjectId =
          subjectId ||
          null;

        data.teacherId =
          teacherId ||
          null;
      }

      data.roomNumber =
        roomNumber.trim()
          ? roomNumber.trim()
          : null;

      const result =
        await dispatch(
          updateTimetable({
            timetableId,
            data,
          })
        );

      if (
        updateTimetable.fulfilled.match(
          result
        )
      ) {
        onSuccess();

        return;
      }

      if (
        updateTimetable.rejected.match(
          result
        ) &&
        typeof result.payload ===
          "string"
      ) {
        const lower =
          result.payload.toLowerCase();

        if (
          lower.includes(
            "conflict"
          ) ||
          lower.includes(
            "already assigned"
          ) ||
          lower.includes(
            "already exists"
          ) ||
          lower.includes(
            "already booked"
          ) ||
          lower.includes(
            "weekly period limit"
          )
        ) {
          onConflict(
            result.payload
          );
        }
      }
    };

  const handleDelete =
    async () => {
      const result =
        await dispatch(
          deleteTimetable(
            timetableId
          )
        );

      if (
        deleteTimetable.fulfilled.match(
          result
        )
      ) {
        onSuccess();
      }
    };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {!selectedTimetable &&
        loading ? (

          <div className="flex min-h-72 items-center justify-center">

            <Icon
              icon="lucide:loader-2"
              className="animate-spin text-4xl text-blue-600"
            />

          </div>

        ) : !selectedTimetable ? (

          <div className="p-8 text-center">

            <Icon
              icon="lucide:calendar-x"
              className="mx-auto text-4xl text-gray-400"
            />

            <h2 className="mt-3 text-lg font-bold text-gray-950">
              Timetable period not found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {error ||
                "Unable to load timetable period."}
            </p>

            <button
              type="button"
              onClick={
                onClose
              }
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Close
            </button>

          </div>

        ) : (

          <>
            <div className="flex items-start justify-between border-b border-gray-200 p-6">

              <div>

                <div className="flex items-center gap-2 text-sm text-gray-500">

                  <span>
                    Timetable
                  </span>

                  <Icon
                    icon="lucide:chevron-right"
                  />

                  <span>
                    Period details
                  </span>

                </div>


                <h2 className="mt-2 text-2xl font-bold text-gray-950">
                  Edit Timetable Period
                </h2>


                <p className="mt-1 text-sm text-gray-500">

                  {day.charAt(
                    0
                  ) +
                    day
                      .slice(
                        1
                      )
                      .toLowerCase()}

                  {" · Period "}

                  {periodNumber}

                  {" · "}

                  {getRelationName(
                    selectedTimetable.classId
                  )}

                  {" · Section "}

                  {getRelationName(
                    selectedTimetable.sectionId
                  )}

                </p>

              </div>


              <button
                type="button"
                onClick={
                  onClose
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <Icon
                  icon="lucide:x"
                />
              </button>

            </div>


            <div className="space-y-5 p-6">

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}


              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <SelectField
                  label="Day"
                  value={
                    day
                  }
                  onChange={(
                    value
                  ) =>
                    setDay(
                      value as
                        TimetableDayType
                    )
                  }
                  options={
                    DAY_OPTIONS.map(
                      ([
                        value,
                        label,
                      ]) => ({
                        value,
                        label,
                      })
                    )
                  }
                />


                <label className="text-sm font-medium text-gray-700">

                  Period Number


                  <input
                    type="number"
                    min={
                      1
                    }
                    value={
                      periodNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setPeriodNumber(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </label>


                <SelectField
                  label="Subject"
                  value={
                    subjectId
                  }
                  disabled={
                    isBreakLike
                  }
                  placeholder={
                    isBreakLike
                      ? "Not required"
                      : "Select subject"
                  }
                  onChange={(
                    value
                  ) => {
                    setSubjectId(
                      value
                    );

                    setTeacherId(
                      ""
                    );
                  }}
                  options={
                    subjectOptions
                  }
                />


                <SelectField
                  label="Teacher"
                  value={
                    teacherId
                  }
                  disabled={
                    isBreakLike ||
                    (
                      isRegular &&
                      !subjectId
                    )
                  }
                  placeholder={
                    isBreakLike
                      ? "Not required"
                      : "Select teacher"
                  }
                  onChange={
                    setTeacherId
                  }
                  options={
                    teacherOptions
                  }
                />


                <InputField
                  label="Start Time"
                  type="time"
                  value={
                    startTime
                  }
                  onChange={
                    setStartTime
                  }
                />


                <InputField
                  label="End Time"
                  type="time"
                  value={
                    endTime
                  }
                  onChange={
                    setEndTime
                  }
                />


                <InputField
                  label="Room Number"
                  value={
                    roomNumber
                  }
                  onChange={
                    setRoomNumber
                  }
                />


                <SelectField
                  label="Period Type"
                  value={
                    periodType
                  }
                  onChange={(
                    value
                  ) =>
                    setPeriodType(
                      value as
                        TimetablePeriodTypeType
                    )
                  }
                  options={[
                    {
                      value:
                        TimetablePeriodType.REGULAR,
                      label:
                        "Regular",
                    },
                    {
                      value:
                        TimetablePeriodType.BREAK,
                      label:
                        "Break",
                    },
                    {
                      value:
                        TimetablePeriodType.LUNCH,
                      label:
                        "Lunch",
                    },
                    {
                      value:
                        TimetablePeriodType.ACTIVITY,
                      label:
                        "Activity",
                    },
                  ]}
                />

              </div>


              <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="text-sm font-bold text-gray-950">
                      Remove this timetable period?
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      This permanently removes the selected period.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      setConfirmDelete(
                        true
                      )
                    }
                    disabled={
                      loading
                    }
                    className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Remove Period
                  </button>

                </div>

              </div>

            </div>


            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">

              <button
                type="button"
                onClick={
                  onClose
                }
                disabled={
                  loading
                }
                className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Close
              </button>


              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  loading ||
                  (
                    isRegular &&
                    (
                      !subjectId ||
                      !teacherId
                    )
                  )
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >

                {loading && (
                  <Icon
                    icon="lucide:loader-2"
                    className="animate-spin"
                  />
                )}

                Save Changes

              </button>

            </div>
          </>
        )}

      </div>


      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">

              <Icon
                icon="lucide:trash-2"
                className="text-xl"
              />

            </div>


            <h3 className="mt-4 text-xl font-bold text-gray-950">
              Remove period?
            </h3>


            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone.
            </p>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setConfirmDelete(
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
                  handleDelete
                }
                disabled={
                  loading
                }
                className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading
                  ? "Removing..."
                  : "Remove Period"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};


const SelectField = ({
  label,
  value,
  onChange,
  options,
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
  disabled?: boolean;
  placeholder?: string;
}) => (
  <label className="text-sm font-medium text-gray-700">

    {label}


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
      className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
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


const InputField = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) => (
  <label className="text-sm font-medium text-gray-700">

    {label}


    <input
      type={
        type
      }
      value={
        value
      }
      onChange={(
        event
      ) =>
        onChange(
          event.target.value
        )
      }
      className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

  </label>
);


export default EditTimetablePeriod;
