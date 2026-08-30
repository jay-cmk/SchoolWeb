// import React, { useMemo } from "react";
// import { Icon } from "@iconify/react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import HomeworkForm, { type HomeworkFormOption } from "../../../components/homework/HomeworkForm";
// import { createHomework } from "../../../features/homework/homework.slice";
// import type { CreateHomeworkData } from "../../../features/homework/homework.types";

// const optionsOf = (list:any[]):HomeworkFormOption[] => list.map((x:any)=>({value:x._id??x.id,label:x.name??x.sessionName??x.title??"Unnamed"})).filter(x=>x.value);

// const AddHomework: React.FC = () => {
//   const dispatch = useDispatch<any>(); const navigate = useNavigate();
//   const loading = useSelector((s:any)=>s.homework?.loading ?? false);
//   const sessions = useSelector((s:any)=>s.sessions?.sessions ?? s.academicSessions?.sessions ?? []);
//   const classes = useSelector((s:any)=>s.classes?.classes ?? []); const sections = useSelector((s:any)=>s.sections?.sections ?? []); const subjects = useSelector((s:any)=>s.subjects?.subjects ?? []); const teachers = useSelector((s:any)=>s.teachers?.teachers ?? []);
//   const options = useMemo(()=>({sessions:optionsOf(sessions),classes:optionsOf(classes),sections:optionsOf(sections),subjects:optionsOf(subjects),teachers:optionsOf(teachers)}),[sessions,classes,sections,subjects,teachers]);

//   const submit = async (data:CreateHomeworkData, _mode:"draft"|"publish", file:File|null) => {
//     // Backend currently stores attachment metadata/URL, not raw File upload. Connect your upload provider here, then add attachment to data.
//     if (file) console.info("Selected attachment waiting for upload integration:", file.name);
//     const result = await dispatch(createHomework(data));
//     if (createHomework.fulfilled.match(result)) navigate("/school-admin/homework");
//   };

//   return <div className="min-h-screen bg-slate-50"><main className="mx-auto w-full max-w-[1120px] p-6 lg:p-8"><button onClick={()=>navigate("/school-admin/homework")} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"><Icon icon="lucide:arrow-left" className="h-4 w-4"/>Back to Homework</button><div className="mb-6 mt-4"><div className="text-sm text-slate-500">Academics / Homework / Add Homework</div><h1 className="mt-2 text-2xl font-bold text-slate-900">Add Homework</h1><p className="mt-1 text-sm text-slate-500">Create an assignment record for monitoring and student submission tracking.</p></div>
//     {(options.sessions.length===0||options.classes.length===0||options.sections.length===0||options.subjects.length===0||options.teachers.length===0) && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Academic dropdown data is empty. Load Session, Class, Section, Subject and Teacher data in their existing Redux slices before creating homework.</div>}
//     <HomeworkForm options={options} loading={loading} onCancel={()=>navigate("/school-admin/homework")} onSubmit={submit}/></main></div>;
// };
// export default AddHomework;







import { useEffect, useMemo } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {

  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { Icon } from "@iconify/react";

import HomeworkForm from "../../../components/homework/HomeworkForm";

import {
  createHomework,
} from "../../../features/homework/homework.slice";

import type {
  CreateHomeworkData,
} from "../../../features/homework/homework.types";

import { getSessions } from "../../../features/academic/sessions/session.slice";
import { getClasses } from "../../../features/academic/classes/class.slice";
import { getSections } from "../../../features/academic/sections/section.slice";
import { getSubjects } from "../../../features/academic/subjects/subject.slice";
import { getTeachers } from "../../../features/teachers/teacher.slice";
import { getSubjectAssignments } from "../../../features/academic/subjectAssignments/subjectAssignment.slice";



type RefValue =
  | string
  | {
      _id?: string;
      name?: string;
    }
  | null
  | undefined;

interface SessionItem {
  _id: string;
  name?: string;
  sessionName?: string;
  isCurrent?: boolean;
}

interface ClassItem {
  _id: string;
  name: string;

  academicSessionId?: RefValue;
  sessionId?: RefValue;

  isActive?: boolean;
}

interface SectionItem {
  _id: string;
  name: string;

  classId?: RefValue;
  academicSessionId?: RefValue;
  sessionId?: RefValue;

  isActive?: boolean;
}

interface SubjectItem {
  _id: string;
  name: string;

  isActive?: boolean;
}

interface TeacherItem {
  _id: string;

  name?: string;
  firstName?: string;
  lastName?: string;

  isActive?: boolean;
}

interface AssignmentItem {
  _id: string;

  sessionId?: RefValue;
  academicSessionId?: RefValue;

  classId?: RefValue;
  sectionId?: RefValue;

  subjectId?: RefValue;
  teacherId?: RefValue;

  isActive?: boolean;
}

const getId = (
  value: RefValue
): string => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value._id ?? "";
};

