// import { useEffect, useMemo, useState } from "react";

// import {
//   ArrowRight,
//   CheckCircle2,
//   RefreshCcw,
//   Search,
//   Users,
//   XCircle,
// } from "lucide-react";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSectionsApi } from "../../../features/academic/sections/section.api";

// import type { SectionData } from "../../../features/academic/sections/section.types";

// import {
//   bulkPromoteStudents,
//   clearPromotionPreview,
//   clearPromotionSummary,
//   getPromotionCandidates,
//   previewBulkPromotion,
// } from "../../../features/student/studentPromotion.slice";

// import type {
//   BulkStudentPromotionRequest,
//   PromotionStudentRow,
//   RollAssignmentMode,
//   StudentPromotionDecision,
// } from "../../../features/student/studentPromotion.types";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// // =====================================================
// // HELPERS
// // =====================================================

// const requiresTarget = (decision: StudentPromotionDecision): boolean => {
//   return decision === "PROMOTED" || decision === "RETAINED";
// };

// const getErrorMessage = (error: unknown): string => {
//   if (typeof error === "string") {
//     return error;
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   if (typeof error === "object" && error !== null && "response" in error) {
//     const apiError = error as {
//       response?: {
//         data?: {
//           message?: string;
//         };
//       };
//     };

//     return apiError.response?.data?.message || "Something went wrong.";
//   }

//   return "Something went wrong.";
// };

// // =====================================================
// // COMPONENT
// // =====================================================

// const BulkPromotion = () => {
//   const dispatch = useAppDispatch();

//   // ===================================================
//   // REDUX
//   // ===================================================

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes } = useAppSelector((state) => state.classes);

//   const {
//     preview,
//     promotionSummary,
//     candidatesLoading,
//     previewLoading,
//     promotionLoading,
//     error,
//   } = useAppSelector((state) => state.studentPromotion);

//   // ===================================================
//   // SOURCE
//   // ===================================================

//   const [sourceSessionId, setSourceSessionId] = useState("");

//   const [sourceClassId, setSourceClassId] = useState("");

//   const [sourceSectionId, setSourceSectionId] = useState("");

//   const [sourceSections, setSourceSections] = useState<SectionData[]>([]);

//   const [sourceSectionsLoading, setSourceSectionsLoading] = useState(false);

//   // ===================================================
//   // TARGET
//   // ===================================================

//   const [targetSessionId, setTargetSessionId] = useState("");

//   const [defaultTargetClassId, setDefaultTargetClassId] = useState("");

//   const [defaultTargetSectionId, setDefaultTargetSectionId] = useState("");

//   const [defaultTargetSections, setDefaultTargetSections] = useState<
//     SectionData[]
//   >([]);

//   const [defaultTargetSectionsLoading, setDefaultTargetSectionsLoading] =
//     useState(false);

//   // ===================================================
//   // SECTIONS CACHE
//   //
//   // Key   = classId
//   // Value = sections of that class in target session
//   // ===================================================

//   const [sectionsByClass, setSectionsByClass] = useState<
//     Record<string, SectionData[]>
//   >({});

//   const [loadingSectionClassIds, setLoadingSectionClassIds] = useState<
//     string[]
//   >([]);

//   // ===================================================
//   // TABLE
//   // ===================================================

//   const [rows, setRows] = useState<PromotionStudentRow[]>([]);

//   const [search, setSearch] = useState("");

//   const [rollMode, setRollMode] = useState<RollAssignmentMode>("AUTO");

//   // ===================================================
//   // MESSAGES
//   // ===================================================

//   const [localError, setLocalError] = useState<string | null>(null);

//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // ===================================================
//   // INITIAL DATA
//   // ===================================================

//   useEffect(() => {
//     dispatch(getSessions());

//     dispatch(getClasses());
//   }, [dispatch]);

//   // ===================================================
//   // CURRENT SESSION DEFAULT
//   // ===================================================

//   useEffect(() => {
//     if (sourceSessionId || sessions.length === 0) {
//       return;
//     }

//     const currentSession = sessions.find((session) => session.isCurrent);

//     if (currentSession) {
//       setSourceSessionId(currentSession._id);
//     }
//   }, [sessions, sourceSessionId]);

//   // ===================================================
//   // SOURCE CLASSES
//   // ===================================================

//   const sourceClasses = useMemo(() => {
//     return classes.filter(
//       (classItem) => classItem.sessionId === sourceSessionId,
//     );
//   }, [classes, sourceSessionId]);

//   // ===================================================
//   // TARGET CLASSES
//   // ===================================================

//   const targetClasses = useMemo(() => {
//     return classes.filter(
//       (classItem) => classItem.sessionId === targetSessionId,
//     );
//   }, [classes, targetSessionId]);

//   // ===================================================
//   // LOAD SOURCE SECTIONS
//   // ===================================================

//   useEffect(() => {
//     let active = true;

//     const loadSourceSections = async () => {
//       setSourceSectionId("");

//       setSourceSections([]);

//       if (!sourceSessionId || !sourceClassId) {
//         return;
//       }

//       try {
//         setSourceSectionsLoading(true);

//         const result = await getSectionsApi({
//           sessionId: sourceSessionId,

//           classId: sourceClassId,
//         });

//         if (active) {
//           setSourceSections(result);
//         }
//       } catch (error) {
//         if (active) {
//           setLocalError(getErrorMessage(error));
//         }
//       } finally {
//         if (active) {
//           setSourceSectionsLoading(false);
//         }
//       }
//     };

//     void loadSourceSections();

//     return () => {
//       active = false;
//     };
//   }, [sourceSessionId, sourceClassId]);

//   // ===================================================
//   // LOAD DEFAULT TARGET SECTIONS
//   // ===================================================

//   useEffect(() => {
//     let active = true;

//     const loadTargetSections = async () => {
//       setDefaultTargetSectionId("");

//       setDefaultTargetSections([]);

//       if (!targetSessionId || !defaultTargetClassId) {
//         return;
//       }

//       try {
//         setDefaultTargetSectionsLoading(true);

//         const result = await getSectionsApi({
//           sessionId: targetSessionId,

//           classId: defaultTargetClassId,
//         });

//         if (!active) {
//           return;
//         }

//         setDefaultTargetSections(result);

//         setSectionsByClass((current) => ({
//           ...current,

//           [defaultTargetClassId]: result,
//         }));
//       } catch (error) {
//         if (active) {
//           setLocalError(getErrorMessage(error));
//         }
//       } finally {
//         if (active) {
//           setDefaultTargetSectionsLoading(false);
//         }
//       }
//     };

//     void loadTargetSections();

//     return () => {
//       active = false;
//     };
//   }, [targetSessionId, defaultTargetClassId]);

//   // ===================================================
//   // LOAD SECTIONS FOR INDIVIDUAL TARGET CLASS
//   // ===================================================

//   const loadSectionsForClass = async (classId: string): Promise<void> => {
//     if (!targetSessionId || !classId) {
//       return;
//     }

//     if (sectionsByClass[classId]) {
//       return;
//     }

//     if (loadingSectionClassIds.includes(classId)) {
//       return;
//     }

//     try {
//       setLoadingSectionClassIds((current) => [...current, classId]);

//       const result = await getSectionsApi({
//         sessionId: targetSessionId,

//         classId,
//       });

//       setSectionsByClass((current) => ({
//         ...current,

//         [classId]: result,
//       }));
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     } finally {
//       setLoadingSectionClassIds((current) =>
//         current.filter((id) => id !== classId),
//       );
//     }
//   };

//   // ===================================================
//   // SOURCE SESSION CHANGE
//   // ===================================================

//   const handleSourceSessionChange = (value: string) => {
//     setSourceSessionId(value);

//     setSourceClassId("");

//     setSourceSectionId("");

//     setSourceSections([]);

//     setRows([]);

//     setSearch("");

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // SOURCE CLASS CHANGE
//   // ===================================================

//   const handleSourceClassChange = (value: string) => {
//     setSourceClassId(value);

//     setSourceSectionId("");

//     setSourceSections([]);

//     setRows([]);

//     setSearch("");

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // SOURCE SECTION CHANGE
//   // ===================================================

//   const handleSourceSectionChange = (value: string) => {
//     setSourceSectionId(value);

//     setRows([]);

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // TARGET SESSION CHANGE
//   // ===================================================

//   const handleTargetSessionChange = (value: string) => {
//     setTargetSessionId(value);

//     setDefaultTargetClassId("");

//     setDefaultTargetSectionId("");

//     setDefaultTargetSections([]);

//     setSectionsByClass({});

//     setLoadingSectionClassIds([]);

//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         delete updated.targetClassId;

//         delete updated.targetSectionId;

//         delete updated.rollNumber;

//         return updated;
//       }),
//     );

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // DEFAULT TARGET CLASS CHANGE
//   // ===================================================

//   const handleDefaultTargetClassChange = (value: string) => {
//     setDefaultTargetClassId(value);

//     setDefaultTargetSectionId("");

//     setDefaultTargetSections([]);

//     setLocalError(null);

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // DEFAULT TARGET SECTION CHANGE
//   // ===================================================

//   const handleDefaultTargetSectionChange = (value: string) => {
//     setDefaultTargetSectionId(value);

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // LOAD CANDIDATES
//   // ===================================================

//   const handleLoadStudents = async () => {
//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());

//     if (!sourceSessionId) {
//       setLocalError("Please select source session.");

//       return;
//     }

//     if (!sourceClassId) {
//       setLocalError("Please select source class.");

//       return;
//     }

//     try {
//       const filters: {
//         sessionId: string;
//         classId: string;
//         sectionId?: string;
//       } = {
//         sessionId: sourceSessionId,

//         classId: sourceClassId,
//       };

//       if (sourceSectionId) {
//         filters.sectionId = sourceSectionId;
//       }

//       const result = await dispatch(getPromotionCandidates(filters)).unwrap();

//       const mappedRows: PromotionStudentRow[] = result.map((candidate) => {
//         const row: PromotionStudentRow = {
//           studentId: candidate.studentId._id,

//           admissionNumber: candidate.studentId.admissionNumber,

//           name: candidate.studentId.name,

//           currentClassId: candidate.classId._id,

//           currentClassName: candidate.classId.name,

//           currentSectionId: candidate.sectionId._id,

//           currentSectionName: candidate.sectionId.name,

//           selected: true,

//           decision: "PROMOTED",
//         };

//         if (candidate.rollNumber !== undefined) {
//           row.currentRollNumber = candidate.rollNumber;
//         }

//         return row;
//       });

//       setRows(mappedRows);

//       if (mappedRows.length === 0) {
//         setLocalError("No active promotion candidates found.");
//       }
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     }
//   };

//   // ===================================================
//   // APPLY TARGET TO SELECTED
//   // ===================================================

//   const handleApplyTarget = () => {
//     setLocalError(null);

//     setSuccessMessage(null);

//     if (!targetSessionId) {
//       setLocalError("Please select target session.");

//       return;
//     }

//     if (targetSessionId === sourceSessionId) {
//       setLocalError("Source and target sessions must be different.");

//       return;
//     }

//     if (!defaultTargetClassId) {
//       setLocalError("Please select target class.");

//       return;
//     }

//     if (!defaultTargetSectionId) {
//       setLocalError("Please select target section.");

//       return;
//     }

//     let nextAutoRoll = 1;

//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (!row.selected || !requiresTarget(row.decision)) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,

//           targetClassId: defaultTargetClassId,

//           targetSectionId: defaultTargetSectionId,
//         };

//         if (rollMode === "AUTO") {
//           updated.rollNumber = nextAutoRoll;

//           nextAutoRoll += 1;
//         }

//         if (rollMode === "KEEP_PREVIOUS") {
//           if (row.currentRollNumber !== undefined) {
//             updated.rollNumber = row.currentRollNumber;
//           } else {
//             delete updated.rollNumber;
//           }
//         }

