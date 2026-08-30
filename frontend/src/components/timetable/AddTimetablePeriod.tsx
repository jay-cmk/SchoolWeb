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
  clearTimetableError,
  createTimetable,
} from "../../features/timetable/timetable.slice";

import {
  TimetableDay,
  TimetablePeriodType,
} from "../../features/timetable/timetable.types";

import type {
  CreateTimetableData,
  TimetableDay as TimetableDayType,
  TimetablePeriodType as TimetablePeriodTypeType,
} from "../../features/timetable/timetable.types";

interface AddTimetablePeriodProps {
  sessionId: string;
  classId: string;
  sectionId: string;

  day?: string;
  periodNumber?: number;
  startTime?: string;
  endTime?: string;

  onClose: () => void;
  onSuccess: () => void;
  onConflict: (
    message: string
  ) => void;
}

const DAY_OPTIONS = [
  [
    TimetableDay.MONDAY,
    "Monday",
  ],
  [
    TimetableDay.TUESDAY,
    "Tuesday",
  ],
  [
    TimetableDay.WEDNESDAY,
    "Wednesday",
  ],
  [
    TimetableDay.THURSDAY,
    "Thursday",
  ],
  [
    TimetableDay.FRIDAY,
    "Friday",
  ],
  [
    TimetableDay.SATURDAY,
    "Saturday",
  ],
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

const AddTimetablePeriod:
  React.FC<
    AddTimetablePeriodProps
  > = ({
    sessionId,
    classId,
    sectionId,
    day: initialDay,
    periodNumber:
      initialPeriodNumber,
    startTime:
      initialStartTime,
    endTime:
      initialEndTime,
    onClose,
    onSuccess,
    onConflict,
  }) => {

  const dispatch =
    useAppDispatch();

  const {
    assignments,
  } = useAppSelector(
    (state) =>
      state.subjectAssignments
  );

  const {
    loading,
    error,
  } = useAppSelector(
    (state) =>
      state.timetable
  );

  const [
    day,
    setDay,
  ] = useState<
    TimetableDayType
  >(
    (
      initialDay as
        | TimetableDayType
        | undefined
    ) ||
      TimetableDay.MONDAY
  );

  const [
    periodNumber,
    setPeriodNumber,
  ] = useState(
    initialPeriodNumber ||
      1
  );

  const [
    startTime,
    setStartTime,
  ] = useState(
    initialStartTime ||
      "08:00"
  );

  const [
    endTime,
    setEndTime,
  ] = useState(
    initialEndTime ||
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

  useEffect(() => {
    dispatch(
      clearTimetableError()
    );

    dispatch(
      getSubjectAssignments({
        sessionId,
        classId,
        sectionId,
        isActive: true,
      })
    );
  }, [
    dispatch,
    sessionId,
    classId,
    sectionId,
  ]);

  const applicableAssignments =
    useMemo(
      () =>
        assignments.filter(
          (item) =>
            getRelationId(
              item.sessionId
            ) ===
              sessionId &&
            getRelationId(
              item.classId
            ) ===
              classId &&
            getRelationId(
              item.sectionId
            ) ===
              sectionId &&
            item.isActive !==
              false
        ),
      [
        assignments,
        sessionId,
        classId,
        sectionId,
      ]
    );

  const subjectOptions =
    useMemo(() => {
      const map =
        new Map<
          string,
          string
        >();

      applicableAssignments.forEach(
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
      applicableAssignments,
    ]);

  const teacherOptions =
    useMemo(() => {
      const map =
        new Map<
          string,
          string
        >();

      applicableAssignments
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
      applicableAssignments,
      subjectId,
    ]);

  const isRegular =
    periodType ===
    TimetablePeriodType.REGULAR;

  const isBreakLike =
    periodType ===
      TimetablePeriodType.BREAK ||
    periodType ===
      TimetablePeriodType.LUNCH;

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

  const canSubmit =
    Boolean(
      sessionId &&
      classId &&
      sectionId &&
      startTime &&
      endTime
    ) &&
    periodNumber >
      0 &&
    (
      !isRegular ||
      Boolean(
        subjectId &&
        teacherId
      )
    );

  const handleSubmit =
    async (
      event:
        React.FormEvent
    ) => {

      event.preventDefault();

      dispatch(
        clearTimetableError()
      );

      if (
        !canSubmit
      ) {
        return;
      }

      const payload:
        CreateTimetableData = {
        sessionId,
        classId,
        sectionId,
        day,
        periodNumber,
        startTime,
        endTime,
        periodType,
      };

      if (
        subjectId
      ) {
        payload.subjectId =
          subjectId;
      }

      if (
        teacherId
      ) {
        payload.teacherId =
          teacherId;
      }

      if (
        roomNumber.trim()
      ) {
        payload.roomNumber =
          roomNumber.trim();
      }

      const result =
        await dispatch(
          createTimetable(
            payload
          )
        );

      if (
        createTimetable.fulfilled.match(
          result
        )
      ) {
        onSuccess();

        return;
      }

      if (
        createTimetable.rejected.match(
          result
        ) &&
        typeof result.payload ===
          "string"
      ) {
        const message =
          result.payload;

        const lower =
          message.toLowerCase();

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
            message
          );
        }
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
                Add period
              </span>

            </div>


            <h2 className="mt-2 text-2xl font-bold text-gray-950">
              Add Timetable Period
            </h2>


            <p className="mt-1 text-sm text-gray-500">
              Subject and teacher options are loaded from Subject Assignment.
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
              className="text-xl"
            />
          </button>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="space-y-5 p-6">

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}


            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex gap-3">

                <Icon
                  icon="lucide:info"
                  className="mt-0.5 text-xl text-blue-600"
                />

                <p className="text-sm text-gray-700">
                  Backend validates subject assignment, weekly period limit, class-time, teacher-time and room conflicts before saving.
                </p>

              </div>

            </div>


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


              <label className="block text-sm font-medium text-gray-700">

                Period Number{" "}

                <span className="text-red-500">
                  *
                </span>


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
                label="Room Number"
                value={
                  roomNumber
                }
                onChange={
                  setRoomNumber
                }
                placeholder="201"
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
              className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                !canSubmit
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >

              {loading && (
                <Icon
                  icon="lucide:loader-2"
                  className="animate-spin"
                />
              )}

              {loading
                ? "Saving..."
                : "Add Period"}

            </button>

          </div>

        </form>

      </div>

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
  <label className="block text-sm font-medium text-gray-700">

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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="block text-sm font-medium text-gray-700">

    {label}


    <input
      type={
        type
      }
      value={
        value
      }
      placeholder={
        placeholder
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


export default AddTimetablePeriod;