const AddHomework = () => {
  const navigate = useNavigate();

  const dispatch =
    useDispatch<any>();

  const sessions =
    useSelector(
      (state: any) =>
        state.sessions?.sessions ?? []
    ) as SessionItem[];

  const classes =
    useSelector(
      (state: any) =>
        state.classes?.classes ?? []
    ) as ClassItem[];

  const sections =
    useSelector(
      (state: any) =>
        state.sections?.sections ?? []
    ) as SectionItem[];

  const subjects =
    useSelector(
      (state: any) =>
        state.subjects?.subjects ?? []
    ) as SubjectItem[];

  const teachers =
    useSelector(
      (state: any) =>
        state.teachers?.teachers ?? []
    ) as TeacherItem[];

  const assignments =
    useSelector(
      (state: any) =>
        state.subjectAssignments
          ?.assignments ?? []
    ) as AssignmentItem[];

  const homeworkLoading =
    useSelector(
      (state: any) =>
        Boolean(
          state.homework?.loading
        )
    );

  // Current selected dropdown values
  // Form will notify this page.
  const selectedValues =
    useMemo(
      () => ({
        sessionId: "",
        classId: "",
        sectionId: "",
        subjectId: "",
      }),
      []
    );

  /*
   * We use mutable ref-style object here
   * because values are only needed for
   * filtering child dropdown options.
   */
  const values = selectedValues;

  useEffect(() => {
    dispatch(getSessions());

    dispatch(getClasses());

    // Important:
    // these thunks accept undefined,
    // therefore no API query-field guessing.
    dispatch(getSections(undefined));

    dispatch(getSubjects(undefined));

    dispatch(getTeachers(undefined));

    dispatch(
      getSubjectAssignments(undefined)
    );
  }, [dispatch]);

  const activeClasses =
    useMemo(() => {
      return classes.filter(
        (item) =>
          item.isActive !== false
      );
    }, [classes]);

  const activeSections =
    useMemo(() => {
      return sections.filter(
        (item) =>
          item.isActive !== false
      );
    }, [sections]);

  const activeSubjects =
    useMemo(() => {
      return subjects.filter(
        (item) =>
          item.isActive !== false
      );
    }, [subjects]);

  const activeTeachers =
    useMemo(() => {
      return teachers.filter(
        (item) =>
          item.isActive !== false
      );
    }, [teachers]);

  const getClassesForSession = (
    sessionId: string
  ) => {
    if (!sessionId) {
      return [];
    }

    return activeClasses.filter(
      (item) => {
        const itemSessionId =
          getId(
            item.academicSessionId ??
              item.sessionId
          );

        // If class response doesn't
        // contain sessionId, don't hide it.
        if (!itemSessionId) {
          return true;
        }

        return (
          itemSessionId === sessionId
        );
      }
    );
  };

  const getSectionsForClass = (
    sessionId: string,
    classId: string
  ) => {
    if (!classId) {
      return [];
    }

    return activeSections.filter(
      (item) => {
        const itemClassId =
          getId(item.classId);

        const itemSessionId =
          getId(
            item.academicSessionId ??
              item.sessionId
          );

        const classMatches =
          !itemClassId ||
          itemClassId === classId;

        const sessionMatches =
          !itemSessionId ||
          !sessionId ||
          itemSessionId === sessionId;

        return (
          classMatches &&
          sessionMatches
        );
      }
    );
  };

  const assignmentMatches = (
    assignment: AssignmentItem,
    sessionId: string,
    classId: string,
    sectionId: string,
    subjectId?: string
  ) => {
    if (
      assignment.isActive === false
    ) {
      return false;
    }

    const assignmentSession =
      getId(
        assignment.sessionId ??
          assignment.academicSessionId
      );

    const assignmentClass =
      getId(assignment.classId);

    const assignmentSection =
      getId(assignment.sectionId);

    const assignmentSubject =
      getId(assignment.subjectId);

    if (
      assignmentSession &&
      assignmentSession !== sessionId
    ) {
      return false;
    }

    if (
      assignmentClass &&
      assignmentClass !== classId
    ) {
      return false;
    }

    if (
      assignmentSection &&
      assignmentSection !==
        sectionId
    ) {
      return false;
    }

    if (
      subjectId &&
      assignmentSubject !==
        subjectId
    ) {
      return false;
    }

    return true;
  };

  const getSubjectsForSelection = (
    sessionId: string,
    classId: string,
    sectionId: string
  ) => {
    if (
      !sessionId ||
      !classId ||
      !sectionId
    ) {
      return [];
    }

    const matchingAssignments =
      assignments.filter(
        (assignment) =>
          assignmentMatches(
            assignment,
            sessionId,
            classId,
            sectionId
          )
      );

    const subjectIds =
      new Set(
        matchingAssignments
          .map((item) =>
            getId(item.subjectId)
          )
          .filter(Boolean)
      );

    return activeSubjects.filter(
      (subject) =>
        subjectIds.has(subject._id)
    );
  };

  const getTeachersForSelection = (
    sessionId: string,
    classId: string,
    sectionId: string,
    subjectId: string
  ) => {
    if (
      !sessionId ||
      !classId ||
      !sectionId ||
      !subjectId
    ) {
      return [];
    }

    const matchingAssignments =
      assignments.filter(
        (assignment) =>
          assignmentMatches(
            assignment,
            sessionId,
            classId,
            sectionId,
            subjectId
          )
      );

    const teacherIds =
      new Set(
        matchingAssignments
          .map((item) =>
            getId(item.teacherId)
          )
          .filter(Boolean)
      );

    return activeTeachers.filter(
      (teacher) =>
        teacherIds.has(teacher._id)
    );
  };

  /*
   * We keep these in component state
   * through simple local variables
   * generated from form callbacks.
   */

 

  const [
    selectedSessionId,
    setSelectedSessionId,
  ] = useState("");

  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState("");

  const [
    selectedSectionId,
    setSelectedSectionId,
  ] = useState("");

  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] = useState("");

  const filteredClasses =
    useMemo(
      () =>
        getClassesForSession(
          selectedSessionId
        ),
      [
        activeClasses,
        selectedSessionId,
      ]
    );

  const filteredSections =
    useMemo(
      () =>
        getSectionsForClass(
          selectedSessionId,
          selectedClassId
        ),
      [
        activeSections,
        selectedSessionId,
        selectedClassId,
      ]
    );

  const filteredSubjects =
    useMemo(
      () =>
        getSubjectsForSelection(
          selectedSessionId,
          selectedClassId,
          selectedSectionId
        ),
      [
        assignments,
        activeSubjects,
        selectedSessionId,
        selectedClassId,
        selectedSectionId,
      ]
    );

  const filteredTeachers =
    useMemo(
      () =>
        getTeachersForSelection(
          selectedSessionId,
          selectedClassId,
          selectedSectionId,
          selectedSubjectId
        ),
      [
        assignments,
        activeTeachers,
        selectedSessionId,
        selectedClassId,
        selectedSectionId,
        selectedSubjectId,
      ]
    );

  const handleCreateHomework =
    async (
      data: CreateHomeworkData,
      file: File | null
    ) => {
      /*
       * File upload provider has not
       * been configured yet.
       *
       * Therefore DON'T send local File
       * as backend attachment URL.
       */
      if (file) {
        console.log(
          "Selected homework attachment:",
          file
        );
      }

      const result =
        await dispatch(
          createHomework(data)
        );

      if (
        createHomework.fulfilled.match(
          result
        )
      ) {
        navigate(
          "/school-admin/homework"
        );
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <button
            onClick={() =>
              navigate(
                "/school-admin/homework"
              )
            }
            className="hover:text-blue-600"
          >
            Homework
          </button>

          <Icon
            icon="lucide:chevron-right"
            className="text-base"
          />

          <span className="font-medium text-slate-700">
            Add Homework
          </span>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/school-admin/homework"
              )
            }
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <Icon
              icon="lucide:arrow-left"
              className="text-xl"
            />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Add Homework
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and assign homework
              to students.
            </p>
          </div>
        </div>

        <HomeworkForm
          sessions={sessions}
          classes={filteredClasses}
          sections={filteredSections}
          subjects={filteredSubjects}
          teachers={filteredTeachers}
          loading={homeworkLoading}
          onSessionChange={(
            sessionId
          ) => {
            setSelectedSessionId(
              sessionId
            );

            setSelectedClassId("");
            setSelectedSectionId("");
            setSelectedSubjectId("");
          }}
          onClassChange={(classId) => {
            setSelectedClassId(classId);

            setSelectedSectionId("");
            setSelectedSubjectId("");
          }}
          onSectionChange={(
            sectionId
          ) => {
            setSelectedSectionId(
              sectionId
            );

            setSelectedSubjectId("");
          }}
          onSubjectChange={(
            subjectId
          ) => {
            setSelectedSubjectId(
              subjectId
            );
          }}
          onSubmit={
            handleCreateHomework
          }
          onCancel={() =>
            navigate(
              "/school-admin/homework"
            )
          }
        />
      </div>
    </div>
  );
};

export default AddHomework;