//         if (rollMode === "MANUAL") {
//           delete updated.rollNumber;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // SELECT COUNT
//   // ===================================================

//   const selectedCount = rows.filter((row) => row.selected).length;

//   const allSelected = rows.length > 0 && selectedCount === rows.length;

//   // ===================================================
//   // SELECT ALL
//   // ===================================================

//   const toggleAll = () => {
//     setRows((currentRows) =>
//       currentRows.map((row) => ({
//         ...row,

//         selected: !allSelected,
//       })),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // UPDATE ROW
//   // ===================================================

//   const updateRow = (
//     studentId: string,
//     updates: Partial<PromotionStudentRow>,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) =>
//         row.studentId === studentId
//           ? {
//               ...row,
//               ...updates,
//             }
//           : row,
//       ),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW SELECT
//   // ===================================================

//   const handleRowSelect = (studentId: string, selected: boolean) => {
//     updateRow(studentId, {
//       selected,
//     });
//   };

//   // ===================================================
//   // DECISION CHANGE
//   // ===================================================

//   const handleDecisionChange = (
//     studentId: string,
//     decision: StudentPromotionDecision,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,

//           decision,
//         };

//         if (!requiresTarget(decision)) {
//           delete updated.targetClassId;

//           delete updated.targetSectionId;

//           delete updated.rollNumber;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW TARGET CLASS CHANGE
//   // ===================================================

//   const handleRowTargetClassChange = async (
//     studentId: string,
//     classId: string,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,

//           targetClassId: classId,
//         };

//         delete updated.targetSectionId;

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());

//     if (classId) {
//       await loadSectionsForClass(classId);
//     }
//   };

//   // ===================================================
//   // ROW TARGET SECTION CHANGE
//   // ===================================================

//   const handleRowTargetSectionChange = (
//     studentId: string,
//     sectionId: string,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         if (sectionId) {
//           updated.targetSectionId = sectionId;
//         } else {
//           delete updated.targetSectionId;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW ROLL CHANGE
//   // ===================================================

//   const handleRollChange = (studentId: string, value: string) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         if (!value) {
//           delete updated.rollNumber;

//           return updated;
//         }

//         const rollNumber = Number(value);

//         updated.rollNumber = rollNumber;

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW REMARKS CHANGE
//   // ===================================================

//   const handleRemarksChange = (studentId: string, remarks: string) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         if (remarks) {
//           updated.remarks = remarks;
//         } else {
//           delete updated.remarks;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // BUILD PAYLOAD
//   // ===================================================

//   const buildPayload = (): BulkStudentPromotionRequest | null => {
//     setLocalError(null);

//     if (!sourceSessionId) {
//       setLocalError("Source session is required.");

//       return null;
//     }

//     if (!targetSessionId) {
//       setLocalError("Target session is required.");

//       return null;
//     }

//     if (sourceSessionId === targetSessionId) {
//       setLocalError("Source and target sessions must be different.");

//       return null;
//     }

//     const selectedRows = rows.filter((row) => row.selected);

//     if (selectedRows.length === 0) {
//       setLocalError("Please select at least one student.");

//       return null;
//     }

//     for (const row of selectedRows) {
//       if (requiresTarget(row.decision)) {
//         if (!row.targetClassId) {
//           setLocalError(`Target class is required for ${row.name}.`);

//           return null;
//         }

//         if (!row.targetSectionId) {
//           setLocalError(`Target section is required for ${row.name}.`);

//           return null;
//         }

//         if (row.rollNumber !== undefined) {
//           if (!Number.isInteger(row.rollNumber) || row.rollNumber < 1) {
//             setLocalError(
//               `Roll number must be a positive whole number for ${row.name}.`,
//             );

//             return null;
//           }
//         }
//       }
//     }

//     const students = selectedRows.map((row) => {
//       const item: {
//         studentId: string;

//         decision: StudentPromotionDecision;

//         targetClassId?: string;

//         targetSectionId?: string;

//         rollNumber?: number;

//         remarks?: string;
//       } = {
//         studentId: row.studentId,

//         decision: row.decision,
//       };

//       if (requiresTarget(row.decision)) {
//         if (row.targetClassId) {
//           item.targetClassId = row.targetClassId;
//         }

//         if (row.targetSectionId) {
//           item.targetSectionId = row.targetSectionId;
//         }

//         if (row.rollNumber !== undefined) {
//           item.rollNumber = row.rollNumber;
//         }
//       }

//       if (row.remarks && row.remarks.trim()) {
//         item.remarks = row.remarks.trim();
//       }

//       return item;
//     });

//     return {
//       sourceSessionId,

//       targetSessionId,

//       students,
//     };
//   };

//   // ===================================================
//   // PREVIEW
//   // ===================================================

//   const handlePreview = async () => {
//     setSuccessMessage(null);

//     const payload = buildPayload();

//     if (!payload) {
//       return;
//     }

//     try {
//       await dispatch(previewBulkPromotion(payload)).unwrap();
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     }
//   };

//   // ===================================================
//   // EXECUTE PROMOTION
//   // ===================================================

//   const handlePromote = async () => {
//     setLocalError(null);

//     setSuccessMessage(null);

//     if (!preview || !preview.canPromote) {
//       setLocalError("Please run a successful promotion preview first.");

//       return;
//     }

//     const payload = buildPayload();

//     if (!payload) {
//       return;
//     }

//     const confirmed = window.confirm(
//       `Promote ${payload.students.length} selected student(s)? This will create their next academic enrollment.`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       const result = await dispatch(bulkPromoteStudents(payload)).unwrap();

//       setSuccessMessage(
//         `Promotion completed. Promoted: ${result.promoted}, Retained: ${result.retained}, Transferred: ${result.transferred}, Left: ${result.left}, Graduated: ${result.graduated}, Failed: ${result.failed}.`,
//       );

//       setRows([]);

//       setSearch("");

//       dispatch(clearPromotionPreview());
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     }
//   };

//   // ===================================================
//   // FILTERED ROWS
//   // ===================================================

//   const filteredRows = useMemo(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) {
//       return rows;
//     }

//     return rows.filter(
//       (row) =>
//         row.name.toLowerCase().includes(value) ||
//         row.admissionNumber.toLowerCase().includes(value),
//     );
//   }, [rows, search]);

//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-6">
//       <div className="mx-auto max-w-[1600px] space-y-6">
//         {/* HEADER */}

//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               Bulk Student Promotion
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Promote, retain, transfer, leave or graduate students for the next
//               academic session.
//             </p>
//           </div>

//           <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
//             <Users size={18} />
//             {selectedCount} selected
//           </div>
//         </div>

//         {/* ERROR */}

//         {(localError || error) && (
//           <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             <XCircle size={19} className="mt-0.5 shrink-0" />

//             <span>{localError || error}</span>
//           </div>
//         )}

//         {/* SUCCESS */}

//         {successMessage && (
//           <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//             <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

//             <span>{successMessage}</span>
//           </div>
//         )}

//         {/* SOURCE + TARGET */}

//         <div className="grid gap-5 xl:grid-cols-2">
//           {/* SOURCE */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-5 text-base font-semibold text-slate-900">
//               From
//             </h2>

//             <div className="grid gap-4 md:grid-cols-3">
//               {/* SOURCE SESSION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Session
//                 </label>

//                 <select
//                   value={sourceSessionId}
//                   onChange={(event) =>
//                     handleSourceSessionChange(event.target.value)
//                   }
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="">Select session</option>

//                   {sessions.map((session) => (
//                     <option key={session._id} value={session._id}>
//                       {session.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* SOURCE CLASS */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Class
//                 </label>

//                 <select
//                   value={sourceClassId}
//                   onChange={(event) =>
//                     handleSourceClassChange(event.target.value)
//                   }
//                   disabled={!sourceSessionId}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">Select class</option>

//                   {sourceClasses.map((classItem) => (
//                     <option key={classItem._id} value={classItem._id}>
//                       {classItem.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* SOURCE SECTION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Section
//                 </label>

//                 <select
//                   value={sourceSectionId}
//                   onChange={(event) =>
//                     handleSourceSectionChange(event.target.value)
//                   }
//                   disabled={!sourceClassId || sourceSectionsLoading}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">
//                     {sourceSectionsLoading ? "Loading..." : "All Sections"}
//                   </option>

//                   {sourceSections.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleLoadStudents}
//               disabled={candidatesLoading}
//               className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <RefreshCcw
//                 size={17}
//                 className={candidatesLoading ? "animate-spin" : ""}
//               />

//               {candidatesLoading ? "Loading..." : "Load Students"}
//             </button>
//           </div>

//           {/* TARGET */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-5 text-base font-semibold text-slate-900">To</h2>

//             <div className="grid gap-4 md:grid-cols-3">
//               {/* TARGET SESSION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Session
//                 </label>

//                 <select
//                   value={targetSessionId}
//                   onChange={(event) =>
//                     handleTargetSessionChange(event.target.value)
//                   }
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="">Select session</option>

//                   {sessions
//                     .filter((session) => session._id !== sourceSessionId)
//                     .map((session) => (
//                       <option key={session._id} value={session._id}>
//                         {session.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>

//               {/* DEFAULT TARGET CLASS */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Class
//                 </label>

//                 <select
//                   value={defaultTargetClassId}
//                   onChange={(event) =>
//                     handleDefaultTargetClassChange(event.target.value)
//                   }
//                   disabled={!targetSessionId}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">Select class</option>

//                   {targetClasses.map((classItem) => (
//                     <option key={classItem._id} value={classItem._id}>
//                       {classItem.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* DEFAULT TARGET SECTION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Section
//                 </label>

//                 <select
//                   value={defaultTargetSectionId}
//                   onChange={(event) =>
//                     handleDefaultTargetSectionChange(event.target.value)
//                   }
//                   disabled={
//                     !defaultTargetClassId || defaultTargetSectionsLoading
//                   }
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">
//                     {defaultTargetSectionsLoading
//                       ? "Loading..."
//                       : "Select section"}
//                   </option>

//                   {defaultTargetSections.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* ROLL MODE */}

//             <div className="mt-5 flex flex-wrap items-end gap-4">
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Roll Number
//                 </label>

//                 <select
//                   value={rollMode}
//                   onChange={(event) =>
//                     setRollMode(event.target.value as RollAssignmentMode)
//                   }
//                   className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="AUTO">Auto Assign</option>

//                   <option value="KEEP_PREVIOUS">Keep Previous</option>

//                   <option value="MANUAL">Manual</option>
//                 </select>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleApplyTarget}
//                 disabled={rows.length === 0}
//                 className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Apply to Selected
//                 <ArrowRight size={17} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* STUDENTS */}

//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* TABLE HEADER */}

//           <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <h2 className="font-semibold text-slate-900">Students</h2>

//               <p className="text-sm text-slate-500">
//                 {rows.length} candidate(s)
//               </p>
//             </div>

//             <div className="relative w-full md:w-72">
//               <Search
//                 size={17}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search student..."
//                 className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
//               />
//             </div>
//           </div>

//           {/* TABLE */}

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1250px]">
//               <thead className="bg-slate-50">
//                 <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                   <th className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={allSelected}
//                       onChange={toggleAll}
//                     />
//                   </th>

//                   <th className="px-4 py-3">Student</th>

//                   <th className="px-4 py-3">Current</th>

//                   <th className="px-4 py-3">Decision</th>

//                   <th className="px-4 py-3">Target Class</th>

//                   <th className="px-4 py-3">Target Section</th>

//                   <th className="px-4 py-3">New Roll</th>

//                   <th className="px-4 py-3">Remarks</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filteredRows.map((row) => {
//                   const rowSections = row.targetClassId
//                     ? sectionsByClass[row.targetClassId] || []
//                     : [];

