// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useDispatch,
//   useSelector,
// } from "react-redux";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import HomeworkForm from "../../../components/homework/HomeworkForm";

// import {
//   getHomeworkById,
//   updateHomework,
// } from "../../../features/homework/homework.slice";

// import type {
//   CreateHomeworkData,
// } from "../../../features/homework/homework.types";

// import {
//   getSessions,
// } from "../../../features/academic/sessions/session.slice";

// import {
//   getClasses,
// } from "../../../features/academic/classes/class.slice";

// import {
//   getSections,
// } from "../../../features/academic/sections/section.slice";

// import {
//   getSubjects,
// } from "../../../features/academic/subjects/subject.slice";

// import {
//   getTeachers,
// } from "../../../features/teachers/teacher.slice";
// import { getSubjectAssignments } from "../../../features/academic/subjectAssignments/subjectAssignment.slice";

// // ======================================================
// // HELPERS
// // ======================================================

// const getId = (
//   value: unknown
// ): string => {
//   if (!value) {
//     return "";
//   }

//   if (
//     typeof value === "string"
//   ) {
//     return value;
//   }

//   if (
//     typeof value === "object" &&
//     "_id" in value
//   ) {
//     return (
//       value as {
//         _id?: string;
//       }
//     )._id ?? "";
//   }

//   return "";
// };

// // ======================================================
// // COMPONENT
// // ======================================================

// const EditHomework = () => {
//   const navigate =
//     useNavigate();

//   const {
//     homeworkId,
//   } =
//     useParams<{
//       homeworkId: string;
//     }>();

//   const dispatch =
//     useDispatch<any>();

//   // ====================================================
//   // LOCAL FILTER STATE
//   // ====================================================

//   const [
//     selectedSessionId,
//     setSelectedSessionId,
//   ] =
//     useState("");

//   const [
//     selectedClassId,
//     setSelectedClassId,
//   ] =
//     useState("");

//   const [
//     selectedSectionId,
//     setSelectedSectionId,
//   ] =
//     useState("");

//   const [
//     selectedSubjectId,
//     setSelectedSubjectId,
//   ] =
//     useState("");

//   // ====================================================
//   // HOMEWORK REDUX STATE
//   // ====================================================

//   const homeworkState =
//     useSelector(
//       (state: any) =>
//         state.homework
//     );

//   const homework =
//     homeworkState
//       ?.selectedHomework ??
//     null;

//   const loading =
//     Boolean(
//       homeworkState?.loading
//     );

//   const error =
//     homeworkState?.error ??
//     null;

//   // ====================================================
//   // ACADEMIC REDUX STATE
//   // ====================================================

//   const sessions =
//     useSelector(
//       (state: any) =>
//         state.sessions
//           ?.sessions ?? []
//     );

//   const allClasses =
//     useSelector(
//       (state: any) =>
//         state.classes
//           ?.classes ?? []
//     );

//   const allSections =
//     useSelector(
//       (state: any) =>
//         state.sections
//           ?.sections ?? []
//     );

//   const allSubjects =
//     useSelector(
//       (state: any) =>
//         state.subjects
//           ?.subjects ?? []
//     );

//   const allTeachers =
//     useSelector(
//       (state: any) =>
//         state.teachers
//           ?.teachers ?? []
//     );

//   const assignments =
//     useSelector(
//       (state: any) =>
//         state.subjectAssignments
//           ?.assignments ?? []
//     );

//   // ====================================================
//   // INITIAL DATA LOAD
//   // ====================================================

//   useEffect(() => {
//     if (!homeworkId) {
//       return;
//     }

//     dispatch(
//       getHomeworkById(
//         homeworkId
//       )
//     );

//     dispatch(
//       getSessions()
//     );

//     dispatch(
//       getClasses()
//     );

//     dispatch(
//       getSections(
//         undefined
//       )
//     );

//     dispatch(
//       getSubjects(
//         undefined
//       )
//     );

//     dispatch(
//       getTeachers(
//         undefined
//       )
//     );

//     dispatch(
//       getSubjectAssignments(
//         undefined
//       )
//     );

