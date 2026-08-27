import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Icon } from "@iconify/react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks";

import {
  getSessions,
} from "../../../../features/academic/sessions/session.slice";

import {
  getClasses,
} from "../../../../features/academic/classes/class.slice";

import {
  getSections,
} from "../../../../features/academic/sections/section.slice";

import {
  getSubjects,
} from "../../../../features/academic/subjects/subject.slice";

import {
  getTeachers,
} from "../../../../features/teachers/teacher.slice";

import {
  createSubjectAssignment,
  getSubjectAssignments,
  getSubjectAssignmentById,
  updateSubjectAssignment,
  updateSubjectAssignmentStatus,
  clearSubjectAssignmentError,
  clearSelectedSubjectAssignment,
} from "../../../../features/academic/subjectAssignments/subjectAssignment.slice";

import type {
  SubjectAssignmentData,
  AssignmentSession,
  AssignmentSubject,
  AssignmentClass,
  AssignmentSection,
  AssignmentTeacher,
  CreateSubjectAssignmentPayload,
  UpdateSubjectAssignmentPayload,
} from "../../../../features/academic/subjectAssignments/subjectAssignment.types";


// ============================================
// FORM TYPE
// ============================================

interface AssignmentFormState {
  sessionId: string;

  classId: string;

  sectionId: string;

  subjectId: string;

  teacherId: string;

  weeklyPeriods: string;
}


// ============================================
// INITIAL FORM
// ============================================

const initialFormState: AssignmentFormState = {
  sessionId: "",

  classId: "",

  sectionId: "",

  subjectId: "",

  teacherId: "",

  weeklyPeriods: "",
};


// ============================================
// MAIN PAGE
// ============================================