//                   const rowSectionsLoading = row.targetClassId
//                     ? loadingSectionClassIds.includes(row.targetClassId)
//                     : false;

//                   return (
//                     <tr key={row.studentId} className="text-sm">
//                       {/* SELECT */}

//                       <td className="px-4 py-4">
//                         <input
//                           type="checkbox"
//                           checked={row.selected}
//                           onChange={(event) =>
//                             handleRowSelect(
//                               row.studentId,

//                               event.target.checked,
//                             )
//                           }
//                         />
//                       </td>

//                       {/* STUDENT */}

//                       <td className="px-4 py-4">
//                         <p className="font-medium text-slate-900">{row.name}</p>

//                         <p className="mt-0.5 text-xs text-slate-500">
//                           {row.admissionNumber}
//                         </p>
//                       </td>

//                       {/* CURRENT */}

//                       <td className="px-4 py-4 text-slate-600">
//                         <div>
//                           {row.currentClassName}
//                           {" - "}
//                           {row.currentSectionName}
//                         </div>

//                         <div className="mt-0.5 text-xs text-slate-400">
//                           Roll {row.currentRollNumber ?? "—"}
//                         </div>
//                       </td>

//                       {/* DECISION */}

//                       <td className="px-4 py-4">
//                         <select
//                           value={row.decision}
//                           onChange={(event) =>
//                             handleDecisionChange(
//                               row.studentId,

//                               event.target.value as StudentPromotionDecision,
//                             )
//                           }
//                           className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500"
//                         >
//                           <option value="PROMOTED">Promote</option>

//                           <option value="RETAINED">Retain</option>

//                           <option value="TRANSFERRED">Transferred</option>

//                           <option value="LEFT">Left</option>

//                           <option value="GRADUATED">Graduated</option>
//                         </select>
//                       </td>

//                       {/* TARGET CLASS */}

//                       <td className="px-4 py-4">
//                         {requiresTarget(row.decision) ? (
//                           <select
//                             value={row.targetClassId ?? ""}
//                             onChange={(event) => {
//                               void handleRowTargetClassChange(
//                                 row.studentId,

//                                 event.target.value,
//                               );
//                             }}
//                             disabled={!targetSessionId}
//                             className="w-36 rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                           >
//                             <option value="">Select</option>

//                             {targetClasses.map((classItem) => (
//                               <option key={classItem._id} value={classItem._id}>
//                                 {classItem.name}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       {/* TARGET SECTION */}

//                       <td className="px-4 py-4">
//                         {requiresTarget(row.decision) ? (
//                           <select
//                             value={row.targetSectionId ?? ""}
//                             onChange={(event) =>
//                               handleRowTargetSectionChange(
//                                 row.studentId,

//                                 event.target.value,
//                               )
//                             }
//                             disabled={!row.targetClassId || rowSectionsLoading}
//                             className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                           >
//                             <option value="">
//                               {rowSectionsLoading ? "Loading..." : "Select"}
//                             </option>

//                             {rowSections.map((section) => (
//                               <option key={section._id} value={section._id}>
//                                 {section.name}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       {/* ROLL NUMBER */}

//                       <td className="px-4 py-4">
//                         {requiresTarget(row.decision) ? (
//                           <input
//                             type="number"
//                             min={1}
//                             step={1}
//                             value={row.rollNumber ?? ""}
//                             onChange={(event) =>
//                               handleRollChange(
//                                 row.studentId,

//                                 event.target.value,
//                               )
//                             }
//                             placeholder="Roll"
//                             className="w-20 rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-indigo-500"
//                           />
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       {/* REMARKS */}

//                       <td className="px-4 py-4">
//                         <input
//                           value={row.remarks ?? ""}
//                           onChange={(event) =>
//                             handleRemarksChange(
//                               row.studentId,

//                               event.target.value,
//                             )
//                           }
//                           placeholder="Optional"
//                           className="w-40 rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-indigo-500"
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {/* EMPTY */}

//                 {filteredRows.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="px-4 py-12 text-center text-sm text-slate-500"
//                     >
//                       Select source session and class, then load students.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* PREVIEW */}

//         {preview && (
//           <div
//             className={`rounded-2xl border p-5 ${
//               preview.canPromote
//                 ? "border-green-200 bg-green-50"
//                 : "border-red-200 bg-red-50"
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               {preview.canPromote ? (
//                 <CheckCircle2 className="text-green-600" />
//               ) : (
//                 <XCircle className="text-red-600" />
//               )}

//               <h2 className="font-semibold text-slate-900">
//                 Promotion Preview
//               </h2>
//             </div>

//             <div className="mt-4 flex flex-wrap gap-5 text-sm">
//               <span>
//                 Total: <strong>{preview.total}</strong>
//               </span>

//               <span className="text-green-700">
//                 Valid: <strong>{preview.valid}</strong>
//               </span>

//               <span className="text-red-700">
//                 Invalid: <strong>{preview.invalid}</strong>
//               </span>
//             </div>

//             {/* INVALID STUDENTS */}

//             {preview.students
//               .filter((student) => !student.valid)
//               .map((student) => (
//                 <div
//                   key={student.studentId}
//                   className="mt-3 rounded-xl border border-red-100 bg-white p-3 text-sm text-red-700"
//                 >
//                   <strong>{student.studentName || student.studentId}</strong>

//                   {student.errors.map((message) => (
//                     <div key={message} className="mt-1">
//                       • {message}
//                     </div>
//                   ))}
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* PROMOTION SUMMARY */}

//         {promotionSummary && (
//           <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
//             <h2 className="font-semibold text-green-800">Promotion Summary</h2>

//             <div className="mt-3 flex flex-wrap gap-4 text-sm text-green-700">
//               <span>
//                 Total: <strong>{promotionSummary.total}</strong>
//               </span>

//               <span>
//                 Promoted: <strong>{promotionSummary.promoted}</strong>
//               </span>

//               <span>
//                 Retained: <strong>{promotionSummary.retained}</strong>
//               </span>

//               <span>
//                 Transferred: <strong>{promotionSummary.transferred}</strong>
//               </span>

//               <span>
//                 Left: <strong>{promotionSummary.left}</strong>
//               </span>

//               <span>
//                 Graduated: <strong>{promotionSummary.graduated}</strong>
//               </span>

//               <span>
//                 Failed: <strong>{promotionSummary.failed}</strong>
//               </span>
//             </div>
//           </div>
//         )}

//         {/* ACTION BUTTONS */}

//         <div className="flex flex-col justify-end gap-3 pb-6 sm:flex-row">
//           <button
//             type="button"
//             onClick={handlePreview}
//             disabled={previewLoading || rows.length === 0}
//             className="rounded-xl border border-indigo-600 px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {previewLoading ? "Checking..." : "Preview Promotion"}
//           </button>

//           <button
//             type="button"
//             onClick={handlePromote}
//             disabled={promotionLoading || !preview?.canPromote}
//             className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {promotionLoading ? "Promoting..." : "Confirm & Promote"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BulkPromotion;








// import { useEffect, useMemo, useState } from "react";

// import {
//   ArrowRight,
//   CheckCircle2,
//   RefreshCcw,
//   Search,
//   Users,
//   XCircle,
// } from "lucide-react";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSectionsApi } from "../../../features/academic/sections/section.api";

// import type { SectionData } from "../../../features/academic/sections/section.types";

// import { getStudentsApi } from "../../../features/student/student.api";

// import {
//   bulkPromoteStudents,
//   clearPromotionPreview,
//   clearPromotionSummary,
//   getPromotionCandidates,
//   previewBulkPromotion,
// } from "../../../features/student/studentPromotion.slice";

// import type {
//   BulkStudentPromotionRequest,
//   PromotionStudentRow,
//   RollAssignmentMode,
//   StudentPromotionDecision,
// } from "../../../features/student/studentPromotion.types";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// // =====================================================
// // HELPERS
// // =====================================================

// const requiresTarget = (decision: StudentPromotionDecision): boolean => {
//   return decision === "PROMOTED" || decision === "RETAINED";
// };

// const getErrorMessage = (error: unknown): string => {
//   if (typeof error === "string") {
//     return error;
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   if (typeof error === "object" && error !== null && "response" in error) {
//     const apiError = error as {
//       response?: {
//         data?: {
//           message?: string;
//         };
//       };
//     };

//     return apiError.response?.data?.message || "Something went wrong.";
//   }

//   return "Something went wrong.";
// };

// // =====================================================
// // COMPONENT
// // =====================================================

// const BulkPromotion = () => {
//   const dispatch = useAppDispatch();

//   // ===================================================
//   // REDUX
//   // ===================================================

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes } = useAppSelector((state) => state.classes);

//   const {
//     preview,
//     promotionSummary,
//     candidatesLoading,
//     previewLoading,
//     promotionLoading,
//     error,
//   } = useAppSelector((state) => state.studentPromotion);

//   // ===================================================
//   // SOURCE
//   // ===================================================

//   const [sourceSessionId, setSourceSessionId] = useState("");

//   const [sourceClassId, setSourceClassId] = useState("");

//   const [sourceSectionId, setSourceSectionId] = useState("");

//   const [sourceSections, setSourceSections] = useState<SectionData[]>([]);

//   const [sourceSectionsLoading, setSourceSectionsLoading] = useState(false);

//   // ===================================================
//   // TARGET
//   // ===================================================

//   const [targetSessionId, setTargetSessionId] = useState("");

//   const [defaultTargetClassId, setDefaultTargetClassId] = useState("");

//   const [defaultTargetSectionId, setDefaultTargetSectionId] = useState("");

//   const [defaultTargetSections, setDefaultTargetSections] = useState<
//     SectionData[]
//   >([]);

//   const [defaultTargetSectionsLoading, setDefaultTargetSectionsLoading] =
//     useState(false);

//   // ===================================================
//   // SECTIONS CACHE
//   //
//   // Key   = classId
//   // Value = sections of that class in target session
//   // ===================================================

//   const [sectionsByClass, setSectionsByClass] = useState<
//     Record<string, SectionData[]>
//   >({});

//   const [loadingSectionClassIds, setLoadingSectionClassIds] = useState<
//     string[]
//   >([]);

//   // ===================================================
//   // TABLE
//   // ===================================================

//   const [rows, setRows] = useState<PromotionStudentRow[]>([]);

//   const [search, setSearch] = useState("");

//   const [rollMode, setRollMode] = useState<RollAssignmentMode>("AUTO");

//   const [applyingTarget, setApplyingTarget] = useState(false);

//   // ===================================================
//   // MESSAGES
//   // ===================================================

//   const [localError, setLocalError] = useState<string | null>(null);

//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // ===================================================
//   // INITIAL DATA
//   // ===================================================

//   useEffect(() => {
//     dispatch(getSessions());

//     dispatch(getClasses());
//   }, [dispatch]);

//   // ===================================================
//   // CURRENT SESSION DEFAULT
//   // ===================================================

//   useEffect(() => {
//     if (sourceSessionId || sessions.length === 0) {
//       return;
//     }

//     const currentSession = sessions.find((session) => session.isCurrent);

//     if (currentSession) {
//       setSourceSessionId(currentSession._id);
//     }
//   }, [sessions, sourceSessionId]);

//   // ===================================================
//   // SOURCE CLASSES
//   // ===================================================

//   const sourceClasses = useMemo(() => {
//     return classes.filter(
//       (classItem) => classItem.sessionId === sourceSessionId,
//     );
//   }, [classes, sourceSessionId]);

//   // ===================================================
//   // TARGET CLASSES
//   // ===================================================

//   const targetClasses = useMemo(() => {
//     return classes.filter(
//       (classItem) => classItem.sessionId === targetSessionId,
//     );
//   }, [classes, targetSessionId]);

//   // ===================================================
//   // LOAD SOURCE SECTIONS
//   // ===================================================

//   useEffect(() => {
//     let active = true;

//     const loadSourceSections = async () => {
//       setSourceSectionId("");

//       setSourceSections([]);

//       if (!sourceSessionId || !sourceClassId) {
//         return;
//       }

//       try {
//         setSourceSectionsLoading(true);

//         const result = await getSectionsApi({
//           sessionId: sourceSessionId,

//           classId: sourceClassId,
//         });

//         if (active) {
//           setSourceSections(result);
//         }
//       } catch (error) {
//         if (active) {
//           setLocalError(getErrorMessage(error));
//         }
//       } finally {
//         if (active) {
//           setSourceSectionsLoading(false);
//         }
//       }
//     };

//     void loadSourceSections();

//     return () => {
//       active = false;
//     };
//   }, [sourceSessionId, sourceClassId]);

//   // ===================================================
//   // LOAD DEFAULT TARGET SECTIONS
//   // ===================================================

//   useEffect(() => {
//     let active = true;

//     const loadTargetSections = async () => {
//       setDefaultTargetSectionId("");

//       setDefaultTargetSections([]);

//       if (!targetSessionId || !defaultTargetClassId) {
//         return;
//       }

//       try {
//         setDefaultTargetSectionsLoading(true);

//         const result = await getSectionsApi({
//           sessionId: targetSessionId,

//           classId: defaultTargetClassId,
//         });

//         if (!active) {
//           return;
//         }

//         setDefaultTargetSections(result);

//         setSectionsByClass((current) => ({
//           ...current,

//           [defaultTargetClassId]: result,
//         }));
//       } catch (error) {
//         if (active) {
//           setLocalError(getErrorMessage(error));
//         }
//       } finally {
//         if (active) {
//           setDefaultTargetSectionsLoading(false);
//         }
//       }
//     };

//     void loadTargetSections();

//     return () => {
//       active = false;
//     };
//   }, [targetSessionId, defaultTargetClassId]);

//   // ===================================================
//   // LOAD SECTIONS FOR INDIVIDUAL TARGET CLASS
//   // ===================================================

//   const loadSectionsForClass = async (classId: string): Promise<void> => {
//     if (!targetSessionId || !classId) {
//       return;
//     }

//     if (sectionsByClass[classId]) {
//       return;
//     }

//     if (loadingSectionClassIds.includes(classId)) {
//       return;
//     }

//     try {
//       setLoadingSectionClassIds((current) => [...current, classId]);

//       const result = await getSectionsApi({
//         sessionId: targetSessionId,

//         classId,
//       });

//       setSectionsByClass((current) => ({
//         ...current,

//         [classId]: result,
//       }));
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     } finally {
//       setLoadingSectionClassIds((current) =>
//         current.filter((id) => id !== classId),
//       );
//     }
//   };

//   // ===================================================
//   // SOURCE SESSION CHANGE
//   // ===================================================

//   const handleSourceSessionChange = (value: string) => {
//     setSourceSessionId(value);

//     setSourceClassId("");

//     setSourceSectionId("");

//     setSourceSections([]);

//     setRows([]);

//     setSearch("");

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // SOURCE CLASS CHANGE
//   // ===================================================

//   const handleSourceClassChange = (value: string) => {
//     setSourceClassId(value);

//     setSourceSectionId("");

//     setSourceSections([]);

//     setRows([]);

//     setSearch("");

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // SOURCE SECTION CHANGE
//   // ===================================================

//   const handleSourceSectionChange = (value: string) => {
//     setSourceSectionId(value);

//     setRows([]);

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // TARGET SESSION CHANGE
//   // ===================================================

//   const handleTargetSessionChange = (value: string) => {
//     setTargetSessionId(value);

//     setDefaultTargetClassId("");

//     setDefaultTargetSectionId("");

//     setDefaultTargetSections([]);

//     setSectionsByClass({});

//     setLoadingSectionClassIds([]);

//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         delete updated.targetClassId;

//         delete updated.targetSectionId;

//         delete updated.rollNumber;

//         return updated;
//       }),
//     );

//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());
//   };

//   // ===================================================
//   // DEFAULT TARGET CLASS CHANGE
//   // ===================================================

//   const handleDefaultTargetClassChange = (value: string) => {
//     setDefaultTargetClassId(value);

//     setDefaultTargetSectionId("");

//     setDefaultTargetSections([]);

//     setLocalError(null);

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // DEFAULT TARGET SECTION CHANGE
//   // ===================================================

//   const handleDefaultTargetSectionChange = (value: string) => {
//     setDefaultTargetSectionId(value);

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // LOAD CANDIDATES
//   // ===================================================

//   const handleLoadStudents = async () => {
//     setLocalError(null);

//     setSuccessMessage(null);

//     dispatch(clearPromotionPreview());

//     dispatch(clearPromotionSummary());

//     if (!sourceSessionId) {
//       setLocalError("Please select source session.");

//       return;
//     }

//     if (!sourceClassId) {
//       setLocalError("Please select source class.");

//       return;
//     }

//     try {
//       const filters: {
//         sessionId: string;
//         classId: string;
//         sectionId?: string;
//       } = {
//         sessionId: sourceSessionId,

//         classId: sourceClassId,
//       };

//       if (sourceSectionId) {
//         filters.sectionId = sourceSectionId;
//       }

//       const result = await dispatch(getPromotionCandidates(filters)).unwrap();

//       const mappedRows: PromotionStudentRow[] = result.map((candidate) => {
//         const row: PromotionStudentRow = {
//           studentId: candidate.studentId._id,

//           admissionNumber: candidate.studentId.admissionNumber,

//           name: candidate.studentId.name,

//           currentClassId: candidate.classId._id,

//           currentClassName: candidate.classId.name,

//           currentSectionId: candidate.sectionId._id,

//           currentSectionName: candidate.sectionId.name,

//           selected: true,

//           decision: "PROMOTED",
//         };

//         if (candidate.rollNumber !== undefined) {
//           row.currentRollNumber = candidate.rollNumber;
//         }

//         return row;
//       });

//       setRows(mappedRows);

//       if (mappedRows.length === 0) {
//         setLocalError("No active promotion candidates found.");
//       }
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     }
//   };