//   }, [
//     dispatch,
//     homeworkId,
//   ]);

//   // ====================================================
//   // SET CURRENT HOMEWORK COMBINATION
//   // ====================================================

//   useEffect(() => {
//     if (!homework) {
//       return;
//     }

//     setSelectedSessionId(
//       getId(
//         homework.sessionId
//       )
//     );

//     setSelectedClassId(
//       getId(
//         homework.classId
//       )
//     );

//     setSelectedSectionId(
//       getId(
//         homework.sectionId
//       )
//     );

//     setSelectedSubjectId(
//       getId(
//         homework.subjectId
//       )
//     );

//   }, [homework]);

//   // ====================================================
//   // FILTER CLASSES
//   // ====================================================

//   const classes =
//     useMemo(() => {
//       if (
//         !selectedSessionId
//       ) {
//         return allClasses;
//       }

//       return allClasses.filter(
//         (item: any) => {
//           const itemSessionId =
//             getId(
//               item.sessionId ??
//                 item.academicSessionId
//             );

//           /*
//             Agar class object me session relation
//             available nahi hai to usko hide nahi karenge.
//           */

//           if (!itemSessionId) {
//             return true;
//           }

//           return (
//             itemSessionId ===
//             selectedSessionId
//           );
//         }
//       );

//     }, [
//       allClasses,
//       selectedSessionId,
//     ]);

//   // ====================================================
//   // FILTER SECTIONS
//   // ====================================================

//   const sections =
//     useMemo(() => {
//       if (
//         !selectedClassId
//       ) {
//         return [];
//       }

//       return allSections.filter(
//         (item: any) => {
//           const itemClassId =
//             getId(
//               item.classId
//             );

//           if (!itemClassId) {
//             return true;
//           }

//           return (
//             itemClassId ===
//             selectedClassId
//           );
//         }
//       );

//     }, [
//       allSections,
//       selectedClassId,
//     ]);

//   // ====================================================
//   // ASSIGNMENTS FOR CURRENT COMBINATION
//   // ====================================================

//   const currentAssignments =
//     useMemo(() => {
//       if (
//         !selectedSessionId ||
//         !selectedClassId ||
//         !selectedSectionId
//       ) {
//         return [];
//       }

//       return assignments.filter(
//         (assignment: any) => {

//           const assignmentSessionId =
//             getId(
//               assignment.sessionId
//             );

//           const assignmentClassId =
//             getId(
//               assignment.classId
//             );

//           const assignmentSectionId =
//             getId(
//               assignment.sectionId
//             );

//           const active =
//             assignment.isActive !==
//             false;

//           return (
//             assignmentSessionId ===
//               selectedSessionId &&
//             assignmentClassId ===
//               selectedClassId &&
//             assignmentSectionId ===
//               selectedSectionId &&
//             active
//           );
//         }
//       );

//     }, [
//       assignments,
//       selectedSessionId,
//       selectedClassId,
//       selectedSectionId,
//     ]);

//   // ====================================================
//   // SUBJECTS FROM SUBJECT ASSIGNMENTS
//   // ====================================================

//   const subjects =
//     useMemo(() => {
//       if (
//         !selectedSectionId
//       ) {
//         return [];
//       }

//       const subjectIds =
//         new Set(
//           currentAssignments
//             .map(
//               (
//                 assignment: any
//               ) =>
//                 getId(
//                   assignment.subjectId
//                 )
//             )
//             .filter(Boolean)
//         );

//       /*
//         SubjectAssignment available hai to
//         sirf assigned subjects show honge.
//       */

//       if (
//         subjectIds.size >
//         0
//       ) {
//         return allSubjects.filter(
//           (subject: any) =>
//             subjectIds.has(
//               getId(
//                 subject
//               )
//             )
//         );
//       }

//       return [];

//     }, [
//       allSubjects,
//       currentAssignments,
//       selectedSectionId,
//     ]);

//   // ====================================================
//   // TEACHERS FROM SUBJECT ASSIGNMENT
//   // ====================================================

//   const teachers =
//     useMemo(() => {
//       if (
//         !selectedSubjectId
//       ) {
//         return [];
//       }

