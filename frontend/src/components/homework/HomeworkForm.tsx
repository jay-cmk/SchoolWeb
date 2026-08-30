import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
  HomeworkStatus,
  type CreateHomeworkData,
} from "../../features/homework/homework.types";

type ReferenceValue =
  | string
  | {
      _id?: string;
      name?: string;
      sessionName?: string;
      firstName?: string;
      lastName?: string;
    }
  | null
  | undefined;

interface SessionOption {
  _id: string;
  name?: string;
  sessionName?: string;
  isCurrent?: boolean;
}

interface ClassOption {
  _id: string;
  name: string;
}

interface SectionOption {
  _id: string;
  name: string;
}

interface SubjectOption {
  _id: string;
  name: string;
}

interface TeacherOption {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface HomeworkFormProps {
  sessions: SessionOption[];
  classes: ClassOption[];
  sections: SectionOption[];
  subjects: SubjectOption[];
  teachers: TeacherOption[];

  loading?: boolean;

  onSessionChange?: (sessionId: string) => void;
  onClassChange?: (classId: string) => void;
  onSectionChange?: (sectionId: string) => void;
  onSubjectChange?: (subjectId: string) => void;

  onSubmit: (
    data: CreateHomeworkData,
    file: File | null
  ) => Promise<void> | void;

  onCancel: () => void;
}

const getName = (value: ReferenceValue) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (value.name) {
    return value.name;
  }

  if (value.sessionName) {
    return value.sessionName;
  }

  return [value.firstName, value.lastName]
    .filter(Boolean)
    .join(" ");
};

const today = new Date().toISOString().split("T")[0];

const HomeworkForm = ({
  sessions,
  classes,
  sections,
  subjects,
  teachers,
  loading = false,

  onSessionChange,
  onClassChange,
  onSectionChange,
  onSubjectChange,

  onSubmit,
  onCancel,
}: HomeworkFormProps) => {
  const currentSession = useMemo(
    () => sessions.find((item) => item.isCurrent),
    [sessions]
  );

  const [sessionId, setSessionId] = useState(
    currentSession?._id ?? ""
  );

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [assignedDate, setAssignedDate] =
    useState(today);

  const [dueDate, setDueDate] = useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  const handleSessionChange = (
    value: string
  ) => {
    setSessionId(value);

    setClassId("");
    setSectionId("");
    setSubjectId("");
    setTeacherId("");

    onSessionChange?.(value);
  };

  const handleClassChange = (
    value: string
  ) => {
    setClassId(value);

    setSectionId("");
    setSubjectId("");
    setTeacherId("");

    onClassChange?.(value);
  };

  const handleSectionChange = (
    value: string
  ) => {
    setSectionId(value);

    setSubjectId("");
    setTeacherId("");

    onSectionChange?.(value);
  };

  const handleSubjectChange = (
    value: string
  ) => {
    setSubjectId(value);
    setTeacherId("");

    onSubjectChange?.(value);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setFormError(
        "Attachment size must be less than 10 MB."
      );

      event.target.value = "";
      setFile(null);

      return;
    }

    setFormError(null);
    setFile(selectedFile);
  };

  const validate = () => {
    if (!sessionId) {
      return "Please select academic session.";
    }

    if (!classId) {
      return "Please select class.";
    }

    if (!sectionId) {
      return "Please select section.";
    }

    if (!subjectId) {
      return "Please select subject.";
    }

    if (!teacherId) {
      return "Please select assigned teacher.";
    }

    if (!title.trim()) {
      return "Homework title is required.";
    }

    if (!description.trim()) {
      return "Homework description is required.";
    }

    if (!assignedDate) {
      return "Assigned date is required.";
    }

    if (!dueDate) {
      return "Due date is required.";
    }

    if (
      new Date(dueDate) <
      new Date(assignedDate)
    ) {
      return "Due date cannot be before assigned date.";
    }

    return null;
  };

  const submitHomework = async (
    status: HomeworkStatus
  ) => {
    const error = validate();

    if (error) {
      setFormError(error);
      return;
    }

    setFormError(null);

    const data: CreateHomeworkData = {
      sessionId,
      classId,
      sectionId,
      subjectId,
      teacherId,
      title: title.trim(),
      description: description.trim(),
      assignedDate,
      dueDate,
      status,
    };

    await onSubmit(data, file);
  };

  return (
    <div className="space-y-6">
      {formError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <Icon
            icon="lucide:circle-alert"
            className="mt-0.5 text-xl text-red-600"
          />

          <p className="text-sm font-medium text-red-700">
            {formError}
          </p>
        </div>
      )}

      {/* Assignment Information */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Assignment Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select academic details for this
            homework.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Session */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Academic Session
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={sessionId}
              onChange={(e) =>
                handleSessionChange(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select academic session
              </option>

              {sessions.map((session) => (
                <option
                  key={session._id}
                  value={session._id}
                >
                  {getName(session)}
                  {session.isCurrent
                    ? " (Current)"
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Class
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={classId}
              disabled={!sessionId}
              onChange={(e) =>
                handleClassChange(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {sessionId
                  ? "Select class"
                  : "Select session first"}
              </option>

              {classes.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Section
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={sectionId}
              disabled={!classId}
              onChange={(e) =>
                handleSectionChange(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {classId
                  ? "Select section"
                  : "Select class first"}
              </option>

              {sections.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={subjectId}
              disabled={!sectionId}
              onChange={(e) =>
                handleSubjectChange(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {sectionId
                  ? "Select subject"
                  : "Select section first"}
              </option>

              {subjects.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assigned Teacher
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              value={teacherId}
              disabled={!subjectId}
              onChange={(e) =>
                setTeacherId(e.target.value)
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {!subjectId
                  ? "Select subject first"
                  : teachers.length === 0
                    ? "No assigned teacher found"
                    : "Select teacher"}
              </option>

              {teachers.map((teacher) => (
                <option
                  key={teacher._id}
                  value={teacher._id}
                >
                  {getName(teacher)}
                </option>
              ))}
            </select>

            {subjectId &&
              teachers.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No active subject assignment
                  found for this combination.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Homework Details */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Homework Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add title, description and schedule.
          </p>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Homework Title
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter homework title"
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={6}
              placeholder="Write homework instructions..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assigned Date
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="date"
                value={assignedDate}
                onChange={(e) => {
                  setAssignedDate(
                    e.target.value
                  );

                  if (
                    dueDate &&
                    e.target.value >
                      dueDate
                  ) {
                    setDueDate("");
                  }
                }}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Due Date
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="date"
                value={dueDate}
                min={assignedDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attachment */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Attachment
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Optional supporting document.
          </p>
        </div>

        <div className="p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-blue-400 hover:bg-blue-50/40">
            <Icon
              icon="lucide:cloud-upload"
              className="text-4xl text-slate-400"
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              Click to upload attachment
            </p>

            <p className="mt-1 text-xs text-slate-500">
              PDF, DOC, DOCX, JPG or PNG.
              Maximum 10 MB.
            </p>

            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon
                    icon="lucide:file"
                    className="text-xl"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Icon icon="lucide:x" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            void submitHomework(
              HomeworkStatus.DRAFT
            )
          }
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
        >
          <Icon icon="lucide:save" />

          Save Draft
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            void submitHomework(
              HomeworkStatus.PUBLISHED
            )
          }
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Icon
              icon="lucide:loader-circle"
              className="animate-spin"
            />
          ) : (
            <Icon icon="lucide:send" />
          )}

          Publish Homework
        </button>
      </div>
    </div>
  );
};

export default HomeworkForm;