//   // ===================================================
//   // APPLY TARGET TO SELECTED
//   // ===================================================

//   const handleApplyTarget = async () => {
//     setLocalError(null);

//     setSuccessMessage(null);

//     if (!targetSessionId) {
//       setLocalError("Please select target session.");

//       return;
//     }

//     if (targetSessionId === sourceSessionId) {
//       setLocalError("Source and target sessions must be different.");

//       return;
//     }

//     if (!defaultTargetClassId) {
//       setLocalError("Please select target class.");

//       return;
//     }

//     if (!defaultTargetSectionId) {
//       setLocalError("Please select target section.");

//       return;
//     }

//     try {
//       setApplyingTarget(true);

//       let nextAutoRoll = 1;

//       if (rollMode === "AUTO") {
//         const existingStudents = await getStudentsApi({
//           sessionId: targetSessionId,
//           classId: defaultTargetClassId,
//           sectionId: defaultTargetSectionId,
//           limit: 1000,
//         });

//         const maxExistingRoll = existingStudents.reduce((maxRoll, student) => {
//           if (
//             student.rollNumber !== undefined &&
//             Number.isInteger(student.rollNumber) &&
//             student.rollNumber > maxRoll
//           ) {
//             return student.rollNumber;
//           }

//           return maxRoll;
//         }, 0);

//         nextAutoRoll = maxExistingRoll + 1;
//       }

//       setRows((currentRows) =>
//         currentRows.map((row) => {
//           if (!row.selected || !requiresTarget(row.decision)) {
//             return row;
//           }

//           const updated: PromotionStudentRow = {
//             ...row,

//             targetClassId: defaultTargetClassId,

//             targetSectionId: defaultTargetSectionId,
//           };

//           if (rollMode === "AUTO") {
//             updated.rollNumber = nextAutoRoll;

//             nextAutoRoll += 1;
//           }

//           if (rollMode === "KEEP_PREVIOUS") {
//             if (row.currentRollNumber !== undefined) {
//               updated.rollNumber = row.currentRollNumber;
//             } else {
//               delete updated.rollNumber;
//             }
//           }

//           if (rollMode === "MANUAL") {
//             delete updated.rollNumber;
//           }

//           return updated;
//         }),
//       );

//       dispatch(clearPromotionPreview());
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     } finally {
//       setApplyingTarget(false);
//     }
//   };

//   // ===================================================
//   // SELECT COUNT
//   // ===================================================

//   const selectedCount = rows.filter((row) => row.selected).length;

//   const allSelected = rows.length > 0 && selectedCount === rows.length;

//   // ===================================================
//   // SELECT ALL
//   // ===================================================

//   const toggleAll = () => {
//     setRows((currentRows) =>
//       currentRows.map((row) => ({
//         ...row,

//         selected: !allSelected,
//       })),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // UPDATE ROW
//   // ===================================================

//   const updateRow = (
//     studentId: string,
//     updates: Partial<PromotionStudentRow>,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) =>
//         row.studentId === studentId
//           ? {
//               ...row,
//               ...updates,
//             }
//           : row,
//       ),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW SELECT
//   // ===================================================

//   const handleRowSelect = (studentId: string, selected: boolean) => {
//     updateRow(studentId, {
//       selected,
//     });
//   };

//   // ===================================================
//   // DECISION CHANGE
//   // ===================================================

//   const handleDecisionChange = (
//     studentId: string,
//     decision: StudentPromotionDecision,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,

//           decision,
//         };

//         if (!requiresTarget(decision)) {
//           delete updated.targetClassId;

//           delete updated.targetSectionId;

//           delete updated.rollNumber;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW TARGET CLASS CHANGE
//   // ===================================================

//   const handleRowTargetClassChange = async (
//     studentId: string,
//     classId: string,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,

//           targetClassId: classId,
//         };

//         delete updated.targetSectionId;

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());

//     if (classId) {
//       await loadSectionsForClass(classId);
//     }
//   };

//   // ===================================================
//   // ROW TARGET SECTION CHANGE
//   // ===================================================

//   const handleRowTargetSectionChange = (
//     studentId: string,
//     sectionId: string,
//   ) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         if (sectionId) {
//           updated.targetSectionId = sectionId;
//         } else {
//           delete updated.targetSectionId;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW ROLL CHANGE
//   // ===================================================

//   const handleRollChange = (studentId: string, value: string) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         if (!value) {
//           delete updated.rollNumber;

//           return updated;
//         }

//         const rollNumber = Number(value);

//         updated.rollNumber = rollNumber;

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // ROW REMARKS CHANGE
//   // ===================================================

//   const handleRemarksChange = (studentId: string, remarks: string) => {
//     setRows((currentRows) =>
//       currentRows.map((row) => {
//         if (row.studentId !== studentId) {
//           return row;
//         }

//         const updated: PromotionStudentRow = {
//           ...row,
//         };

//         if (remarks) {
//           updated.remarks = remarks;
//         } else {
//           delete updated.remarks;
//         }

//         return updated;
//       }),
//     );

//     dispatch(clearPromotionPreview());
//   };

//   // ===================================================
//   // BUILD PAYLOAD
//   // ===================================================

//   const buildPayload = (): BulkStudentPromotionRequest | null => {
//     setLocalError(null);

//     if (!sourceSessionId) {
//       setLocalError("Source session is required.");

//       return null;
//     }

//     if (!targetSessionId) {
//       setLocalError("Target session is required.");

//       return null;
//     }

//     if (sourceSessionId === targetSessionId) {
//       setLocalError("Source and target sessions must be different.");

//       return null;
//     }

//     const selectedRows = rows.filter((row) => row.selected);