//       const teacherIds =
//         new Set(
//           currentAssignments
//             .filter(
//               (
//                 assignment: any
//               ) =>
//                 getId(
//                   assignment.subjectId
//                 ) ===
//                 selectedSubjectId
//             )
//             .map(
//               (
//                 assignment: any
//               ) =>
//                 getId(
//                   assignment.teacherId
//                 )
//             )
//             .filter(Boolean)
//         );

//       return allTeachers.filter(
//         (teacher: any) =>
//           teacherIds.has(
//             getId(
//               teacher
//             )
//           )
//       );

//     }, [
//       allTeachers,
//       currentAssignments,
//       selectedSubjectId,
//     ]);

//   // ====================================================
//   // SESSION CHANGE
//   // ====================================================

//   const handleSessionChange = (
//     sessionId: string
//   ) => {
//     setSelectedSessionId(
//       sessionId
//     );

//     setSelectedClassId(
//       ""
//     );

//     setSelectedSectionId(
//       ""
//     );

//     setSelectedSubjectId(
//       ""
//     );
//   };

//   // ====================================================
//   // CLASS CHANGE
//   // ====================================================

//   const handleClassChange = (
//     classId: string
//   ) => {
//     setSelectedClassId(
//       classId
//     );

//     setSelectedSectionId(
//       ""
//     );

//     setSelectedSubjectId(
//       ""
//     );
//   };

//   // ====================================================
//   // SECTION CHANGE
//   // ====================================================

//   const handleSectionChange = (
//     sectionId: string
//   ) => {
//     setSelectedSectionId(
//       sectionId
//     );

//     setSelectedSubjectId(
//       ""
//     );
//   };

//   // ====================================================
//   // SUBJECT CHANGE
//   // ====================================================

//   const handleSubjectChange = (
//     subjectId: string
//   ) => {
//     setSelectedSubjectId(
//       subjectId
//     );
//   };

//   // ====================================================
//   // UPDATE HOMEWORK
//   // ====================================================

//   const handleSubmit =
//     async (
//       data:
//         CreateHomeworkData,
//       _file:
//         File | null
//     ) => {
//       if (
//         !homeworkId
//       ) {
//         return;
//       }

//       try {

//         await dispatch(
//           updateHomework({
//             homeworkId,
//             data,
//           })
//         ).unwrap();

//         navigate(
//           `/school-admin/homework/${homeworkId}`
//         );

//       } catch (error) {

//         console.error(
//           "Failed to update homework:",
//           error
//         );

//       }
//     };

//   // ====================================================
//   // INVALID ID
//   // ====================================================

//   if (!homeworkId) {
//     return (
//       <div className="min-h-screen bg-slate-50 p-6">

//         <div className="mx-auto max-w-5xl">

//           <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

//             <h2 className="font-semibold text-red-700">
//               Invalid Homework
//             </h2>

//             <p className="mt-2 text-sm text-red-600">
//               Homework ID was not found.
//             </p>

//             <button
//               type="button"
//               onClick={() =>
//                 navigate(
//                   "/school-admin/homework"
//                 )
//               }
//               className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
//             >
//               Back to Homework
//             </button>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // LOADING
//   // ====================================================

//   if (
//     loading &&
//     !homework
//   ) {
//     return (
//       <div className="flex min-h-[500px] items-center justify-center bg-slate-50">

//         <div className="text-center">

//           <Icon
//             icon="lucide:loader-circle"
//             className="mx-auto text-4xl text-blue-600 animate-spin"
//           />

//           <p className="mt-3 text-sm text-slate-500">
//             Loading homework...
//           </p>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // ERROR
//   // ====================================================

//   if (
//     error &&
//     !homework
//   ) {
//     return (
//       <div className="min-h-screen bg-slate-50 p-6">

//         <div className="mx-auto max-w-5xl">

//           <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

//             <div className="flex items-start gap-3">

//               <Icon
//                 icon="lucide:circle-alert"
//                 className="mt-0.5 text-2xl text-red-600"
//               />

//               <div>

//                 <h2 className="font-semibold text-red-700">
//                   Unable to load homework
//                 </h2>