const SubjectAssignments = () => {
  const dispatch =
    useAppDispatch();


  // ============================================
  // REDUX
  // ============================================

  const {
    assignments,
    selectedAssignment,
    loading,
    error,
  } = useAppSelector(
    (state) =>
      state.subjectAssignments
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
    subjects,
  } = useAppSelector(
    (state) =>
      state.subjects
  );


  const {
    teachers,
  } = useAppSelector(
    (state) =>
      state.teachers
  );


  // ============================================
  // FILTERS
  // ============================================

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    sessionFilter,
    setSessionFilter,
  ] = useState("ALL");


  const [
    classFilter,
    setClassFilter,
  ] = useState("ALL");


  const [
    sectionFilter,
    setSectionFilter,
  ] = useState("ALL");


  const [
    subjectFilter,
    setSubjectFilter,
  ] = useState("ALL");


  const [
    teacherFilter,
    setTeacherFilter,
  ] = useState("ALL");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" |
    "ACTIVE" |
    "INACTIVE"
  >("ALL");


  // ============================================
  // MODALS
  // ============================================

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);


  const [
    showEditModal,
    setShowEditModal,
  ] = useState(false);


  const [
    showDetailsModal,
    setShowDetailsModal,
  ] = useState(false);


  // ============================================
  // FORM
  // ============================================

  const [
    formData,
    setFormData,
  ] =
    useState<AssignmentFormState>(
      initialFormState
    );


  // ============================================
  // ACTION STATE
  // ============================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    activeMenuId,
    setActiveMenuId,
  ] =
    useState<
      string | null
    >(null);


  const [
    statusActionId,
    setStatusActionId,
  ] =
    useState<
      string | null
    >(null);


  const [
    toastMessage,
    setToastMessage,
  ] =
    useState<
      string | null
    >(null);


  // ============================================
  // PAGINATION
  // ============================================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const itemsPerPage =
    7;


  // ============================================
  // INITIAL LOAD
  // ============================================

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
      getSubjects(
        undefined
      )
    );

    dispatch(
      getTeachers(
        undefined
      )
    );

    dispatch(
      getSubjectAssignments(
        undefined
      )
    );
  }, [dispatch]);


  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      dispatch(
        clearSubjectAssignmentError()
      );

      dispatch(
        clearSelectedSubjectAssignment()
      );
    };
  }, [dispatch]);


  // ============================================
  // ERROR TOAST
  // ============================================

  useEffect(() => {
    if (error) {
      showToast(
        error
      );
    }
  }, [error]);


  // ============================================
  // TOAST
  // ============================================

  const showToast = (
    message: string
  ) => {
    setToastMessage(
      message
    );


    window.setTimeout(
      () => {
        setToastMessage(
          null
        );
      },

      3000
    );
  };


  // ============================================
  // HELPERS
  // ============================================

  const getId = (
    value:
      | string
      | {
          _id: string;
        }
  ) => {
    return typeof value ===
      "string"
      ? value
      : value._id;
  };


  const getSessionName = (
    value:
      | string
      | AssignmentSession
  ) => {
    if (
      typeof value !==
      "string"
    ) {
      return value.name;
    }


    return (
      sessions.find(
        (item) =>
          item._id ===
          value
      )?.name ||
      "-"
    );
  };


  const getSubjectName = (
    value:
      | string
      | AssignmentSubject
  ) => {
    if (
      typeof value !==
      "string"
    ) {
      return value.name;
    }


    return (
      subjects.find(
        (item) =>
          item._id ===
          value
      )?.name ||
      "-"
    );
  };


  const getClassName = (
    value:
      | string
      | AssignmentClass
  ) => {
    if (
      typeof value !==
      "string"
    ) {
      return value.name;
    }


    return (
      classes.find(
        (item) =>
          item._id ===
          value
      )?.name ||
      "-"
    );
  };


  const getSectionName = (
    value:
      | string
      | AssignmentSection
  ) => {
    if (
      typeof value !==
      "string"
    ) {
      return value.name;
    }


    return (
      sections.find(
        (item) =>
          item._id ===
          value
      )?.name ||
      "-"
    );
  };


  const getTeacherName = (
    value:
      | string
      | AssignmentTeacher
  ) => {
    if (
      typeof value !==
      "string"
    ) {
      return value.name;
    }


    return (
      teachers.find(
        (item) =>
          item._id ===
          value
      )?.name ||
      "-"
    );
  };


  // ============================================
  // FORM DEPENDENCIES
  // ============================================

  const availableClasses =
    useMemo(() => {
      if (
        !formData.sessionId
      ) {
        return [];
      }


      return classes.filter(
        (classData) =>
          classData.sessionId ===
          formData.sessionId
      );
    }, [
      classes,
      formData.sessionId,
    ]);


 const availableSections = useMemo(() => {
  // Session aur Class select nahi hui
  if (
    !formData.sessionId ||
    !formData.classId
  ) {
    return [];
  }

  return sections.filter((section) => {
    // sessionId string bhi ho sakti hai
    // aur populated object bhi
    const sectionSessionId =
      typeof section.sessionId === "string"
        ? section.sessionId
        : section.sessionId?._id;

    // classId string bhi ho sakti hai
    // aur populated object bhi
    const sectionClassId =
      typeof section.classId === "string"
        ? section.classId
        : section.classId?._id;

    return (
      sectionSessionId === formData.sessionId &&
      sectionClassId === formData.classId &&
      section.isActive
    );
  });
}, [
  sections,
  formData.sessionId,
  formData.classId,
]);


  const availableSubjects =
    useMemo(() => {
      if (
        !formData.sessionId
      ) {
        return [];
      }


      return subjects.filter(
        (subject) =>
          subject.sessionId ===
          formData.sessionId &&
          subject.isActive
      );
    }, [
      subjects,
      formData.sessionId,
    ]);


  const availableTeachers =
    useMemo(() => {
      return teachers.filter(
        (teacher) =>
          teacher.isActive
      );
    }, [
      teachers,
    ]);


  // ============================================
  // FILTER DEPENDENCIES
  // ============================================

  const filterClasses =
    useMemo(() => {
      if (
        sessionFilter ===
        "ALL"
      ) {
        return classes;
      }


      return classes.filter(
        (classData) =>
          classData.sessionId ===
          sessionFilter
      );
    }, [
      classes,
      sessionFilter,
    ]);


  const filterSections =
    useMemo(() => {
      return sections.filter(
        (section) => {
          const matchesSession =
            sessionFilter ===
              "ALL" ||
            section.sessionId ===
              sessionFilter;


          const matchesClass =
            classFilter ===
              "ALL" ||
            section.classId ===
              classFilter;


          return (
            matchesSession &&
            matchesClass
          );
        }
      );
    }, [
      sections,
      sessionFilter,
      classFilter,
    ]);


  // ============================================
  // FORM CHANGE
  // ============================================

  const handleInputChange = (
    e:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement
      >
  ) => {
    const {
      name,
      value,
    } = e.target;


    if (
      name ===
      "sessionId"
    ) {
      setFormData(
        (previous) => ({
          ...previous,

          sessionId:
            value,

          classId:
            "",

          sectionId:
            "",

          subjectId:
            "",
        })
      );

      return;
    }


    if (
      name ===
      "classId"
    ) {
      setFormData(
        (previous) => ({
          ...previous,

          classId:
            value,

          sectionId:
            "",
        })
      );

      return;
    }


    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );
  };


  // ============================================
  // OPEN CREATE
  // ============================================

  const openCreateModal =
    () => {
      const currentSession =
        sessions.find(
          (session) =>
            session.isCurrent
        );


      setFormData({
        ...initialFormState,

        sessionId:
          currentSession?._id ||
          sessions[0]?._id ||
          "",
      });


      dispatch(
        clearSubjectAssignmentError()
      );


      setShowCreateModal(
        true
      );
    };


  const closeCreateModal =
    () => {
      setShowCreateModal(
        false
      );


      setFormData(
        initialFormState
      );
    };


  // ============================================
  // CREATE
  // ============================================

  const handleCreateAssignment =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();


      if (
        !formData.sessionId ||
        !formData.classId ||
        !formData.sectionId ||
        !formData.subjectId ||
        !formData.teacherId
      ) {
        showToast(
          "Session, class, section, subject and teacher are required"
        );

        return;
      }


      const periods =
        Number(
          formData.weeklyPeriods
        );


      if (
        !Number.isFinite(
          periods
        ) ||
        periods < 1
      ) {
        showToast(
          "Weekly periods must be greater than 0"
        );

        return;
      }


      const payload:
        CreateSubjectAssignmentPayload =
        {
          sessionId:
            formData.sessionId,

          classId:
            formData.classId,

          sectionId:
            formData.sectionId,

          subjectId:
            formData.subjectId,

          teacherId:
            formData.teacherId,

          weeklyPeriods:
            periods,
        };


      try {
        setSubmitting(
          true
        );


        await dispatch(
          createSubjectAssignment(
            payload
          )
        ).unwrap();


        showToast(
          "Subject assignment created successfully"
        );


        closeCreateModal();


        await dispatch(
          getSubjectAssignments(
            undefined
          )
        ).unwrap();

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to create assignment"
        );

      } finally {
        setSubmitting(
          false
        );
      }
    };


  // ============================================
  // VIEW
  // ============================================

  const handleView =
    async (
      assignmentId: string
    ) => {
      try {
        setActiveMenuId(
          null
        );


        dispatch(
          clearSelectedSubjectAssignment()
        );


        await dispatch(
          getSubjectAssignmentById(
            assignmentId
          )
        ).unwrap();


        setShowDetailsModal(
          true
        );

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to fetch assignment"
        );
      }
    };


  const closeDetailsModal =
    () => {
      setShowDetailsModal(
        false
      );


      dispatch(
        clearSelectedSubjectAssignment()
      );
    };


  // ============================================
  // OPEN EDIT
  //
  // Backend update currently:
  // teacherId + weeklyPeriods only
  // ============================================

  const handleOpenEdit =
    async (
      assignmentId: string
    ) => {
      try {
        setActiveMenuId(
          null
        );


        const assignment =
          await dispatch(
            getSubjectAssignmentById(
              assignmentId
            )
          ).unwrap();


        setFormData({
          sessionId:
            getId(
              assignment.sessionId
            ),

          classId:
            getId(
              assignment.classId
            ),

          sectionId:
            getId(
              assignment.sectionId
            ),

          subjectId:
            getId(
              assignment.subjectId
            ),

          teacherId:
            getId(
              assignment.teacherId
            ),

          weeklyPeriods:
            String(
              assignment.weeklyPeriods
            ),
        });


        setShowEditModal(
          true
        );

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to fetch assignment"
        );
      }
    };


  const closeEditModal =
    () => {
      setShowEditModal(
        false
      );


      setFormData(
        initialFormState
      );


      dispatch(
        clearSelectedSubjectAssignment()
      );
    };


  // ============================================
  // UPDATE
  // ============================================

  const handleUpdateAssignment =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();


      if (
        !selectedAssignment?._id
      ) {
        showToast(
          "Assignment not selected"
        );

        return;
      }


      if (
        !formData.teacherId
      ) {
        showToast(
          "Teacher is required"
        );

        return;
      }


      const periods =
        Number(
          formData.weeklyPeriods
        );


      if (
        !Number.isFinite(
          periods
        ) ||
        periods < 1
      ) {
        showToast(
          "Weekly periods must be greater than 0"
        );

        return;
      }


      const data:
        UpdateSubjectAssignmentPayload =
        {
          teacherId:
            formData.teacherId,

          weeklyPeriods:
            periods,
        };


      try {
        setSubmitting(
          true
        );


        await dispatch(
          updateSubjectAssignment({
            assignmentId:
              selectedAssignment._id,

            data,
          })
        ).unwrap();


        showToast(
          "Subject assignment updated successfully"
        );


        closeEditModal();


        await dispatch(
          getSubjectAssignments(
            undefined
          )
        ).unwrap();

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to update assignment"
        );

      } finally {
        setSubmitting(
          false
        );
      }
    };


  // ============================================
  // STATUS
  // ============================================

  const handleToggleStatus =
    async (
      assignment:
        SubjectAssignmentData
    ) => {
      try {
        setActiveMenuId(
          null
        );


        setStatusActionId(
          assignment._id
        );


        await dispatch(
          updateSubjectAssignmentStatus({
            assignmentId:
              assignment._id,

            isActive:
              !assignment.isActive,
          })
        ).unwrap();


        showToast(
          assignment.isActive
            ? "Assignment marked inactive"
            : "Assignment marked active"
        );

      } catch (err) {
        showToast(
          typeof err ===
            "string"
            ? err
            : "Failed to update assignment status"
        );

      } finally {
        setStatusActionId(
          null
        );
      }
    };


  // ============================================
  // FILTER ASSIGNMENTS
  // ============================================

  const filteredAssignments =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();


      return assignments.filter(
        (assignment) => {
          const sessionId =
            getId(
              assignment.sessionId
            );

          const classId =
            getId(
              assignment.classId
            );

          const sectionId =
            getId(
              assignment.sectionId
            );

          const subjectId =
            getId(
              assignment.subjectId
            );

          const teacherId =
            getId(
              assignment.teacherId
            );


          const text =
            [
              getSessionName(
                assignment.sessionId
              ),

              getClassName(
                assignment.classId
              ),

              getSectionName(
                assignment.sectionId
              ),

              getSubjectName(
                assignment.subjectId
              ),

              getTeacherName(
                assignment.teacherId
              ),
            ]
              .join(
                " "
              )
              .toLowerCase();


          const matchesSearch =
            text.includes(
              search
            );


          const matchesSession =
            sessionFilter ===
              "ALL" ||
            sessionId ===
              sessionFilter;


          const matchesClass =
            classFilter ===
              "ALL" ||
            classId ===
              classFilter;


          const matchesSection =
            sectionFilter ===
              "ALL" ||
            sectionId ===
              sectionFilter;


          const matchesSubject =
            subjectFilter ===
              "ALL" ||
            subjectId ===
              subjectFilter;


          const matchesTeacher =
            teacherFilter ===
              "ALL" ||
            teacherId ===
              teacherFilter;


          const matchesStatus =
            statusFilter ===
              "ALL" ||

            (
              statusFilter ===
                "ACTIVE" &&
              assignment.isActive
            ) ||

            (
              statusFilter ===
                "INACTIVE" &&
              !assignment.isActive
            );


          return (
            matchesSearch &&
            matchesSession &&
            matchesClass &&
            matchesSection &&
            matchesSubject &&
            matchesTeacher &&
            matchesStatus
          );
        }
      );
    }, [
      assignments,
      sessions,
      classes,
      sections,
      subjects,
      teachers,
      searchQuery,
      sessionFilter,
      classFilter,
      sectionFilter,
      subjectFilter,
      teacherFilter,
      statusFilter,
    ]);


  // ============================================
  // FILTER CHANGE DEPENDENCIES
  // ============================================

  useEffect(() => {
    setClassFilter(
      "ALL"
    );

    setSectionFilter(
      "ALL"
    );
  }, [
    sessionFilter,
  ]);


  useEffect(() => {
    setSectionFilter(
      "ALL"
    );
  }, [
    classFilter,
  ]);


  // ============================================
  // PAGINATION
  // ============================================

  const totalPages =
    Math.ceil(
      filteredAssignments.length /
        itemsPerPage
    );


  const paginatedAssignments =
    filteredAssignments.slice(
      (currentPage - 1) *
        itemsPerPage,

      currentPage *
        itemsPerPage
    );


  useEffect(() => {
    setCurrentPage(
      1
    );
  }, [
    searchQuery,
    sessionFilter,
    classFilter,
    sectionFilter,
    subjectFilter,
    teacherFilter,
    statusFilter,
  ]);


  // ============================================
  // STATS
  // ============================================

  const totalAssignments =
    assignments.length;


  const activeAssignments =
    assignments.filter(
      (assignment) =>
        assignment.isActive
    ).length;


  const inactiveAssignments =
    assignments.filter(
      (assignment) =>
        !assignment.isActive
    ).length;


  const totalPeriods =
    assignments.reduce(
      (
        total,
        assignment
      ) =>
        total +
        assignment.weeklyPeriods,

      0
    );


  // ============================================
  // RESET FILTERS
  // ============================================

  const resetFilters =
    () => {
      setSearchQuery(
        ""
      );

      setSessionFilter(
        "ALL"
      );

      setClassFilter(
        "ALL"
      );

      setSectionFilter(
        "ALL"
      );

      setSubjectFilter(
        "ALL"
      );

      setTeacherFilter(
        "ALL"
      );

      setStatusFilter(
        "ALL"
      );
    };

    useEffect(() => {
  console.log("SESSIONS:", sessions);
  console.log("CLASSES:", classes);
  console.log("SECTIONS:", sections);
  console.log("SUBJECTS:", subjects);
  console.log("TEACHERS:", teachers);
}, [
  sessions,
  classes,
  sections,
  subjects,
  teachers,
]);


  // ============================================
  // LOADING
  // ============================================

  if (
    loading &&
    assignments.length ===
      0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="text-center">

          <Icon
            icon="lucide:loader-2"
            className="mx-auto animate-spin text-4xl text-blue-600"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading subject assignments...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-8">

      {/* ========================================
          TOAST
      ======================================== */}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          {toastMessage}
        </div>
      )}


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <div className="flex items-center gap-2 text-sm text-gray-500">

            <span>
              Academics
            </span>

            <Icon
              icon="lucide:chevron-right"
            />

            <span className="font-medium text-gray-900">
              Subject Assignments
            </span>

          </div>


          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Subject Assignments
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Assign subjects and teachers to class sections.
          </p>

        </div>


        <button
          onClick={
            openCreateModal
          }
          disabled={
            sessions.length ===
              0 ||
            classes.length ===
              0 ||
            sections.length ===
              0 ||
            subjects.length ===
              0 ||
            teachers.length ===
              0
          }
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Icon
            icon="lucide:plus"
          />

          Add Assignment

        </button>

      </div>


      {/* ========================================
          STATS
      ======================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Assignments"
          value={
            totalAssignments
          }
          icon="lucide:book-user"
        />


        <StatCard
          title="Active Assignments"
          value={
            activeAssignments
          }
          icon="lucide:circle-check"
        />


        <StatCard
          title="Inactive Assignments"
          value={
            inactiveAssignments
          }
          icon="lucide:circle-off"
        />


        <StatCard
          title="Weekly Periods"
          value={
            totalPeriods
          }
          icon="lucide:calendar-days"
        />

      </div>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <span>
            {error}
          </span>


          <button
            onClick={() =>
              dispatch(
                clearSubjectAssignmentError()
              )
            }
          >
            <Icon
              icon="lucide:x"
            />
          </button>

        </div>
      )}


      {/* ========================================
          TABLE CARD
      ======================================== */}

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* FILTERS */}

        <div className="border-b border-gray-200 p-5">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">

            <div className="relative">

              <Icon
                icon="lucide:search"
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search assignment..."
                className="min-h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm outline-none focus:border-blue-600"
              />

            </div>


            <select
              value={
                sessionFilter
              }
              onChange={(e) =>
                setSessionFilter(
                  e.target.value
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              <option value="ALL">
                All Sessions
              </option>

              {sessions.map(
                (session) => (
                  <option
                    key={
                      session._id
                    }
                    value={
                      session._id
                    }
                  >
                    {session.name}
                  </option>
                )
              )}

            </select>


            <select
              value={
                classFilter
              }
              onChange={(e) =>
                setClassFilter(
                  e.target.value
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              <option value="ALL">
                All Classes
              </option>

              {filterClasses.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>


            <select
              value={
                sectionFilter
              }
              onChange={(e) =>
                setSectionFilter(
                  e.target.value
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              <option value="ALL">
                All Sections
              </option>

              {filterSections.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>


            <select
              value={
                subjectFilter
              }
              onChange={(e) =>
                setSubjectFilter(
                  e.target.value
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              <option value="ALL">
                All Subjects
              </option>

              {subjects.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>


            <select
              value={
                teacherFilter
              }
              onChange={(e) =>
                setTeacherFilter(
                  e.target.value
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              <option value="ALL">
                All Teachers
              </option>

              {teachers.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>


            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "ALL"
                    | "ACTIVE"
                    | "INACTIVE"
                )
              }
              className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
            >

              <option value="ALL">
                All Status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

            </select>


            <button
              onClick={
                resetFilters
              }
              className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium hover:bg-gray-50"
            >
              Reset Filters
            </button>

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px] text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">

              <tr>

                <th className="px-5 py-4 text-left font-semibold">
                  Subject
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Class
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Section
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Teacher
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Session
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Weekly Periods
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-200">

              {paginatedAssignments.map(
                (assignment) => (
                  <tr
                    key={
                      assignment._id
                    }
                    className="hover:bg-gray-50"
                  >

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {getSubjectName(
                        assignment.subjectId
                      )}
                    </td>


                    <td className="px-5 py-4 text-gray-600">
                      {getClassName(
                        assignment.classId
                      )}
                    </td>


                    <td className="px-5 py-4 text-gray-600">
                      Section{" "}
                      {getSectionName(
                        assignment.sectionId
                      )}
                    </td>


                    <td className="px-5 py-4 text-gray-700">
                      {getTeacherName(
                        assignment.teacherId
                      )}
                    </td>


                    <td className="px-5 py-4 text-gray-600">
                      {getSessionName(
                        assignment.sessionId
                      )}
                    </td>


                    <td className="px-5 py-4 font-semibold text-gray-700">
                      {assignment.weeklyPeriods}
                    </td>


                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          assignment.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {assignment.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>


                    <td className="relative px-5 py-4 text-right">

                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId ===
                              assignment._id
                              ? null
                              : assignment._id
                          )
                        }
                        className="rounded-lg p-2 hover:bg-gray-100"
                      >
                        <Icon
                          icon="lucide:ellipsis-vertical"
                        />
                      </button>


                      {activeMenuId ===
                        assignment._id && (
                        <div className="absolute right-5 top-12 z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-xl">

                          <button
                            onClick={() =>
                              handleView(
                                assignment._id
                              )
                            }
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                          >
                            <Icon
                              icon="lucide:eye"
                            />

                            View
                          </button>


                          <button
                            onClick={() =>
                              handleOpenEdit(
                                assignment._id
                              )
                            }
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
                          >
                            <Icon
                              icon="lucide:pencil"
                            />

                            Edit
                          </button>


                          <button
                            onClick={() =>
                              handleToggleStatus(
                                assignment
                              )
                            }
                            disabled={
                              statusActionId ===
                              assignment._id
                            }
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Icon
                              icon={
                                assignment.isActive
                                  ? "lucide:circle-off"
                                  : "lucide:circle-check"
                              }
                            />

                            {assignment.isActive
                              ? "Make Inactive"
                              : "Make Active"}
                          </button>

                        </div>
                      )}

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>


          {paginatedAssignments.length ===
            0 && (
            <div className="p-12 text-center">

              <Icon
                icon="lucide:book-user"
                className="mx-auto text-4xl text-gray-400"
              />

              <h3 className="mt-3 font-semibold text-gray-900">
                No subject assignments found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create an assignment or change the filters.
              </p>

            </div>
          )}

        </div>


        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            {filteredAssignments.length} assignments
          </p>


          <div className="flex gap-2">

            <button
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page - 1
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>


            <span className="flex min-w-10 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white">
              {currentPage}
            </span>


            <button
              disabled={
                totalPages ===
                  0 ||
                currentPage ===
                  totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    page + 1
                )
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </section>


      {/* CREATE */}

      {showCreateModal && (
        <AssignmentFormModal
          title="Add Subject Assignment"
          submitLabel="Create Assignment"
          formData={
            formData
          }
          sessions={
            sessions
          }
          classes={
            availableClasses
          }
          sections={
            availableSections
          }
          subjects={
            availableSubjects
          }
          teachers={
            availableTeachers
          }
          submitting={
            submitting
          }
          editMode={
            false
          }
          onChange={
            handleInputChange
          }
          onClose={
            closeCreateModal
          }
          onSubmit={
            handleCreateAssignment
          }
        />
      )}


      {/* EDIT */}

      {showEditModal && (
        <AssignmentFormModal
          title="Edit Subject Assignment"
          submitLabel="Save Changes"
          formData={
            formData
          }
          sessions={
            sessions
          }
          classes={
            availableClasses
          }
          sections={
            availableSections
          }
          subjects={
            availableSubjects
          }
          teachers={
            availableTeachers
          }
          submitting={
            submitting
          }
          editMode={
            true
          }
          onChange={
            handleInputChange
          }
          onClose={
            closeEditModal
          }
          onSubmit={
            handleUpdateAssignment
          }
        />
      )}


      {/* DETAILS */}

      {showDetailsModal &&
        selectedAssignment && (
          <AssignmentDetailsModal
            assignment={
              selectedAssignment
            }
            onClose={
              closeDetailsModal
            }
          />
        )}

    </div>
  );
};


// ============================================
// STAT CARD
// ============================================

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;

  value:
    string | number;

  icon: string;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>

        </div>


        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">

          <Icon
            icon={icon}
            className="text-xl"
          />

        </div>

      </div>

    </div>
  );
};


// ============================================
// FORM MODAL
// ============================================

interface AssignmentFormModalProps {
  title: string;

  submitLabel: string;

  formData:
    AssignmentFormState;

  sessions: {
    _id: string;
    name: string;
    isCurrent: boolean;
  }[];

  classes: {
    _id: string;
    name: string;
    sessionId: string;
  }[];

  sections: {
    _id: string;
    name: string;
  }[];

  subjects: {
    _id: string;
    name: string;
  }[];

  teachers: {
    _id: string;
    name: string;
    employeeId: string;
  }[];

  submitting:
    boolean;

  editMode:
    boolean;

  onChange: (
    e:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement
      >
  ) => void;

  onClose:
    () => void;

  onSubmit: (
    e: React.FormEvent
  ) => void;
}


const AssignmentFormModal = ({
  title,
  submitLabel,
  formData,
  sessions,
  classes,
  sections,
  subjects,
  teachers,
  submitting,
  editMode,
  onChange,
  onClose,
  onSubmit,
}: AssignmentFormModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Configure subject, class, section and teacher mapping.
            </p>

          </div>


          <button
            onClick={
              onClose
            }
          >
            <Icon
              icon="lucide:x"
              className="text-xl"
            />
          </button>

        </div>


        <form
          onSubmit={
            onSubmit
          }
        >

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <SelectField
              label="Academic Session"
              name="sessionId"
              value={
                formData.sessionId
              }
              disabled={
                editMode
              }
              onChange={
                onChange
              }
            >
              <option value="">
                Select Session
              </option>

              {sessions.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </SelectField>


            <SelectField
              label="Class"
              name="classId"
              value={
                formData.classId
              }
              disabled={
                editMode ||
                !formData.sessionId
              }
              onChange={
                onChange
              }
            >
              <option value="">
                Select Class
              </option>

              {classes.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </SelectField>


            <SelectField
              label="Section"
              name="sectionId"
              value={
                formData.sectionId
              }
              disabled={
                editMode ||
                !formData.classId
              }
              onChange={
                onChange
              }
            >
              <option value="">
                Select Section
              </option>

              {sections.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </SelectField>


            <SelectField
              label="Subject"
              name="subjectId"
              value={
                formData.subjectId
              }
              disabled={
                editMode ||
                !formData.sessionId
              }
              onChange={
                onChange
              }
            >
              <option value="">
                Select Subject
              </option>

              {subjects.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </SelectField>


            <SelectField
              label="Teacher"
              name="teacherId"
              value={
                formData.teacherId
              }
              onChange={
                onChange
              }
            >
              <option value="">
                Select Teacher
              </option>

              {teachers.map(
                (item) => (
                  <option
                    key={
                      item._id
                    }
                    value={
                      item._id
                    }
                  >
                    {item.name} -{" "}
                    {item.employeeId}
                  </option>
                )
              )}
            </SelectField>


            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Weekly Periods *
              </label>

              <input
                type="number"
                min="1"
                name="weeklyPeriods"
                value={
                  formData.weeklyPeriods
                }
                onChange={
                  onChange
                }
                placeholder="Example: 6"
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-600"
              />

            </div>

          </div>


          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                submitting
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >

              {submitting && (
                <Icon
                  icon="lucide:loader-2"
                  className="animate-spin"
                />
              )}

              {submitLabel}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


// ============================================
// SELECT FIELD
// ============================================

const SelectField = ({
  label,
  name,
  value,
  disabled = false,
  onChange,
  children,
}: {
  label: string;

  name: string;

  value: string;

  disabled?: boolean;

  onChange: (
    e:
      React.ChangeEvent<HTMLSelectElement>
  ) => void;

  children:
    React.ReactNode;
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label} *
      </label>


      <select
        name={
          name
        }
        value={
          value
        }
        disabled={
          disabled
        }
        onChange={
          onChange
        }
        className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 disabled:bg-gray-100"
      >
        {children}
      </select>

    </div>
  );
};


// ============================================
// DETAILS MODAL
// ============================================

const AssignmentDetailsModal = ({
  assignment,
  onClose,
}: {
  assignment:
    SubjectAssignmentData;

  onClose:
    () => void;
}) => {
  const getValue = (
    value:
      | string
      | {
          name?: string;
          employeeId?: string;
        }
  ) => {
    if (
      typeof value ===
      "string"
    ) {
      return value;
    }


    return (
      value.name ||
      value.employeeId ||
      "-"
    );
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

          <h2 className="text-xl font-bold text-gray-900">
            Assignment Details
          </h2>


          <button
            onClick={
              onClose
            }
          >
            <Icon
              icon="lucide:x"
            />
          </button>

        </div>


        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

          <Detail
            label="Session"
            value={getValue(
              assignment.sessionId
            )}
          />

          <Detail
            label="Subject"
            value={getValue(
              assignment.subjectId
            )}
          />

          <Detail
            label="Class"
            value={getValue(
              assignment.classId
            )}
          />

          <Detail
            label="Section"
            value={getValue(
              assignment.sectionId
            )}
          />

          <Detail
            label="Teacher"
            value={getValue(
              assignment.teacherId
            )}
          />

          <Detail
            label="Weekly Periods"
            value={String(
              assignment.weeklyPeriods
            )}
          />

          <Detail
            label="Status"
            value={
              assignment.isActive
                ? "Active"
                : "Inactive"
            }
          />

        </div>


        <div className="flex justify-end border-t border-gray-200 px-6 py-4">

          <button
            onClick={
              onClose
            }
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};


// ============================================
// DETAIL
// ============================================

const Detail = ({
  label,
  value,
}: {
  label: string;

  value: string;
}) => {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value}
      </p>

    </div>
  );
};


export default SubjectAssignments;