//     if (selectedRows.length === 0) {
//       setLocalError("Please select at least one student.");

//       return null;
//     }

//     for (const row of selectedRows) {
//       if (requiresTarget(row.decision)) {
//         if (!row.targetClassId) {
//           setLocalError(`Target class is required for ${row.name}.`);

//           return null;
//         }

//         if (!row.targetSectionId) {
//           setLocalError(`Target section is required for ${row.name}.`);

//           return null;
//         }

//         if (row.rollNumber !== undefined) {
//           if (!Number.isInteger(row.rollNumber) || row.rollNumber < 1) {
//             setLocalError(
//               `Roll number must be a positive whole number for ${row.name}.`,
//             );

//             return null;
//           }
//         }
//       }
//     }

//     const students = selectedRows.map((row) => {
//       const item: {
//         studentId: string;

//         decision: StudentPromotionDecision;

//         targetClassId?: string;

//         targetSectionId?: string;

//         rollNumber?: number;

//         remarks?: string;
//       } = {
//         studentId: row.studentId,

//         decision: row.decision,
//       };

//       if (requiresTarget(row.decision)) {
//         if (row.targetClassId) {
//           item.targetClassId = row.targetClassId;
//         }

//         if (row.targetSectionId) {
//           item.targetSectionId = row.targetSectionId;
//         }

//         if (row.rollNumber !== undefined) {
//           item.rollNumber = row.rollNumber;
//         }
//       }

//       if (row.remarks && row.remarks.trim()) {
//         item.remarks = row.remarks.trim();
//       }

//       return item;
//     });

//     return {
//       sourceSessionId,

//       targetSessionId,

//       students,
//     };
//   };

//   // ===================================================
//   // PREVIEW
//   // ===================================================

//   const handlePreview = async () => {
//     setSuccessMessage(null);

//     const payload = buildPayload();

//     if (!payload) {
//       return;
//     }

//     try {
//       await dispatch(previewBulkPromotion(payload)).unwrap();
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     }
//   };

//   const reloadPromotionCandidates = async (): Promise<void> => {
//     if (!sourceSessionId || !sourceClassId) {
//       setRows([]);

//       return;
//     }

//     const filters: {
//       sessionId: string;
//       classId: string;
//       sectionId?: string;
//     } = {
//       sessionId: sourceSessionId,
//       classId: sourceClassId,
//     };

//     if (sourceSectionId) {
//       filters.sectionId = sourceSectionId;
//     }

//     const result = await dispatch(getPromotionCandidates(filters)).unwrap();

//     const mappedRows: PromotionStudentRow[] = result.map((candidate) => {
//       const row: PromotionStudentRow = {
//         studentId: candidate.studentId._id,
//         admissionNumber: candidate.studentId.admissionNumber,
//         name: candidate.studentId.name,
//         currentClassId: candidate.classId._id,
//         currentClassName: candidate.classId.name,
//         currentSectionId: candidate.sectionId._id,
//         currentSectionName: candidate.sectionId.name,
//         selected: true,
//         decision: "PROMOTED",
//       };

//       if (candidate.rollNumber !== undefined) {
//         row.currentRollNumber = candidate.rollNumber;
//       }

//       return row;
//     });

//     setRows(mappedRows);
//   };

//   // ===================================================
//   // EXECUTE PROMOTION
//   // ===================================================

//   const handlePromote = async () => {
//     setLocalError(null);

//     setSuccessMessage(null);

//     if (!preview || !preview.canPromote) {
//       setLocalError("Please run a successful promotion preview first.");

//       return;
//     }

//     const payload = buildPayload();

//     if (!payload) {
//       return;
//     }

//     const confirmed = window.confirm(
//       `Promote ${payload.students.length} selected student(s)? This will create their next academic enrollment.`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       const result = await dispatch(bulkPromoteStudents(payload)).unwrap();

//       setSuccessMessage(
//         `Promotion completed. Promoted: ${result.promoted}, Retained: ${result.retained}, Transferred: ${result.transferred}, Left: ${result.left}, Graduated: ${result.graduated}, Failed: ${result.failed}.`,
//       );

//       setSearch("");

//       dispatch(clearPromotionPreview());

//       await reloadPromotionCandidates();
//     } catch (error) {
//       setLocalError(getErrorMessage(error));
//     }
//   };

//   // ===================================================
//   // FILTERED ROWS
//   // ===================================================

//   const filteredRows = useMemo(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) {
//       return rows;
//     }

//     return rows.filter(
//       (row) =>
//         row.name.toLowerCase().includes(value) ||
//         row.admissionNumber.toLowerCase().includes(value),
//     );
//   }, [rows, search]);

//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-6">
//       <div className="mx-auto max-w-[1600px] space-y-6">
//         {/* HEADER */}

//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               Bulk Student Promotion
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Promote, retain, transfer, leave or graduate students for the next
//               academic session.
//             </p>
//           </div>

//           <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
//             <Users size={18} />
//             {selectedCount} selected
//           </div>
//         </div>

//         {/* ERROR */}

//         {(localError || error) && (
//           <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             <XCircle size={19} className="mt-0.5 shrink-0" />

//             <span>{localError || error}</span>
//           </div>
//         )}

//         {/* SUCCESS */}

//         {successMessage && (
//           <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//             <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

//             <span>{successMessage}</span>
//           </div>
//         )}

//         {/* SOURCE + TARGET */}

//         <div className="grid gap-5 xl:grid-cols-2">
//           {/* SOURCE */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-5 text-base font-semibold text-slate-900">
//               From
//             </h2>

//             <div className="grid gap-4 md:grid-cols-3">
//               {/* SOURCE SESSION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Session
//                 </label>

//                 <select
//                   value={sourceSessionId}
//                   onChange={(event) =>
//                     handleSourceSessionChange(event.target.value)
//                   }
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="">Select session</option>

//                   {sessions.map((session) => (
//                     <option key={session._id} value={session._id}>
//                       {session.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* SOURCE CLASS */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Class
//                 </label>

//                 <select
//                   value={sourceClassId}
//                   onChange={(event) =>
//                     handleSourceClassChange(event.target.value)
//                   }
//                   disabled={!sourceSessionId}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">Select class</option>

//                   {sourceClasses.map((classItem) => (
//                     <option key={classItem._id} value={classItem._id}>
//                       {classItem.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* SOURCE SECTION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Section
//                 </label>

//                 <select
//                   value={sourceSectionId}
//                   onChange={(event) =>
//                     handleSourceSectionChange(event.target.value)
//                   }
//                   disabled={!sourceClassId || sourceSectionsLoading}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">
//                     {sourceSectionsLoading ? "Loading..." : "All Sections"}
//                   </option>

//                   {sourceSections.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleLoadStudents}
//               disabled={candidatesLoading}
//               className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <RefreshCcw
//                 size={17}
//                 className={candidatesLoading ? "animate-spin" : ""}
//               />

//               {candidatesLoading ? "Loading..." : "Load Students"}
//             </button>
//           </div>

//           {/* TARGET */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-5 text-base font-semibold text-slate-900">To</h2>

//             <div className="grid gap-4 md:grid-cols-3">
//               {/* TARGET SESSION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Session
//                 </label>

//                 <select
//                   value={targetSessionId}
//                   onChange={(event) =>
//                     handleTargetSessionChange(event.target.value)
//                   }
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="">Select session</option>

//                   {sessions
//                     .filter((session) => session._id !== sourceSessionId)
//                     .map((session) => (
//                       <option key={session._id} value={session._id}>
//                         {session.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>

//               {/* DEFAULT TARGET CLASS */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Class
//                 </label>

//                 <select
//                   value={defaultTargetClassId}
//                   onChange={(event) =>
//                     handleDefaultTargetClassChange(event.target.value)
//                   }
//                   disabled={!targetSessionId}
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">Select class</option>

//                   {targetClasses.map((classItem) => (
//                     <option key={classItem._id} value={classItem._id}>
//                       {classItem.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* DEFAULT TARGET SECTION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Section
//                 </label>

//                 <select
//                   value={defaultTargetSectionId}
//                   onChange={(event) =>
//                     handleDefaultTargetSectionChange(event.target.value)
//                   }
//                   disabled={
//                     !defaultTargetClassId || defaultTargetSectionsLoading
//                   }
//                   className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                 >
//                   <option value="">
//                     {defaultTargetSectionsLoading
//                       ? "Loading..."
//                       : "Select section"}
//                   </option>

//                   {defaultTargetSections.map((section) => (
//                     <option key={section._id} value={section._id}>
//                       {section.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* ROLL MODE */}

//             <div className="mt-5 flex flex-wrap items-end gap-4">
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Roll Number
//                 </label>

//                 <select
//                   value={rollMode}
//                   onChange={(event) =>
//                     setRollMode(event.target.value as RollAssignmentMode)
//                   }
//                   className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
//                 >
//                   <option value="AUTO">Auto Assign</option>

//                   <option value="KEEP_PREVIOUS">Keep Previous</option>

//                   <option value="MANUAL">Manual</option>
//                 </select>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   void handleApplyTarget();
//                 }}
//                 disabled={rows.length === 0 || applyingTarget}
//                 className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {applyingTarget
//                   ? "Applying..."
//                   : rollMode === "AUTO"
//                     ? "Apply & Auto Assign"
//                     : "Apply to Selected"}
//                 <ArrowRight size={17} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* STUDENTS */}

//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           {/* TABLE HEADER */}

//           <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <h2 className="font-semibold text-slate-900">Students</h2>

//               <p className="text-sm text-slate-500">
//                 {rows.length} candidate(s)
//               </p>
//             </div>

//             <div className="relative w-full md:w-72">
//               <Search
//                 size={17}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search student..."
//                 className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
//               />
//             </div>
//           </div>

//           {/* TABLE */}

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1250px]">
//               <thead className="bg-slate-50">
//                 <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                   <th className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={allSelected}
//                       onChange={toggleAll}
//                     />
//                   </th>

//                   <th className="px-4 py-3">Student</th>

//                   <th className="px-4 py-3">Current</th>

//                   <th className="px-4 py-3">Decision</th>

//                   <th className="px-4 py-3">Target Class</th>

//                   <th className="px-4 py-3">Target Section</th>

//                   <th className="px-4 py-3">New Roll</th>

//                   <th className="px-4 py-3">Remarks</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {filteredRows.map((row) => {
//                   const rowSections = row.targetClassId
//                     ? sectionsByClass[row.targetClassId] || []
//                     : [];

//                   const rowSectionsLoading = row.targetClassId
//                     ? loadingSectionClassIds.includes(row.targetClassId)
//                     : false;

//                   return (
//                     <tr key={row.studentId} className="text-sm">
//                       {/* SELECT */}

//                       <td className="px-4 py-4">
//                         <input
//                           type="checkbox"
//                           checked={row.selected}
//                           onChange={(event) =>
//                             handleRowSelect(
//                               row.studentId,

//                               event.target.checked,
//                             )
//                           }
//                         />
//                       </td>

//                       {/* STUDENT */}

//                       <td className="px-4 py-4">
//                         <p className="font-medium text-slate-900">{row.name}</p>

//                         <p className="mt-0.5 text-xs text-slate-500">
//                           {row.admissionNumber}
//                         </p>
//                       </td>

//                       {/* CURRENT */}

//                       <td className="px-4 py-4 text-slate-600">
//                         <div>
//                           {row.currentClassName}
//                           {" - "}
//                           {row.currentSectionName}
//                         </div>

//                         <div className="mt-0.5 text-xs text-slate-400">
//                           Roll {row.currentRollNumber ?? "—"}
//                         </div>
//                       </td>

//                       {/* DECISION */}

//                       <td className="px-4 py-4">
//                         <select
//                           value={row.decision}
//                           onChange={(event) =>
//                             handleDecisionChange(
//                               row.studentId,