//                 <p className="mt-1 text-sm text-red-600">
//                   {error}
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     navigate(
//                       "/school-admin/homework"
//                     )
//                   }
//                   className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
//                 >
//                   Back to Homework
//                 </button>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // WAIT FOR HOMEWORK
//   // ====================================================

//   if (!homework) {
//     return null;
//   }

//   // ====================================================
//   // PAGE
//   // ====================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

//       <div className="mx-auto max-w-6xl">

//         {/* BREADCRUMB */}

//         <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">

//           <button
//             type="button"
//             onClick={() =>
//               navigate(
//                 "/school-admin/homework"
//               )
//             }
//             className="hover:text-blue-600"
//           >
//             Homework
//           </button>

//           <Icon
//             icon="lucide:chevron-right"
//             className="text-slate-400"
//           />

//           <button
//             type="button"
//             onClick={() =>
//               navigate(
//                 `/school-admin/homework/${homeworkId}`
//               )
//             }
//             className="max-w-[250px] truncate hover:text-blue-600"
//           >
//             {homework.title}
//           </button>

//           <Icon
//             icon="lucide:chevron-right"
//             className="text-slate-400"
//           />

//           <span className="font-medium text-slate-800">
//             Edit
//           </span>

//         </div>

//         {/* HEADER */}

//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//           <div>

//             <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
//               Edit Homework
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Update assignment information, details and schedule.
//             </p>

//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               navigate(
//                 `/school-admin/homework/${homeworkId}`
//               )
//             }
//             className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
//           >

//             <Icon
//               icon="lucide:arrow-left"
//             />

//             Back

//           </button>

//         </div>

//         {/* FORM */}

//         <HomeworkForm
//           initialData={
//             homework
//           }
//           sessions={
//             sessions
//           }
//           classes={
//             classes
//           }
//           sections={
//             sections
//           }
//           subjects={
//             subjects
//           }
//           teachers={
//             teachers
//           }
//           loading={
//             loading
//           }
//           onSessionChange={
//             handleSessionChange
//           }
//           onClassChange={
//             handleClassChange
//           }
//           onSectionChange={
//             handleSectionChange
//           }
//           onSubjectChange={
//             handleSubjectChange
//           }
//           onSubmit={
//             handleSubmit
//           }
//           onCancel={() =>
//             navigate(
//               `/school-admin/homework/${homeworkId}`
//             )
//           }
//         />

//       </div>

//     </div>
//   );
// };

// export default EditHomework;

import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import { Icon } from "@iconify/react";

import HomeworkForm from "../../../components/homework/HomeworkForm";

import {
  getHomeworkById,
  updateHomework,
} from "../../../features/homework/homework.slice";

import type { CreateHomeworkData } from "../../../features/homework/homework.types";

import { getClasses } from "../../../features/academic/classes/class.slice";

import { getSections } from "../../../features/academic/sections/section.slice";

import { getSubjects } from "../../../features/academic/subjects/subject.slice";

import { getTeachers } from "../../../features/teachers/teacher.slice";
import { getSubjectAssignments } from "../../../features/academic/subjectAssignments/subjectAssignment.slice";

// ======================================================
// HELPERS
// ======================================================

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

// ======================================================
// COMPONENT
// ======================================================

const EditHomework = () => {
  const navigate = useNavigate();

  const { homeworkId } = useParams<{
    homeworkId: string;
  }>();

  const dispatch = useDispatch<any>();

  // ====================================================
  // GLOBAL SESSION + LOCAL FILTER STATE
  // ====================================================

  const selectedSessionId = useSelector(
    (state: any) => state.sessionSelection?.selectedSessionId ?? "",
  ) as string;

  const [selectedClassId, setSelectedClassId] = useState("");

  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // ====================================================
  // HOMEWORK REDUX STATE
  // ====================================================

  const homeworkState = useSelector((state: any) => state.homework);

  const homework = homeworkState?.selectedHomework ?? null;

  const loading = Boolean(homeworkState?.loading);

  const error = homeworkState?.error ?? null;

  // ====================================================
  // ACADEMIC REDUX STATE
  // ====================================================

  const allClasses = useSelector((state: any) => state.classes?.classes ?? []);

  const allSections = useSelector(
    (state: any) => state.sections?.sections ?? [],
  );

  const allSubjects = useSelector(
    (state: any) => state.subjects?.subjects ?? [],
  );

  const allTeachers = useSelector(
    (state: any) => state.teachers?.teachers ?? [],
  );

  const assignments = useSelector(
    (state: any) => state.subjectAssignments?.assignments ?? [],
  );

  // ====================================================
  // INITIAL DATA LOAD
  // ====================================================

  useEffect(() => {
    if (!homeworkId) {
      return;
    }

    dispatch(getHomeworkById(homeworkId));

    dispatch(getTeachers(undefined));
  }, [dispatch, homeworkId]);

  useEffect(() => {
    setSelectedClassId("");
    setSelectedSectionId("");
    setSelectedSubjectId("");

    if (!selectedSessionId) {
      return;
    }

    dispatch(
      getClasses({
        sessionId: selectedSessionId,
      }),
    );

    dispatch(
      getSections({
        sessionId: selectedSessionId,
      }),
    );

    dispatch(
      getSubjects({
        sessionId: selectedSessionId,
      }),
    );

    dispatch(
      getSubjectAssignments({
        sessionId: selectedSessionId,
      }),
    );
  }, [dispatch, selectedSessionId]);

  // ====================================================
  // SET CURRENT HOMEWORK COMBINATION
  // ====================================================

  useEffect(() => {
    if (!homework) {
      return;
    }

    const homeworkSessionId = getId(homework.sessionId);

    if (!selectedSessionId || homeworkSessionId !== selectedSessionId) {
      setSelectedClassId("");
      setSelectedSectionId("");
      setSelectedSubjectId("");

      return;
    }

    setSelectedClassId(getId(homework.classId));

    setSelectedSectionId(getId(homework.sectionId));

    setSelectedSubjectId(getId(homework.subjectId));
  }, [homework, selectedSessionId]);

  // ====================================================
  // FILTER CLASSES
  // ====================================================

  const classes = useMemo(() => {
    if (!selectedSessionId) {
      return [];
    }

    return allClasses.filter((item: any) => {
      const itemSessionId = getId(item.sessionId ?? item.academicSessionId);

      /*
            Agar class object me session relation
            available nahi hai to usko hide nahi karenge.
          */

      if (!itemSessionId) {
        return true;
      }

      return itemSessionId === selectedSessionId;
    });
  }, [allClasses, selectedSessionId]);

  // ====================================================
  // FILTER SECTIONS
  // ====================================================

  const sections = useMemo(() => {
    if (!selectedClassId) {
      return [];
    }

    return allSections.filter((item: any) => {
      const itemClassId = getId(item.classId);

      if (!itemClassId) {
        return true;
      }

      return itemClassId === selectedClassId;
    });
  }, [allSections, selectedClassId]);

  // ====================================================
  // ASSIGNMENTS FOR CURRENT COMBINATION
  // ====================================================

  const currentAssignments = useMemo(() => {
    if (!selectedSessionId || !selectedClassId || !selectedSectionId) {
      return [];
    }

    return assignments.filter((assignment: any) => {
      const assignmentSessionId = getId(assignment.sessionId);

      const assignmentClassId = getId(assignment.classId);

      const assignmentSectionId = getId(assignment.sectionId);

      const active = assignment.isActive !== false;

      return (
        assignmentSessionId === selectedSessionId &&
        assignmentClassId === selectedClassId &&
        assignmentSectionId === selectedSectionId &&
        active
      );
    });
  }, [assignments, selectedSessionId, selectedClassId, selectedSectionId]);

  // ====================================================
  // SUBJECTS FROM SUBJECT ASSIGNMENTS
  // ====================================================

  const subjects = useMemo(() => {
    if (!selectedSectionId) {
      return [];
    }

    const subjectIds = new Set(
      currentAssignments
        .map((assignment: any) => getId(assignment.subjectId))
        .filter(Boolean),
    );

    /*
        SubjectAssignment available hai to
        sirf assigned subjects show honge.
      */

    if (subjectIds.size > 0) {
      return allSubjects.filter((subject: any) =>
        subjectIds.has(getId(subject)),
      );
    }

    return [];
  }, [allSubjects, currentAssignments, selectedSectionId]);

  // ====================================================
  // TEACHERS FROM SUBJECT ASSIGNMENT
  // ====================================================

  const teachers = useMemo(() => {
    if (!selectedSubjectId) {
      return [];
    }

    const teacherIds = new Set(
      currentAssignments
        .filter(
          (assignment: any) =>
            getId(assignment.subjectId) === selectedSubjectId,
        )
        .map((assignment: any) => getId(assignment.teacherId))
        .filter(Boolean),
    );

    return allTeachers.filter((teacher: any) => teacherIds.has(getId(teacher)));
  }, [allTeachers, currentAssignments, selectedSubjectId]);

  // ====================================================
  // CLASS CHANGE
  // ====================================================

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);

    setSelectedSectionId("");

    setSelectedSubjectId("");
  };

  // ====================================================
  // SECTION CHANGE
  // ====================================================

  const handleSectionChange = (sectionId: string) => {
    setSelectedSectionId(sectionId);

    setSelectedSubjectId("");
  };

  // ====================================================
  // SUBJECT CHANGE
  // ====================================================

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  // ====================================================
  // UPDATE HOMEWORK
  // ====================================================

  const handleSubmit = async (data: CreateHomeworkData, _file: File | null) => {
    if (!homeworkId || !selectedSessionId) {
      return;
    }

    try {
      await dispatch(
        updateHomework({
          homeworkId,
          data: {
            ...data,
            sessionId: selectedSessionId,
          },
        }),
      ).unwrap();

      navigate(`/school-admin/homework/${homeworkId}`);
    } catch (error) {
      console.error("Failed to update homework:", error);
    }
  };

  // ====================================================
  // INVALID ID
  // ====================================================

  if (!homeworkId) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-700">Invalid Homework</h2>

            <p className="mt-2 text-sm text-red-600">
              Homework ID was not found.
            </p>

            <button
              type="button"
              onClick={() => navigate("/school-admin/homework")}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Back to Homework
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // LOADING
  // ====================================================

  if (loading && !homework) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <Icon
            icon="lucide:loader-circle"
            className="mx-auto text-4xl text-blue-600 animate-spin"
          />

          <p className="mt-3 text-sm text-slate-500">Loading homework...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error && !homework) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <Icon
                icon="lucide:circle-alert"
                className="mt-0.5 text-2xl text-red-600"
              />

              <div>
                <h2 className="font-semibold text-red-700">
                  Unable to load homework
                </h2>

                <p className="mt-1 text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => navigate("/school-admin/homework")}
                  className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Back to Homework
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // WAIT FOR HOMEWORK
  // ====================================================

  if (!homework) {
    return null;
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* BREADCRUMB */}

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate("/school-admin/homework")}
            className="hover:text-blue-600"
          >
            Homework
          </button>

          <Icon icon="lucide:chevron-right" className="text-slate-400" />

          <button
            type="button"
            onClick={() => navigate(`/school-admin/homework/${homeworkId}`)}
            className="max-w-[250px] truncate hover:text-blue-600"
          >
            {homework.title}
          </button>

          <Icon icon="lucide:chevron-right" className="text-slate-400" />

          <span className="font-medium text-slate-800">Edit</span>
        </div>

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Edit Homework
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update assignment information, details and schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/school-admin/homework/${homeworkId}`)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Icon icon="lucide:arrow-left" />
            Back
          </button>
        </div>

        {/* FORM */}

        <HomeworkForm
          key={selectedSessionId}
          initialData={homework}
          sessionId={selectedSessionId}
          classes={classes}
          sections={sections}
          subjects={subjects}
          teachers={teachers}
          loading={loading}
          onClassChange={handleClassChange}
          onSectionChange={handleSectionChange}
          onSubjectChange={handleSubjectChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/school-admin/homework/${homeworkId}`)}
        />
      </div>
    </div>
  );
};

export default EditHomework;