//                               event.target.value as StudentPromotionDecision,
//                             )
//                           }
//                           className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500"
//                         >
//                           <option value="PROMOTED">Promote</option>

//                           <option value="RETAINED">Retain</option>

//                           <option value="TRANSFERRED">Transferred</option>

//                           <option value="LEFT">Left</option>

//                           <option value="GRADUATED">Graduated</option>
//                         </select>
//                       </td>

//                       {/* TARGET CLASS */}

//                       <td className="px-4 py-4">
//                         {requiresTarget(row.decision) ? (
//                           <select
//                             value={row.targetClassId ?? ""}
//                             onChange={(event) => {
//                               void handleRowTargetClassChange(
//                                 row.studentId,

//                                 event.target.value,
//                               );
//                             }}
//                             disabled={!targetSessionId}
//                             className="w-36 rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                           >
//                             <option value="">Select</option>

//                             {targetClasses.map((classItem) => (
//                               <option key={classItem._id} value={classItem._id}>
//                                 {classItem.name}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       {/* TARGET SECTION */}

//                       <td className="px-4 py-4">
//                         {requiresTarget(row.decision) ? (
//                           <select
//                             value={row.targetSectionId ?? ""}
//                             onChange={(event) =>
//                               handleRowTargetSectionChange(
//                                 row.studentId,

//                                 event.target.value,
//                               )
//                             }
//                             disabled={!row.targetClassId || rowSectionsLoading}
//                             className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100"
//                           >
//                             <option value="">
//                               {rowSectionsLoading ? "Loading..." : "Select"}
//                             </option>

//                             {rowSections.map((section) => (
//                               <option key={section._id} value={section._id}>
//                                 {section.name}
//                               </option>
//                             ))}
//                           </select>
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       {/* ROLL NUMBER */}

//                       <td className="px-4 py-4">
//                         {requiresTarget(row.decision) ? (
//                           <input
//                             type="number"
//                             min={1}
//                             step={1}
//                             value={row.rollNumber ?? ""}
//                             onChange={(event) =>
//                               handleRollChange(
//                                 row.studentId,

//                                 event.target.value,
//                               )
//                             }
//                             placeholder="Roll"
//                             className="w-20 rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-indigo-500"
//                           />
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       {/* REMARKS */}

//                       <td className="px-4 py-4">
//                         <input
//                           value={row.remarks ?? ""}
//                           onChange={(event) =>
//                             handleRemarksChange(
//                               row.studentId,

//                               event.target.value,
//                             )
//                           }
//                           placeholder="Optional"
//                           className="w-40 rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-indigo-500"
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {/* EMPTY */}

//                 {filteredRows.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="px-4 py-12 text-center text-sm text-slate-500"
//                     >
//                       Select source session and class, then load students.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* PREVIEW */}

//         {preview && (
//           <div
//             className={`rounded-2xl border p-5 ${
//               preview.canPromote
//                 ? "border-green-200 bg-green-50"
//                 : "border-red-200 bg-red-50"
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               {preview.canPromote ? (
//                 <CheckCircle2 className="text-green-600" />
//               ) : (
//                 <XCircle className="text-red-600" />
//               )}

//               <h2 className="font-semibold text-slate-900">
//                 Promotion Preview
//               </h2>
//             </div>

//             <div className="mt-4 flex flex-wrap gap-5 text-sm">
//               <span>
//                 Total: <strong>{preview.total}</strong>
//               </span>

//               <span className="text-green-700">
//                 Valid: <strong>{preview.valid}</strong>
//               </span>

//               <span className="text-red-700">
//                 Invalid: <strong>{preview.invalid}</strong>
//               </span>
//             </div>

//             {/* INVALID STUDENTS */}

//             {preview.students
//               .filter((student) => !student.valid)
//               .map((student) => (
//                 <div
//                   key={student.studentId}
//                   className="mt-3 rounded-xl border border-red-100 bg-white p-3 text-sm text-red-700"
//                 >
//                   <strong>{student.studentName || student.studentId}</strong>

//                   {student.errors.map((message) => (
//                     <div key={message} className="mt-1">
//                       • {message}
//                     </div>
//                   ))}
//                 </div>
//               ))}
//           </div>
//         )}

//         {/* PROMOTION SUMMARY */}

//         {promotionSummary && (
//           <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
//             <h2 className="font-semibold text-green-800">Promotion Summary</h2>

//             <div className="mt-3 flex flex-wrap gap-4 text-sm text-green-700">
//               <span>
//                 Total: <strong>{promotionSummary.total}</strong>
//               </span>

//               <span>
//                 Promoted: <strong>{promotionSummary.promoted}</strong>
//               </span>

//               <span>
//                 Retained: <strong>{promotionSummary.retained}</strong>
//               </span>

//               <span>
//                 Transferred: <strong>{promotionSummary.transferred}</strong>
//               </span>

//               <span>
//                 Left: <strong>{promotionSummary.left}</strong>
//               </span>

//               <span>
//                 Graduated: <strong>{promotionSummary.graduated}</strong>
//               </span>

//               <span>
//                 Failed: <strong>{promotionSummary.failed}</strong>
//               </span>
//             </div>
//           </div>
//         )}

//         {/* ACTION BUTTONS */}

//         <div className="flex flex-col justify-end gap-3 pb-6 sm:flex-row">
//           <button
//             type="button"
//             onClick={handlePreview}
//             disabled={previewLoading || rows.length === 0}
//             className="rounded-xl border border-indigo-600 px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {previewLoading ? "Checking..." : "Preview Promotion"}
//           </button>

//           <button
//             type="button"
//             onClick={handlePromote}
//             disabled={promotionLoading || !preview?.canPromote}
//             className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {promotionLoading ? "Promoting..." : "Confirm & Promote"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BulkPromotion;











import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  RefreshCcw,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { getSessions } from "../../../features/academic/sessions/session.slice";

import { getClasses } from "../../../features/academic/classes/class.slice";

import { getSectionsApi } from "../../../features/academic/sections/section.api";

import type { SectionData } from "../../../features/academic/sections/section.types";

import { getStudentsApi } from "../../../features/student/student.api";

import {
  bulkPromoteStudents,
  clearPromotionPreview,
  clearPromotionSummary,
  getPromotionCandidates,
  previewBulkPromotion,
} from "../../../features/student/studentPromotion.slice";

import type {
  BulkStudentPromotionRequest,
  PromotionStudentRow,
  RollAssignmentMode,
  StudentPromotionDecision,
} from "../../../features/student/studentPromotion.types";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// =====================================================
// HELPERS
// =====================================================

const requiresTarget = (decision: StudentPromotionDecision): boolean => {
  return decision === "PROMOTED" || decision === "RETAINED";
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return apiError.response?.data?.message || "Something went wrong.";
  }

  return "Something went wrong.";
};

// =====================================================
// COMPONENT
// =====================================================

const BulkPromotion = () => {
  const dispatch = useAppDispatch();

  // ===================================================
  // REDUX
  // ===================================================

  const { sessions } = useAppSelector((state) => state.sessions);

  const { classes } = useAppSelector((state) => state.classes);

  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  const {
    preview,
    promotionSummary,
    candidatesLoading,
    previewLoading,
    promotionLoading,
    error,
  } = useAppSelector((state) => state.studentPromotion);

  // ===================================================
  // SOURCE
  // ===================================================

  const sourceSessionId = selectedSessionId || "";

  const [sourceClassId, setSourceClassId] = useState("");

  const [sourceSectionId, setSourceSectionId] = useState("");

  const [sourceSections, setSourceSections] = useState<SectionData[]>([]);

  const [sourceSectionsLoading, setSourceSectionsLoading] = useState(false);

  // ===================================================
  // TARGET
  // ===================================================

  const [defaultTargetClassId, setDefaultTargetClassId] = useState("");

  const [defaultTargetSectionId, setDefaultTargetSectionId] = useState("");

  const [defaultTargetSections, setDefaultTargetSections] = useState<
    SectionData[]
  >([]);

  const [defaultTargetSectionsLoading, setDefaultTargetSectionsLoading] =
    useState(false);

  // ===================================================
  // SECTIONS CACHE
  //
  // Key   = classId
  // Value = sections of that class in target session
  // ===================================================

  const [sectionsByClass, setSectionsByClass] = useState<
    Record<string, SectionData[]>
  >({});

  const [loadingSectionClassIds, setLoadingSectionClassIds] = useState<
    string[]
  >([]);

  // ===================================================
  // TABLE
  // ===================================================

  const [rows, setRows] = useState<PromotionStudentRow[]>([]);

  const [search, setSearch] = useState("");

  const [rollMode, setRollMode] = useState<RollAssignmentMode>("AUTO");

  const [applyingTarget, setApplyingTarget] = useState(false);

  // ===================================================
  // MESSAGES
  // ===================================================

  const [localError, setLocalError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ===================================================
  // INITIAL DATA
  // ===================================================

  useEffect(() => {
    dispatch(getSessions());

    dispatch(getClasses());
  }, [dispatch]);

  // ===================================================
  // SOURCE + TARGET SESSION
  //
  // Source always comes from the Topbar. Promotion target is the next
  // chronological academic session, so this page does not own a session
  // dropdown.
  // ===================================================

  const sourceSession = useMemo(
    () => sessions.find((session) => session._id === sourceSessionId),
    [sessions, sourceSessionId],
  );

  const targetSession = useMemo(() => {
    if (!sourceSession) {
      return undefined;
    }

    return [...sessions]
      .filter(
        (session) =>
          session._id !== sourceSession._id &&
          new Date(session.startDate).getTime() >
            new Date(sourceSession.startDate).getTime(),
      )
      .sort(
        (first, second) =>
          new Date(first.startDate).getTime() -
          new Date(second.startDate).getTime(),
      )[0];
  }, [sessions, sourceSession]);

  const targetSessionId = targetSession?._id || "";

  useEffect(() => {
    setSourceClassId("");
    setSourceSectionId("");
    setSourceSections([]);
    setDefaultTargetClassId("");
    setDefaultTargetSectionId("");
    setDefaultTargetSections([]);
    setSectionsByClass({});
    setLoadingSectionClassIds([]);
    setRows([]);
    setSearch("");
    setLocalError(null);
    setSuccessMessage(null);
    dispatch(clearPromotionPreview());
    dispatch(clearPromotionSummary());
  }, [dispatch, sourceSessionId, targetSessionId]);

  // ===================================================
  // SOURCE CLASSES
  // ===================================================

  const sourceClasses = useMemo(() => {
    return classes.filter(
      (classItem) => classItem.sessionId === sourceSessionId,
    );
  }, [classes, sourceSessionId]);

  // ===================================================
  // TARGET CLASSES
  // ===================================================

  const targetClasses = useMemo(() => {
    return classes.filter(
      (classItem) => classItem.sessionId === targetSessionId,
    );
  }, [classes, targetSessionId]);

  // ===================================================
  // LOAD SOURCE SECTIONS
  // ===================================================

  useEffect(() => {
    let active = true;

    const loadSourceSections = async () => {
      setSourceSectionId("");

      setSourceSections([]);

      if (!sourceSessionId || !sourceClassId) {
        return;
      }

      try {
        setSourceSectionsLoading(true);

        const result = await getSectionsApi({
          sessionId: sourceSessionId,

          classId: sourceClassId,
        });

        if (active) {
          setSourceSections(result);
        }
      } catch (error) {
        if (active) {
          setLocalError(getErrorMessage(error));
        }
      } finally {
        if (active) {
          setSourceSectionsLoading(false);
        }
      }
    };

    void loadSourceSections();

    return () => {
      active = false;
    };
  }, [sourceSessionId, sourceClassId]);

  // ===================================================
  // LOAD DEFAULT TARGET SECTIONS
  // ===================================================

  useEffect(() => {
    let active = true;

    const loadTargetSections = async () => {
      setDefaultTargetSectionId("");

      setDefaultTargetSections([]);

      if (!targetSessionId || !defaultTargetClassId) {
        return;
      }

      try {
        setDefaultTargetSectionsLoading(true);

        const result = await getSectionsApi({
          sessionId: targetSessionId,

          classId: defaultTargetClassId,
        });

        if (!active) {
          return;
        }

        setDefaultTargetSections(result);

        setSectionsByClass((current) => ({
          ...current,

          [defaultTargetClassId]: result,
        }));
      } catch (error) {
        if (active) {
          setLocalError(getErrorMessage(error));
        }
      } finally {
        if (active) {
          setDefaultTargetSectionsLoading(false);
        }
      }
    };

    void loadTargetSections();

    return () => {
      active = false;
    };
  }, [targetSessionId, defaultTargetClassId]);

  // ===================================================
  // LOAD SECTIONS FOR INDIVIDUAL TARGET CLASS
  // ===================================================

  const loadSectionsForClass = async (classId: string): Promise<void> => {
    if (!targetSessionId || !classId) {
      return;
    }

    if (sectionsByClass[classId]) {
      return;
    }

    if (loadingSectionClassIds.includes(classId)) {
      return;
    }

    try {
      setLoadingSectionClassIds((current) => [...current, classId]);

      const result = await getSectionsApi({
        sessionId: targetSessionId,

        classId,
      });

      setSectionsByClass((current) => ({
        ...current,

        [classId]: result,
      }));
    } catch (error) {
      setLocalError(getErrorMessage(error));
    } finally {
      setLoadingSectionClassIds((current) =>
        current.filter((id) => id !== classId),
      );
    }
  };

  // ===================================================
  // SOURCE CLASS CHANGE
  // ===================================================

  const handleSourceClassChange = (value: string) => {
    setSourceClassId(value);

    setSourceSectionId("");

    setSourceSections([]);

    setRows([]);

    setSearch("");

    setLocalError(null);

    setSuccessMessage(null);

    dispatch(clearPromotionPreview());

    dispatch(clearPromotionSummary());
  };

  // ===================================================
  // SOURCE SECTION CHANGE
  // ===================================================

  const handleSourceSectionChange = (value: string) => {
    setSourceSectionId(value);

    setRows([]);

    setLocalError(null);

    setSuccessMessage(null);

    dispatch(clearPromotionPreview());

    dispatch(clearPromotionSummary());
  };

  // ===================================================
  // DEFAULT TARGET CLASS CHANGE
  // ===================================================

  const handleDefaultTargetClassChange = (value: string) => {
    setDefaultTargetClassId(value);

    setDefaultTargetSectionId("");

    setDefaultTargetSections([]);

    setLocalError(null);

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // DEFAULT TARGET SECTION CHANGE
  // ===================================================

  const handleDefaultTargetSectionChange = (value: string) => {
    setDefaultTargetSectionId(value);

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // LOAD CANDIDATES
  // ===================================================

  const handleLoadStudents = async () => {
    setLocalError(null);

    setSuccessMessage(null);

    dispatch(clearPromotionPreview());

    dispatch(clearPromotionSummary());

    if (!sourceSessionId) {
      setLocalError("Please select source session.");

      return;
    }

    if (!sourceClassId) {
      setLocalError("Please select source class.");

      return;
    }

    try {
      const filters: {
        sessionId: string;
        classId: string;
        sectionId?: string;
      } = {
        sessionId: sourceSessionId,

        classId: sourceClassId,
      };

      if (sourceSectionId) {
        filters.sectionId = sourceSectionId;
      }

      const result = await dispatch(getPromotionCandidates(filters)).unwrap();

      const mappedRows: PromotionStudentRow[] = result.map((candidate) => {
        const row: PromotionStudentRow = {
          studentId: candidate.studentId._id,

          admissionNumber: candidate.studentId.admissionNumber,

          name: candidate.studentId.name,

          currentClassId: candidate.classId._id,

          currentClassName: candidate.classId.name,

          currentSectionId: candidate.sectionId._id,

          currentSectionName: candidate.sectionId.name,

          selected: true,

          decision: "PROMOTED",
        };

        if (candidate.rollNumber !== undefined) {
          row.currentRollNumber = candidate.rollNumber;
        }

        return row;
      });

      setRows(mappedRows);

      if (mappedRows.length === 0) {
        setLocalError("No active promotion candidates found.");
      }
    } catch (error) {
      setLocalError(getErrorMessage(error));
    }
  };

  // ===================================================
  // APPLY TARGET TO SELECTED
  // ===================================================

  const handleApplyTarget = async () => {
    setLocalError(null);

    setSuccessMessage(null);

    if (!targetSessionId) {
      setLocalError("Please select target session.");

      return;
    }

    if (targetSessionId === sourceSessionId) {
      setLocalError("Source and target sessions must be different.");

      return;
    }

    if (!defaultTargetClassId) {
      setLocalError("Please select target class.");

      return;
    }

    if (!defaultTargetSectionId) {
      setLocalError("Please select target section.");

      return;
    }

    try {
      setApplyingTarget(true);

      let nextAutoRoll = 1;

      if (rollMode === "AUTO") {
        const existingStudents = await getStudentsApi({
          sessionId: targetSessionId,
          classId: defaultTargetClassId,
          sectionId: defaultTargetSectionId,
          limit: 1000,
        });

        const maxExistingRoll = existingStudents.reduce((maxRoll, student) => {
          if (
            student.rollNumber !== undefined &&
            Number.isInteger(student.rollNumber) &&
            student.rollNumber > maxRoll
          ) {
            return student.rollNumber;
          }

          return maxRoll;
        }, 0);

        nextAutoRoll = maxExistingRoll + 1;
      }

      setRows((currentRows) =>
        currentRows.map((row) => {
          if (!row.selected || !requiresTarget(row.decision)) {
            return row;
          }

          const updated: PromotionStudentRow = {
            ...row,

            targetClassId: defaultTargetClassId,

            targetSectionId: defaultTargetSectionId,
          };

          if (rollMode === "AUTO") {
            updated.rollNumber = nextAutoRoll;

            nextAutoRoll += 1;
          }

          if (rollMode === "KEEP_PREVIOUS") {
            if (row.currentRollNumber !== undefined) {
              updated.rollNumber = row.currentRollNumber;
            } else {
              delete updated.rollNumber;
            }
          }

          if (rollMode === "MANUAL") {
            delete updated.rollNumber;
          }

          return updated;
        }),
      );

      dispatch(clearPromotionPreview());
    } catch (error) {
      setLocalError(getErrorMessage(error));
    } finally {
      setApplyingTarget(false);
    }
  };

  // ===================================================
  // SELECT COUNT
  // ===================================================

  const selectedCount = rows.filter((row) => row.selected).length;

  const allSelected = rows.length > 0 && selectedCount === rows.length;

  // ===================================================
  // SELECT ALL
  // ===================================================

  const toggleAll = () => {
    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,

        selected: !allSelected,
      })),
    );

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // UPDATE ROW
  // ===================================================

  const updateRow = (
    studentId: string,
    updates: Partial<PromotionStudentRow>,
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.studentId === studentId
          ? {
              ...row,
              ...updates,
            }
          : row,
      ),
    );

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // ROW SELECT
  // ===================================================

  const handleRowSelect = (studentId: string, selected: boolean) => {
    updateRow(studentId, {
      selected,
    });
  };

  // ===================================================
  // DECISION CHANGE
  // ===================================================

  const handleDecisionChange = (
    studentId: string,
    decision: StudentPromotionDecision,
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.studentId !== studentId) {
          return row;
        }

        const updated: PromotionStudentRow = {
          ...row,

          decision,
        };

        if (!requiresTarget(decision)) {
          delete updated.targetClassId;

          delete updated.targetSectionId;

          delete updated.rollNumber;
        }

        return updated;
      }),
    );

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // ROW TARGET CLASS CHANGE
  // ===================================================

  const handleRowTargetClassChange = async (
    studentId: string,
    classId: string,
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.studentId !== studentId) {
          return row;
        }

        const updated: PromotionStudentRow = {
          ...row,

          targetClassId: classId,
        };

        delete updated.targetSectionId;

        return updated;
      }),
    );

    dispatch(clearPromotionPreview());

    if (classId) {
      await loadSectionsForClass(classId);
    }
  };

  // ===================================================
  // ROW TARGET SECTION CHANGE
  // ===================================================

  const handleRowTargetSectionChange = (
    studentId: string,
    sectionId: string,
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.studentId !== studentId) {
          return row;
        }

        const updated: PromotionStudentRow = {
          ...row,
        };

        if (sectionId) {
          updated.targetSectionId = sectionId;
        } else {
          delete updated.targetSectionId;
        }

        return updated;
      }),
    );

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // ROW ROLL CHANGE
  // ===================================================

  const handleRollChange = (studentId: string, value: string) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.studentId !== studentId) {
          return row;
        }

        const updated: PromotionStudentRow = {
          ...row,
        };

        if (!value) {
          delete updated.rollNumber;

          return updated;
        }

        const rollNumber = Number(value);

        updated.rollNumber = rollNumber;

        return updated;
      }),
    );

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // ROW REMARKS CHANGE
  // ===================================================

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.studentId !== studentId) {
          return row;
        }

        const updated: PromotionStudentRow = {
          ...row,
        };

        if (remarks) {
          updated.remarks = remarks;
        } else {
          delete updated.remarks;
        }

        return updated;
      }),
    );

    dispatch(clearPromotionPreview());
  };

  // ===================================================
  // BUILD PAYLOAD
  // ===================================================

  const buildPayload = (): BulkStudentPromotionRequest | null => {
    setLocalError(null);

    if (!sourceSessionId) {
      setLocalError("Source session is required.");

      return null;
    }

    if (!targetSessionId) {
      setLocalError("Target session is required.");

      return null;
    }

    if (sourceSessionId === targetSessionId) {
      setLocalError("Source and target sessions must be different.");

      return null;
    }

    const selectedRows = rows.filter((row) => row.selected);

    if (selectedRows.length === 0) {
      setLocalError("Please select at least one student.");

      return null;
    }

    for (const row of selectedRows) {
      if (requiresTarget(row.decision)) {
        if (!row.targetClassId) {
          setLocalError(`Target class is required for ${row.name}.`);

          return null;
        }

        if (!row.targetSectionId) {
          setLocalError(`Target section is required for ${row.name}.`);

          return null;
        }

        if (row.rollNumber !== undefined) {
          if (!Number.isInteger(row.rollNumber) || row.rollNumber < 1) {
            setLocalError(
              `Roll number must be a positive whole number for ${row.name}.`,
            );

            return null;
          }
        }
      }
    }

    const students = selectedRows.map((row) => {
      const item: {
        studentId: string;

        decision: StudentPromotionDecision;

        targetClassId?: string;

        targetSectionId?: string;

        rollNumber?: number;

        remarks?: string;
      } = {
        studentId: row.studentId,

        decision: row.decision,
      };

      if (requiresTarget(row.decision)) {
        if (row.targetClassId) {
          item.targetClassId = row.targetClassId;
        }

        if (row.targetSectionId) {
          item.targetSectionId = row.targetSectionId;
        }

        if (row.rollNumber !== undefined) {
          item.rollNumber = row.rollNumber;
        }
      }

      if (row.remarks && row.remarks.trim()) {
        item.remarks = row.remarks.trim();
      }

      return item;
    });

    return {
      sourceSessionId,

      targetSessionId,

      students,
    };
  };

  // ===================================================
  // PREVIEW
  // ===================================================

  const handlePreview = async () => {
    setSuccessMessage(null);

    const payload = buildPayload();

    if (!payload) {
      return;
    }

    try {
      await dispatch(previewBulkPromotion(payload)).unwrap();
    } catch (error) {
      setLocalError(getErrorMessage(error));
    }
  };

  const reloadPromotionCandidates = async (): Promise<void> => {
    if (!sourceSessionId || !sourceClassId) {
      setRows([]);

      return;
    }

    const filters: {
      sessionId: string;
      classId: string;
      sectionId?: string;
    } = {
      sessionId: sourceSessionId,
      classId: sourceClassId,
    };

    if (sourceSectionId) {
      filters.sectionId = sourceSectionId;
    }

    const result = await dispatch(getPromotionCandidates(filters)).unwrap();

    const mappedRows: PromotionStudentRow[] = result.map((candidate) => {
      const row: PromotionStudentRow = {
        studentId: candidate.studentId._id,
        admissionNumber: candidate.studentId.admissionNumber,
        name: candidate.studentId.name,
        currentClassId: candidate.classId._id,
        currentClassName: candidate.classId.name,
        currentSectionId: candidate.sectionId._id,
        currentSectionName: candidate.sectionId.name,
        selected: true,
        decision: "PROMOTED",
      };

      if (candidate.rollNumber !== undefined) {
        row.currentRollNumber = candidate.rollNumber;
      }

      return row;
    });

    setRows(mappedRows);
  };

  // ===================================================
  // EXECUTE PROMOTION
  // ===================================================

  const handlePromote = async () => {
    setLocalError(null);

    setSuccessMessage(null);

    if (!preview || !preview.canPromote) {
      setLocalError("Please run a successful promotion preview first.");

      return;
    }

    const payload = buildPayload();

    if (!payload) {
      return;
    }

    const confirmed = window.confirm(
      `Promote ${payload.students.length} selected student(s)? This will create their next academic enrollment.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await dispatch(bulkPromoteStudents(payload)).unwrap();

      setSuccessMessage(
        `Promotion completed. Promoted: ${result.promoted}, Retained: ${result.retained}, Transferred: ${result.transferred}, Left: ${result.left}, Graduated: ${result.graduated}, Failed: ${result.failed}.`,
      );

      setSearch("");

      dispatch(clearPromotionPreview());

      await reloadPromotionCandidates();
    } catch (error) {
      setLocalError(getErrorMessage(error));
    }
  };

  // ===================================================
  // FILTERED ROWS
  // ===================================================

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return rows;
    }

    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(value) ||
        row.admissionNumber.toLowerCase().includes(value),
    );
  }, [rows, search]);

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Bulk Student Promotion
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Promote, retain, transfer, leave or graduate students for the next
              academic session.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <Users size={18} />
            {selectedCount} selected
          </div>
        </div>

        {/* ERROR */}

        {(localError || error) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle size={19} className="mt-0.5 shrink-0" />

            <span>{localError || error}</span>
          </div>
        )}

        {/* SUCCESS */}

        {successMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

            <span>{successMessage}</span>
          </div>
        )}

        {/* SOURCE + TARGET */}

        <div className="grid gap-5 xl:grid-cols-2">
          {/* SOURCE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-slate-900">
              From
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Session
                </label>

                <div className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700">
                  {sourceSession?.name || "Select session from Topbar"}
                </div>
              </div>

              {/* SOURCE CLASS */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Class
                </label>

                <select
                  value={sourceClassId}
                  onChange={(event) =>
                    handleSourceClassChange(event.target.value)
                  }
                  disabled={!sourceSessionId}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                >
                  <option value="">Select class</option>

                  {sourceClasses.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SOURCE SECTION */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Section
                </label>

                <select
                  value={sourceSectionId}
                  onChange={(event) =>
                    handleSourceSectionChange(event.target.value)
                  }
                  disabled={!sourceClassId || sourceSectionsLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                >
                  <option value="">
                    {sourceSectionsLoading ? "Loading..." : "All Sections"}
                  </option>

                  {sourceSections.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoadStudents}
              disabled={candidatesLoading}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw
                size={17}
                className={candidatesLoading ? "animate-spin" : ""}
              />

              {candidatesLoading ? "Loading..." : "Load Students"}
            </button>
          </div>

          {/* TARGET */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-slate-900">To</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Session
                </label>

                <div className="flex min-h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700">
                  {targetSession?.name || "Next session not available"}
                </div>
              </div>

              {/* DEFAULT TARGET CLASS */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Class
                </label>

                <select
                  value={defaultTargetClassId}
                  onChange={(event) =>
                    handleDefaultTargetClassChange(event.target.value)
                  }
                  disabled={!targetSessionId}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                >
                  <option value="">Select class</option>

                  {targetClasses.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DEFAULT TARGET SECTION */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Section
                </label>

                <select
                  value={defaultTargetSectionId}
                  onChange={(event) =>
                    handleDefaultTargetSectionChange(event.target.value)
                  }
                  disabled={
                    !defaultTargetClassId || defaultTargetSectionsLoading
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                >
                  <option value="">
                    {defaultTargetSectionsLoading
                      ? "Loading..."
                      : "Select section"}
                  </option>

                  {defaultTargetSections.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROLL MODE */}

            <div className="mt-5 flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Roll Number
                </label>

                <select
                  value={rollMode}
                  onChange={(event) =>
                    setRollMode(event.target.value as RollAssignmentMode)
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="AUTO">Auto Assign</option>

                  <option value="KEEP_PREVIOUS">Keep Previous</option>

                  <option value="MANUAL">Manual</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleApplyTarget();
                }}
                disabled={rows.length === 0 || applyingTarget}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyingTarget
                  ? "Applying..."
                  : rollMode === "AUTO"
                    ? "Apply & Auto Assign"
                    : "Apply to Selected"}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* STUDENTS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Students</h2>

              <p className="text-sm text-slate-500">
                {rows.length} candidate(s)
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student..."
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                    />
                  </th>

                  <th className="px-4 py-3">Student</th>

                  <th className="px-4 py-3">Current</th>

                  <th className="px-4 py-3">Decision</th>

                  <th className="px-4 py-3">Target Class</th>

                  <th className="px-4 py-3">Target Section</th>

                  <th className="px-4 py-3">New Roll</th>

                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => {
                  const rowSections = row.targetClassId
                    ? sectionsByClass[row.targetClassId] || []
                    : [];

                  const rowSectionsLoading = row.targetClassId
                    ? loadingSectionClassIds.includes(row.targetClassId)
                    : false;

                  return (
                    <tr key={row.studentId} className="text-sm">
                      {/* SELECT */}

                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={(event) =>
                            handleRowSelect(
                              row.studentId,

                              event.target.checked,
                            )
                          }
                        />
                      </td>

                      {/* STUDENT */}

                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{row.name}</p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {row.admissionNumber}
                        </p>
                      </td>

                      {/* CURRENT */}

                      <td className="px-4 py-4 text-slate-600">
                        <div>
                          {row.currentClassName}
                          {" - "}
                          {row.currentSectionName}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-400">
                          Roll {row.currentRollNumber ?? "—"}
                        </div>
                      </td>

                      {/* DECISION */}

                      <td className="px-4 py-4">
                        <select
                          value={row.decision}
                          onChange={(event) =>
                            handleDecisionChange(
                              row.studentId,

                              event.target.value as StudentPromotionDecision,
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500"
                        >
                          <option value="PROMOTED">Promote</option>

                          <option value="RETAINED">Retain</option>

                          <option value="TRANSFERRED">Transferred</option>

                          <option value="LEFT">Left</option>

                          <option value="GRADUATED">Graduated</option>
                        </select>
                      </td>

                      {/* TARGET CLASS */}

                      <td className="px-4 py-4">
                        {requiresTarget(row.decision) ? (
                          <select
                            value={row.targetClassId ?? ""}
                            onChange={(event) => {
                              void handleRowTargetClassChange(
                                row.studentId,

                                event.target.value,
                              );
                            }}
                            disabled={!targetSessionId}
                            className="w-36 rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100"
                          >
                            <option value="">Select</option>

                            {targetClasses.map((classItem) => (
                              <option key={classItem._id} value={classItem._id}>
                                {classItem.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* TARGET SECTION */}

                      <td className="px-4 py-4">
                        {requiresTarget(row.decision) ? (
                          <select
                            value={row.targetSectionId ?? ""}
                            onChange={(event) =>
                              handleRowTargetSectionChange(
                                row.studentId,

                                event.target.value,
                              )
                            }
                            disabled={!row.targetClassId || rowSectionsLoading}
                            className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100"
                          >
                            <option value="">
                              {rowSectionsLoading ? "Loading..." : "Select"}
                            </option>

                            {rowSections.map((section) => (
                              <option key={section._id} value={section._id}>
                                {section.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* ROLL NUMBER */}

                      <td className="px-4 py-4">
                        {requiresTarget(row.decision) ? (
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={row.rollNumber ?? ""}
                            onChange={(event) =>
                              handleRollChange(
                                row.studentId,

                                event.target.value,
                              )
                            }
                            placeholder="Roll"
                            className="w-20 rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-indigo-500"
                          />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* REMARKS */}

                      <td className="px-4 py-4">
                        <input
                          value={row.remarks ?? ""}
                          onChange={(event) =>
                            handleRemarksChange(
                              row.studentId,

                              event.target.value,
                            )
                          }
                          placeholder="Optional"
                          className="w-40 rounded-lg border border-slate-300 px-2.5 py-2 outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })}

                {/* EMPTY */}

                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      Select source session and class, then load students.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PREVIEW */}

        {preview && (
          <div
            className={`rounded-2xl border p-5 ${
              preview.canPromote
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {preview.canPromote ? (
                <CheckCircle2 className="text-green-600" />
              ) : (
                <XCircle className="text-red-600" />
              )}

              <h2 className="font-semibold text-slate-900">
                Promotion Preview
              </h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <span>
                Total: <strong>{preview.total}</strong>
              </span>

              <span className="text-green-700">
                Valid: <strong>{preview.valid}</strong>
              </span>

              <span className="text-red-700">
                Invalid: <strong>{preview.invalid}</strong>
              </span>
            </div>

            {/* INVALID STUDENTS */}

            {preview.students
              .filter((student) => !student.valid)
              .map((student) => (
                <div
                  key={student.studentId}
                  className="mt-3 rounded-xl border border-red-100 bg-white p-3 text-sm text-red-700"
                >
                  <strong>{student.studentName || student.studentId}</strong>

                  {student.errors.map((message) => (
                    <div key={message} className="mt-1">
                      • {message}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}

        {/* PROMOTION SUMMARY */}

        {promotionSummary && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <h2 className="font-semibold text-green-800">Promotion Summary</h2>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-green-700">
              <span>
                Total: <strong>{promotionSummary.total}</strong>
              </span>

              <span>
                Promoted: <strong>{promotionSummary.promoted}</strong>
              </span>

              <span>
                Retained: <strong>{promotionSummary.retained}</strong>
              </span>

              <span>
                Transferred: <strong>{promotionSummary.transferred}</strong>
              </span>

              <span>
                Left: <strong>{promotionSummary.left}</strong>
              </span>

              <span>
                Graduated: <strong>{promotionSummary.graduated}</strong>
              </span>

              <span>
                Failed: <strong>{promotionSummary.failed}</strong>
              </span>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}

        <div className="flex flex-col justify-end gap-3 pb-6 sm:flex-row">
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewLoading || rows.length === 0}
            className="rounded-xl border border-indigo-600 px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {previewLoading ? "Checking..." : "Preview Promotion"}
          </button>

          <button
            type="button"
            onClick={handlePromote}
            disabled={promotionLoading || !preview?.canPromote}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {promotionLoading ? "Promoting..." : "Confirm & Promote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPromotion;
