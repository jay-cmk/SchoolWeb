// import React, { useEffect, useMemo, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import { createStudent } from "../../../features/student/student.slice";

// import type {
//   AdmissionCategory,
//   AdmissionType,
//   CreateStudentData,
//   StudentAddress,
//   StudentBloodGroup,
//   StudentCategory,
//   StudentGender,
//   StudentParentDetails,
// } from "../../../features/student/student.types";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSections } from "../../../features/academic/sections/section.slice";

// /* =====================================================
//    INITIAL ADDRESS
// ===================================================== */

// const emptyAddress = (): StudentAddress => ({
//   addressLine: "",
//   city: "",
//   district: "",
//   state: "",
//   pincode: "",
//   country: "India",
// });

// const emptyParent = (): StudentParentDetails => ({
//   name: "",
//   mobile: "",
//   aadhaarNumber: "",
//   occupation: "",
// });

// /* =====================================================
//    COMPONENT
// ===================================================== */

// const AddStudent: React.FC = () => {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   /* ===================================================
//      REDUX
//   =================================================== */

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes, loading: classLoading } = useAppSelector(
//     (state) => state.classes,
//   );

//   const { sections, loading: sectionLoading } = useAppSelector(
//     (state) => state.sections,
//   );

//   const { loading: studentLoading, error: studentError } = useAppSelector(
//     (state) => state.students,
//   );

//   const { selectedSessionId } = useAppSelector(
//     (state) => state.sessionSelection,
//   );

//   /* ===================================================
//      ACADEMIC STATE

//      Academic session global Topbar selection se aayega.
//      Add Student page apna alag session select nahi karega.
//   =================================================== */

//   const sessionId = selectedSessionId ?? "";

//   const [classId, setClassId] = useState("");

//   const [sectionId, setSectionId] = useState("");

//   /* ===================================================
//      ADMISSION STATE
//   =================================================== */

//   const [admissionNumber, setAdmissionNumber] = useState("");

//   const [rollNumber, setRollNumber] = useState("");

//   const [admissionDate, setAdmissionDate] = useState("");

//   const [admissionType, setAdmissionType] = useState<AdmissionType>("NEW");

//   const [admissionCategory, setAdmissionCategory] =
//     useState<AdmissionCategory>("REGULAR");

//   /* ===================================================
//      STUDENT STATE
//   =================================================== */

//   const [name, setName] = useState("");

//   const [dob, setDob] = useState("");

//   const [gender, setGender] = useState<StudentGender | "">("");

//   const [bloodGroup, setBloodGroup] = useState<StudentBloodGroup | "">("");

//   const [religion, setReligion] = useState("");

//   const [category, setCategory] = useState<StudentCategory | "">("");

//   const [caste, setCaste] = useState("");

//   const [aadhaarNumber, setAadhaarNumber] = useState("");

//   const [mobile, setMobile] = useState("");

//   const [email, setEmail] = useState("");

//   /* ===================================================
//      PHOTO
//   =================================================== */

//   const [photo, setPhoto] = useState<File | null>(null);

//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

//   /* ===================================================
//      ADDRESS
//   =================================================== */

//   const [currentAddress, setCurrentAddress] =
//     useState<StudentAddress>(emptyAddress());

//   const [permanentAddress, setPermanentAddress] =
//     useState<StudentAddress>(emptyAddress());

//   const [sameAsCurrent, setSameAsCurrent] = useState(false);

//   /* ===================================================
//      PARENTS
//   =================================================== */

//   const [father, setFather] = useState<StudentParentDetails>(emptyParent());

//   const [mother, setMother] = useState<StudentParentDetails>(emptyParent());

//   const [formError, setFormError] = useState<string | null>(null);

//   /* ===================================================
//      INITIAL DATA
//   =================================================== */

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }
//   }, [dispatch, sessions.length]);

//   /* ===================================================
//      GLOBAL SESSION CHANGE

//      Topbar selected session hi new student ki
//      admission session hogi.
//   =================================================== */

//   useEffect(() => {
//     setClassId("");

//     setSectionId("");

//     if (!sessionId) {
//       return;
//     }

//     dispatch(
//       getClasses({
//         sessionId,
//       }),
//     );
//   }, [dispatch, sessionId]);

//   /* ===================================================
//      PHOTO CLEANUP
//   =================================================== */

//   useEffect(() => {
//     return () => {
//       if (photoPreview) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   /* ===================================================
//      SELECTED SESSION
//   =================================================== */

//   const selectedSession = useMemo(() => {
//     if (!sessionId) {
//       return null;
//     }

//     return sessions.find((session) => session._id === sessionId) ?? null;
//   }, [sessions, sessionId]);

//   /* ===================================================
//      FILTER CLASSES
//   =================================================== */

//   const filteredClasses = useMemo(() => {
//     if (!sessionId) {
//       return [];
//     }

//     return classes.filter((classItem) => classItem.sessionId === sessionId);
//   }, [classes, sessionId]);

//   /* ===================================================
//      FILTER SECTIONS
//   =================================================== */

//   const filteredSections = useMemo(() => {
//     if (!sessionId || !classId) {
//       return [];
//     }

//     return sections.filter(
//       (section) =>
//         section.sessionId === sessionId && section.classId === classId,
//     );
//   }, [sections, sessionId, classId]);

//   /* ===================================================
//      CLASS CHANGE
//   =================================================== */

//   const handleClassChange = (value: string) => {
//     setClassId(value);

//     setSectionId("");

//     if (!sessionId || !value) {
//       return;
//     }

//     dispatch(
//       getSections({
//         sessionId,
//         classId: value,
//       }),
//     );
//   };

//   /* ===================================================
//      PHOTO CHANGE
//   =================================================== */

//   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

//     if (!allowedTypes.includes(file.type)) {
//       setFormError("Photo must be JPG, PNG or WEBP.");

//       event.target.value = "";

//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       setFormError("Student photo must be less than 2 MB.");

//       event.target.value = "";

//       return;
//     }

//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhoto(file);

//     setPhotoPreview(URL.createObjectURL(file));

//     setFormError(null);
//   };

//   const removePhoto = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhoto(null);
//     setPhotoPreview(null);
//   };

//   /* ===================================================
//      ADDRESS CHANGE
//   =================================================== */

//   const updateCurrentAddress = (key: keyof StudentAddress, value: string) => {
//     setCurrentAddress((previous) => ({
//       ...previous,
//       [key]: value,
//     }));

//     if (sameAsCurrent) {
//       setPermanentAddress((previous) => ({
//         ...previous,
//         [key]: value,
//       }));
//     }
//   };

//   const updatePermanentAddress = (key: keyof StudentAddress, value: string) => {
//     setPermanentAddress((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const handleSameAddressChange = (checked: boolean) => {
//     setSameAsCurrent(checked);

//     if (checked) {
//       setPermanentAddress({
//         ...currentAddress,
//       });
//     }
//   };

//   /* ===================================================
//      PARENT CHANGE
//   =================================================== */

//   const updateFather = (key: keyof StudentParentDetails, value: string) => {
//     setFather((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const updateMother = (key: keyof StudentParentDetails, value: string) => {
//     setMother((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   /* ===================================================
//      VALIDATION
//   =================================================== */

//   const validateAadhaar = (value: string, label: string) => {
//     if (value && !/^\d{12}$/.test(value)) {
//       setFormError(`${label} must contain exactly 12 digits.`);

//       return false;
//     }

//     return true;
//   };

//   const validateForm = () => {
//     if (!name.trim()) {
//       setFormError("Student name is required.");

//       return false;
//     }

//     if (!admissionNumber.trim()) {
//       setFormError("Admission number is required.");

//       return false;
//     }

//     if (!sessionId) {
//       setFormError("Please select an academic session from the Topbar.");

//       return false;
//     }

//     if (!classId) {
//       setFormError("Please select a class.");

//       return false;
//     }

//     if (!sectionId) {
//       setFormError("Please select a section.");

//       return false;
//     }

//     if (!gender) {
//       setFormError("Please select student gender.");

//       return false;
//     }

//     if (
//       rollNumber &&
//       (Number.isNaN(Number(rollNumber)) || Number(rollNumber) <= 0)
//     ) {
//       setFormError("Roll number must be a valid positive number.");

//       return false;
//     }

//     if (!validateAadhaar(aadhaarNumber, "Student Aadhaar number")) {
//       return false;
//     }

//     if (!validateAadhaar(father.aadhaarNumber ?? "", "Father Aadhaar number")) {
//       return false;
//     }

//     if (!validateAadhaar(mother.aadhaarNumber ?? "", "Mother Aadhaar number")) {
//       return false;
//     }

//     setFormError(null);

//     return true;
//   };

//   /* ===================================================
//      CLEAN ADDRESS
//   =================================================== */

//   const cleanAddress = (source: StudentAddress): StudentAddress => {
//     const result: StudentAddress = {};

//     if (source.addressLine?.trim()) {
//       result.addressLine = source.addressLine.trim();
//     }

//     if (source.city?.trim()) {
//       result.city = source.city.trim();
//     }

//     if (source.district?.trim()) {
//       result.district = source.district.trim();
//     }

//     if (source.state?.trim()) {
//       result.state = source.state.trim();
//     }

//     if (source.pincode?.trim()) {
//       result.pincode = source.pincode.trim();
//     }

//     if (source.country?.trim()) {
//       result.country = source.country.trim();
//     }

//     return result;
//   };

//   /* ===================================================
//      CLEAN PARENT
//   =================================================== */

//   const cleanParent = (source: StudentParentDetails): StudentParentDetails => {
//     const result: StudentParentDetails = {};

//     if (source.name?.trim()) {
//       result.name = source.name.trim();
//     }

//     if (source.mobile?.trim()) {
//       result.mobile = source.mobile.trim();
//     }

//     if (source.aadhaarNumber?.trim()) {
//       result.aadhaarNumber = source.aadhaarNumber.trim();
//     }

//     if (source.occupation?.trim()) {
//       result.occupation = source.occupation.trim();
//     }

//     return result;
//   };

//   /* ===================================================
//      SUBMIT
//   =================================================== */

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     /*
//      * Required backend fields only.
//      *
//      * Optional properties are added below
//      * conditionally because project uses
//      * exactOptionalPropertyTypes.
//      */

//     const data: CreateStudentData = {
//       name: name.trim(),

//       admissionNumber: admissionNumber.trim(),

//       sessionId,

//       classId,

//       sectionId,

//       gender: gender as StudentGender,

//       admissionType,

//       admissionCategory,
//     };

//     /* ===============================================
//        OPTIONAL ADMISSION DATA
//     =============================================== */

//     if (rollNumber) {
//       data.rollNumber = Number(rollNumber);
//     }

//     if (admissionDate) {
//       data.admissionDate = admissionDate;
//     }

//     /* ===============================================
//        OPTIONAL STUDENT DATA
//     =============================================== */

//     if (dob) {
//       data.dob = dob;
//     }

//     if (bloodGroup) {
//       data.bloodGroup = bloodGroup;
//     }

//     if (religion.trim()) {
//       data.religion = religion.trim();
//     }

//     if (category) {
//       data.category = category;
//     }

//     if (caste.trim()) {
//       data.caste = caste.trim();
//     }

//     if (aadhaarNumber.trim()) {
//       data.aadhaarNumber = aadhaarNumber.trim();
//     }

//     if (mobile.trim()) {
//       data.mobile = mobile.trim();
//     }

//     if (email.trim()) {
//       data.email = email.trim();
//     }

//     if (photo) {
//       data.photo = photo;
//     }

//     /* ===============================================
//        ADDRESS
//     =============================================== */

//     const cleanedCurrentAddress = cleanAddress(currentAddress);

//     if (Object.keys(cleanedCurrentAddress).length > 0) {
//       data.currentAddress = cleanedCurrentAddress;

//       /*
//        * Keep old address populated too
//        * for backward compatibility with
//        * existing Student screens.
//        */

//       data.address = cleanedCurrentAddress;
//     }

//     const cleanedPermanentAddress = cleanAddress(permanentAddress);

//     if (Object.keys(cleanedPermanentAddress).length > 0) {
//       data.permanentAddress = cleanedPermanentAddress;
//     }

//     /* ===============================================
//        PARENTS
//     =============================================== */

//     const cleanedFather = cleanParent(father);

//     if (Object.keys(cleanedFather).length > 0) {
//       data.father = cleanedFather;
//     }

//     const cleanedMother = cleanParent(mother);

//     if (Object.keys(cleanedMother).length > 0) {
//       data.mother = cleanedMother;
//     }

//     try {
//       await dispatch(createStudent(data)).unwrap();

//       navigate("/school-admin/students");
//     } catch (error) {
//       console.error("Failed to create student:", error);
//     }
//   };

//   /* ===================================================
//      COMMON CLASSES
//   =================================================== */

//   const inputClassName = `
//     min-h-11
//     w-full
//     rounded-lg
//     border
//     border-[#D1D5DB]
//     bg-white
//     px-3
//     text-sm
//     text-[#15243B]
//     outline-none
//     transition-all
//     placeholder:text-[#9CA3AF]
//     focus:border-[#1F5FAE]
//     focus:ring-1
//     focus:ring-[#1F5FAE]
//     disabled:cursor-not-allowed
//     disabled:bg-[#F9FAFB]
//     disabled:text-[#9CA3AF]
//   `;

//   const labelClassName = "mb-2 block text-sm font-semibold text-[#15243B]";

//   /* ===================================================
//      SECTION HEADER
//   =================================================== */

//   const SectionHeader = ({
//     icon,
//     title,
//     description,
//   }: {
//     icon: string;
//     title: string;
//     description: string;
//   }) => (
//     <div
//       className="
//         border-b
//         border-[#E5E7EB]
//         px-5
//         py-4
//       "
//     >
//       <div
//         className="
//           flex
//           items-center
//           gap-3
//         "
//       >
//         <div
//           className="
//             flex
//             h-10
//             w-10
//             shrink-0
//             items-center
//             justify-center
//             rounded-lg
//             bg-[#E8F0FB]
//             text-[#1F5FAE]
//           "
//         >
//           <Icon icon={icon} className="text-xl" />
//         </div>

//         <div>
//           <h2
//             className="
//               font-semibold
//               text-[#15243B]
//             "
//           >
//             {title}
//           </h2>

//           <p
//             className="
//               text-xs
//               text-[#6B7280]
//             "
//           >
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   /* ===================================================
//      UI
//   =================================================== */

//   return (
//     <div
//       className="
//         min-h-full
//         bg-[#F7F9FC]
//         p-4
//         md:p-6
//         lg:p-8
//       "
//     >
//       {/* ===============================================
//           HEADER
//       =============================================== */}

//       <div
//         className="
//           mb-6
//           flex
//           flex-col
//           gap-4
//           md:flex-row
//           md:items-center
//           md:justify-between
//         "
//       >
//         <div>
//           <div
//             className="
//               mb-2
//               flex
//               items-center
//               gap-2
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             <button
//               type="button"
//               onClick={() => navigate("/school-admin/students")}
//               className="
//                 transition-colors
//                 hover:text-[#1F5FAE]
//               "
//             >
//               Students
//             </button>

//             <Icon icon="lucide:chevron-right" />

//             <span
//               className="
//                 text-[#15243B]
//               "
//             >
//               Add Student
//             </span>
//           </div>

//           <h1
//             className="
//               text-2xl
//               font-bold
//               text-[#15243B]
//               md:text-3xl
//             "
//           >
//             Add Student
//           </h1>

//           <p
//             className="
//               mt-1
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             Add personal, academic, admission and parent details for a new
//             student.
//           </p>

//           {selectedSession && (
//             <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">
//               <Icon icon="lucide:calendar-days" />

//               {selectedSession.name}

//               {selectedSession.isCurrent && (
//                 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                   CURRENT
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={() => navigate("/school-admin/students")}
//           className="
//             inline-flex
//             min-h-11
//             items-center
//             justify-center
//             gap-2
//             rounded-lg
//             border
//             border-[#D1D5DB]
//             bg-white
//             px-4
//             text-sm
//             font-semibold
//             text-[#15243B]
//             transition-colors
//             hover:bg-[#F9FAFB]
//           "
//         >
//           <Icon icon="lucide:arrow-left" />
//           Back to Students
//         </button>
//       </div>

//       {!sessionId && (
//         <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
//           <Icon
//             icon="lucide:calendar-warning"
//             className="mt-0.5 shrink-0 text-xl text-amber-600"
//           />

//           <div>
//             <p className="text-sm font-semibold text-amber-800">
//               Academic session not selected
//             </p>

//             <p className="mt-1 text-sm text-amber-700">
//               Please select an academic session from the topbar before adding a
//               student.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ===============================================
//           ERROR
//       =============================================== */}

//       {(formError || studentError) && (
//         <div
//           className="
//             mb-6
//             flex
//             items-start
//             gap-3
//             rounded-lg
//             border
//             border-red-200
//             bg-red-50
//             p-4
//           "
//         >
//           <Icon
//             icon="lucide:circle-alert"
//             className="
//               mt-0.5
//               shrink-0
//               text-xl
//               text-red-500
//             "
//           />

//           <div>
//             <p
//               className="
//                 text-sm
//                 font-semibold
//                 text-red-700
//               "
//             >
//               Unable to add student
//             </p>

//             <p
//               className="
//                 mt-1
//                 text-sm
//                 text-red-600
//               "
//             >
//               {formError || studentError}
//             </p>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* =============================================
//             ACADEMIC DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:graduation-cap"
//             title="Academic Details"
//             description="Session comes from topbar. Select class and section for the new admission."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-3
//             "
//           >
//             <div>
//               <label className={labelClassName}>
//                 Academic Session
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <div
//                 className="
//                   flex
//                   min-h-11
//                   items-center
//                   gap-3
//                   rounded-lg
//                   border
//                   border-[#D1D5DB]
//                   bg-[#F9FAFB]
//                   px-3
//                   text-sm
//                   text-[#15243B]
//                 "
//               >
//                 <Icon
//                   icon="lucide:calendar-days"
//                   className="shrink-0 text-lg text-[#1F5FAE]"
//                 />

//                 <span className="font-medium">
//                   {selectedSession?.name ?? "Select a session from the Topbar"}
//                 </span>

//                 {selectedSession?.isCurrent && (
//                   <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                     CURRENT
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className={labelClassName}>
//                 Class
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <select
//                 value={classId}
//                 onChange={(event) => handleClassChange(event.target.value)}
//                 disabled={!sessionId || classLoading}
//                 className={inputClassName}
//               >
//                 <option value="">
//                   {classLoading
//                     ? "Loading classes..."
//                     : !sessionId
//                       ? "Select session first"
//                       : "Select class"}
//                 </option>

//                 {filteredClasses.map((classItem) => (
//                   <option key={classItem._id} value={classItem._id}>
//                     {classItem.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelClassName}>
//                 Section
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <select
//                 value={sectionId}
//                 onChange={(event) => setSectionId(event.target.value)}
//                 disabled={!classId || sectionLoading}
//                 className={inputClassName}
//               >
//                 <option value="">
//                   {sectionLoading
//                     ? "Loading sections..."
//                     : !classId
//                       ? "Select class first"
//                       : "Select section"}
//                 </option>

//                 {filteredSections.map((section) => (
//                   <option key={section._id} value={section._id}>
//                     {section.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             ADMISSION DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:clipboard-list"
//             title="Admission Details"
//             description="Enter student admission information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             <div>
//               <label className={labelClassName}>
//                 Admission Number
//                 <span className="ml-1 text-red-500">*</span>
//               </label>

//               <input
//                 type="text"
//                 value={admissionNumber}
//                 onChange={(event) => setAdmissionNumber(event.target.value)}
//                 placeholder="e.g. ADM-2026-001"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Roll Number</label>

//               <input
//                 type="number"
//                 min="1"
//                 value={rollNumber}
//                 onChange={(event) => setRollNumber(event.target.value)}
//                 placeholder="Enter roll number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Date</label>

//               <input
//                 type="date"
//                 value={admissionDate}
//                 onChange={(event) => setAdmissionDate(event.target.value)}
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Type</label>

//               <select
//                 value={admissionType}
//                 onChange={(event) =>
//                   setAdmissionType(event.target.value as AdmissionType)
//                 }
//                 className={inputClassName}
//               >
//                 <option value="NEW">New Admission</option>

//                 <option value="TRANSFER">Transfer</option>

//                 <option value="READMISSION">Re-admission</option>
//               </select>
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Category</label>

//               <select
//                 value={admissionCategory}
//                 onChange={(event) =>
//                   setAdmissionCategory(event.target.value as AdmissionCategory)
//                 }
//                 className={inputClassName}
//               >
//                 <option value="REGULAR">Regular</option>

//                 <option value="RTE">RTE</option>

//                 <option value="EWS">EWS</option>

//                 <option value="MANAGEMENT">Management</option>

//                 <option value="OTHER">Other</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             STUDENT DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user"
//             title="Student Details"
//             description="Enter personal and contact information."
//           />

//           <div className="p-5">
//             {/* PHOTO */}

//             <div
//               className="
//                 mb-6
//                 flex
//                 flex-col
//                 gap-4
//                 rounded-xl
//                 border
//                 border-dashed
//                 border-[#D1D5DB]
//                 bg-[#F9FAFB]
//                 p-4
//                 sm:flex-row
//                 sm:items-center
//               "
//             >
//               <div
//                 className="
//                   flex
//                   h-24
//                   w-24
//                   shrink-0
//                   items-center
//                   justify-center
//                   overflow-hidden
//                   rounded-xl
//                   border
//                   border-[#E5E7EB]
//                   bg-white
//                 "
//               >
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Student preview"
//                     className="
//                       h-full
//                       w-full
//                       object-cover
//                     "
//                   />
//                 ) : (
//                   <Icon
//                     icon="lucide:user-round"
//                     className="
//                       text-4xl
//                       text-[#9CA3AF]
//                     "
//                   />
//                 )}
//               </div>

//               <div className="flex-1">
//                 <p
//                   className="
//                     text-sm
//                     font-semibold
//                     text-[#15243B]
//                   "
//                 >
//                   Student Photo
//                 </p>

//                 <p
//                   className="
//                     mt-1
//                     text-xs
//                     text-[#6B7280]
//                   "
//                 >
//                   JPG, PNG or WEBP. Maximum file size 2 MB.
//                 </p>

//                 <div
//                   className="
//                     mt-3
//                     flex
//                     flex-wrap
//                     gap-2
//                   "
//                 >
//                   <label
//                     className="
//                       inline-flex
//                       min-h-10
//                       cursor-pointer
//                       items-center
//                       gap-2
//                       rounded-lg
//                       bg-[#1F5FAE]
//                       px-4
//                       text-sm
//                       font-semibold
//                       text-white
//                       hover:bg-[#174F91]
//                     "
//                   >
//                     <Icon icon="lucide:upload" />
//                     Choose Photo
//                     <input
//                       type="file"
//                       accept="
//                         image/jpeg,
//                         image/png,
//                         image/webp
//                       "
//                       onChange={handlePhotoChange}
//                       className="hidden"
//                     />
//                   </label>

//                   {photo && (
//                     <button
//                       type="button"
//                       onClick={removePhoto}
//                       className="
//                         min-h-10
//                         rounded-lg
//                         border
//                         border-[#D1D5DB]
//                         bg-white
//                         px-4
//                         text-sm
//                         font-semibold
//                         text-[#15243B]
//                       "
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               <div>
//                 <label className={labelClassName}>
//                   Student Name
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   placeholder="Enter student name"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Date of Birth</label>

//                 <input
//                   type="date"
//                   value={dob}
//                   onChange={(event) => setDob(event.target.value)}
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>
//                   Gender
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <select
//                   value={gender}
//                   onChange={(event) =>
//                     setGender(event.target.value as StudentGender | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select gender</option>

//                   <option value="MALE">Male</option>

//                   <option value="FEMALE">Female</option>

//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Blood Group</label>

//                 <select
//                   value={bloodGroup}
//                   onChange={(event) =>
//                     setBloodGroup(event.target.value as StudentBloodGroup | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select blood group</option>

//                   {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
//                     (group) => (
//                       <option key={group} value={group}>
//                         {group}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Religion</label>

//                 <input
//                   type="text"
//                   value={religion}
//                   onChange={(event) => setReligion(event.target.value)}
//                   placeholder="Enter religion"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Category</label>

//                 <select
//                   value={category}
//                   onChange={(event) =>
//                     setCategory(event.target.value as StudentCategory | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select category</option>

//                   <option value="GENERAL">General</option>

//                   <option value="OBC">OBC</option>

//                   <option value="SC">SC</option>

//                   <option value="ST">ST</option>

//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Caste</label>

//                 <input
//                   type="text"
//                   value={caste}
//                   onChange={(event) => setCaste(event.target.value)}
//                   placeholder="Enter caste"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Aadhaar Number</label>

//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={12}
//                   value={aadhaarNumber}
//                   onChange={(event) =>
//                     setAadhaarNumber(
//                       event.target.value.replace(/\D/g, "").slice(0, 12),
//                     )
//                   }
//                   placeholder="12 digit Aadhaar number"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Mobile</label>

//                 <input
//                   type="tel"
//                   value={mobile}
//                   onChange={(event) => setMobile(event.target.value)}
//                   placeholder="Enter mobile number"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Email</label>

//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   placeholder="Enter email"
//                   className={inputClassName}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             CURRENT ADDRESS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:map-pin"
//             title="Current Address"
//             description="Enter student's current residential address."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             <div className="md:col-span-2 xl:col-span-3">
//               <label className={labelClassName}>Address Line</label>

//               <input
//                 type="text"
//                 value={currentAddress.addressLine ?? ""}
//                 onChange={(event) =>
//                   updateCurrentAddress("addressLine", event.target.value)
//                 }
//                 placeholder="House no., street, locality"
//                 className={inputClassName}
//               />
//             </div>

//             {(
//               [
//                 ["city", "City", "Enter city"],
//                 ["district", "District", "Enter district"],
//                 ["state", "State", "Enter state"],
//                 ["pincode", "Pincode", "Enter pincode"],
//                 ["country", "Country", "Enter country"],
//               ] as const
//             ).map(([key, label, placeholder]) => (
//               <div key={key}>
//                 <label className={labelClassName}>{label}</label>

//                 <input
//                   type="text"
//                   value={currentAddress[key] ?? ""}
//                   onChange={(event) =>
//                     updateCurrentAddress(key, event.target.value)
//                   }
//                   placeholder={placeholder}
//                   className={inputClassName}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* =============================================
//             PERMANENT ADDRESS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:home"
//             title="Permanent Address"
//             description="Enter student's permanent residential address."
//           />

//           <div className="p-5">
//             <label
//               className="
//                 mb-5
//                 inline-flex
//                 cursor-pointer
//                 items-center
//                 gap-2
//                 text-sm
//                 font-medium
//                 text-[#15243B]
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={sameAsCurrent}
//                 onChange={(event) =>
//                   handleSameAddressChange(event.target.checked)
//                 }
//                 className="
//                   h-4
//                   w-4
//                   accent-[#1F5FAE]
//                 "
//               />
//               Same as Current Address
//             </label>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               <div className="md:col-span-2 xl:col-span-3">
//                 <label className={labelClassName}>Address Line</label>

//                 <input
//                   type="text"
//                   disabled={sameAsCurrent}
//                   value={permanentAddress.addressLine ?? ""}
//                   onChange={(event) =>
//                     updatePermanentAddress("addressLine", event.target.value)
//                   }
//                   placeholder="House no., street, locality"
//                   className={inputClassName}
//                 />
//               </div>

//               {(
//                 [
//                   ["city", "City", "Enter city"],
//                   ["district", "District", "Enter district"],
//                   ["state", "State", "Enter state"],
//                   ["pincode", "Pincode", "Enter pincode"],
//                   ["country", "Country", "Enter country"],
//                 ] as const
//               ).map(([key, label, placeholder]) => (
//                 <div key={key}>
//                   <label className={labelClassName}>{label}</label>

//                   <input
//                     type="text"
//                     disabled={sameAsCurrent}
//                     value={permanentAddress[key] ?? ""}
//                     onChange={(event) =>
//                       updatePermanentAddress(key, event.target.value)
//                     }
//                     placeholder={placeholder}
//                     className={inputClassName}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             FATHER DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user-round"
//             title="Father Details"
//             description="Enter student's father information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//             "
//           >
//             <div>
//               <label className={labelClassName}>Father Name</label>

//               <input
//                 type="text"
//                 value={father.name ?? ""}
//                 onChange={(event) => updateFather("name", event.target.value)}
//                 placeholder="Enter father name"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Mobile</label>

//               <input
//                 type="tel"
//                 value={father.mobile ?? ""}
//                 onChange={(event) => updateFather("mobile", event.target.value)}
//                 placeholder="Enter mobile number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Aadhaar Number</label>

//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={12}
//                 value={father.aadhaarNumber ?? ""}
//                 onChange={(event) =>
//                   updateFather(
//                     "aadhaarNumber",
//                     event.target.value.replace(/\D/g, "").slice(0, 12),
//                   )
//                 }
//                 placeholder="12 digit Aadhaar number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Occupation</label>

//               <input
//                 type="text"
//                 value={father.occupation ?? ""}
//                 onChange={(event) =>
//                   updateFather("occupation", event.target.value)
//                 }
//                 placeholder="Enter occupation"
//                 className={inputClassName}
//               />
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             MOTHER DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user-round"
//             title="Mother Details"
//             description="Enter student's mother information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//             "
//           >
//             <div>
//               <label className={labelClassName}>Mother Name</label>

//               <input
//                 type="text"
//                 value={mother.name ?? ""}
//                 onChange={(event) => updateMother("name", event.target.value)}
//                 placeholder="Enter mother name"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Mobile</label>

//               <input
//                 type="tel"
//                 value={mother.mobile ?? ""}
//                 onChange={(event) => updateMother("mobile", event.target.value)}
//                 placeholder="Enter mobile number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Aadhaar Number</label>

//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={12}
//                 value={mother.aadhaarNumber ?? ""}
//                 onChange={(event) =>
//                   updateMother(
//                     "aadhaarNumber",
//                     event.target.value.replace(/\D/g, "").slice(0, 12),
//                   )
//                 }
//                 placeholder="12 digit Aadhaar number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Occupation</label>

//               <input
//                 type="text"
//                 value={mother.occupation ?? ""}
//                 onChange={(event) =>
//                   updateMother("occupation", event.target.value)
//                 }
//                 placeholder="Enter occupation"
//                 className={inputClassName}
//               />
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             ACTIONS
//         ============================================= */}

//         <div
//           className="
//             flex
//             flex-col-reverse
//             gap-3
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//             p-5
//             sm:flex-row
//             sm:justify-end
//           "
//         >
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               min-h-11
//               rounded-lg
//               border
//               border-[#D1D5DB]
//               bg-white
//               px-5
//               text-sm
//               font-semibold
//               text-[#15243B]
//               transition-colors
//               hover:bg-[#F9FAFB]
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={studentLoading || !sessionId}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               bg-[#1F5FAE]
//               px-6
//               text-sm
//               font-semibold
//               text-white
//               shadow-sm
//               transition-colors
//               hover:bg-[#174F91]
//               disabled:cursor-not-allowed
//               disabled:opacity-60
//             "
//           >
//             {studentLoading ? (
//               <>
//                 <Icon
//                   icon="lucide:loader-circle"
//                   className="
//                     animate-spin
//                     text-lg
//                   "
//                 />
//                 Creating Student...
//               </>
//             ) : (
//               <>
//                 <Icon icon="lucide:user-plus" className="text-lg" />
//                 Add Student
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddStudent;

// import React, { useEffect, useMemo, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import {
//   clearStudentError,
//   createStudent,
//   createStudentAccount,
// } from "../../../features/student/student.slice";

// import type {
//   AdmissionCategory,
//   AdmissionType,
//   CreateStudentData,
//   StudentAddress,
//   StudentBloodGroup,
//   StudentCategory,
//   StudentGender,
//   StudentParentDetails,
// } from "../../../features/student/student.types";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSections } from "../../../features/academic/sections/section.slice";

// /* =====================================================
//    INITIAL ADDRESS
// ===================================================== */

// const emptyAddress = (): StudentAddress => ({
//   addressLine: "",
//   city: "",
//   district: "",
//   state: "",
//   pincode: "",
//   country: "India",
// });

// const emptyParent = (): StudentParentDetails => ({
//   name: "",
//   mobile: "",
//   aadhaarNumber: "",
//   occupation: "",
// });

// /* =====================================================
//    COMPONENT
// ===================================================== */

// const AddStudent: React.FC = () => {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   /* ===================================================
//      REDUX
//   =================================================== */

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes, loading: classLoading } = useAppSelector(
//     (state) => state.classes,
//   );

//   const { sections, loading: sectionLoading } = useAppSelector(
//     (state) => state.sections,
//   );

//   const { loading: studentLoading, error: studentError } = useAppSelector(
//     (state) => state.students,
//   );

//   const { selectedSessionId } = useAppSelector(
//     (state) => state.sessionSelection,
//   );

//   /* ===================================================
//      ACADEMIC STATE

//      Academic session global Topbar selection se aayega.
//      Add Student page apna alag session select nahi karega.
//   =================================================== */

//   const sessionId = selectedSessionId ?? "";

//   const [classId, setClassId] = useState("");

//   const [sectionId, setSectionId] = useState("");

//   /* ===================================================
//      ADMISSION STATE
//   =================================================== */

//   const [admissionNumber, setAdmissionNumber] = useState("");

//   const [rollNumber, setRollNumber] = useState("");

//   const [admissionDate, setAdmissionDate] = useState("");

//   const [admissionType, setAdmissionType] = useState<AdmissionType>("NEW");

//   const [admissionCategory, setAdmissionCategory] =
//     useState<AdmissionCategory>("REGULAR");

//   /* ===================================================
//      STUDENT STATE
//   =================================================== */

//   const [name, setName] = useState("");

//   const [dob, setDob] = useState("");

//   const [gender, setGender] = useState<StudentGender | "">("");

//   const [bloodGroup, setBloodGroup] = useState<StudentBloodGroup | "">("");

//   const [religion, setReligion] = useState("");

//   const [category, setCategory] = useState<StudentCategory | "">("");

//   const [caste, setCaste] = useState("");

//   const [aadhaarNumber, setAadhaarNumber] = useState("");

//   const [apaarId, setApaarId] = useState("");

//   const [mobile, setMobile] = useState("");

//   const [email, setEmail] = useState("");

//   /* ===================================================
//      STUDENT LOGIN ACCOUNT
//   =================================================== */

//   const [createLoginAccount, setCreateLoginAccount] = useState(true);

//   const [loginEmail, setLoginEmail] = useState("");

//   const [loginPassword, setLoginPassword] = useState("");

//   /* ===================================================
//      PHOTO
//   =================================================== */

//   const [photo, setPhoto] = useState<File | null>(null);

//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

//   /* ===================================================
//      ADDRESS
//   =================================================== */

//   const [currentAddress, setCurrentAddress] =
//     useState<StudentAddress>(emptyAddress());

//   const [permanentAddress, setPermanentAddress] =
//     useState<StudentAddress>(emptyAddress());

//   const [sameAsCurrent, setSameAsCurrent] = useState(false);

//   /* ===================================================
//      PARENTS
//   =================================================== */

//   const [father, setFather] = useState<StudentParentDetails>(emptyParent());

//   const [mother, setMother] = useState<StudentParentDetails>(emptyParent());

//   const [formError, setFormError] = useState<string | null>(null);

//   /* ===================================================
//      INITIAL DATA
//   =================================================== */

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }
//   }, [dispatch, sessions.length]);

//   /* ===================================================
//      GLOBAL SESSION CHANGE

//      Topbar selected session hi new student ki
//      admission session hogi.
//   =================================================== */

//   useEffect(() => {
//     setClassId("");

//     setSectionId("");

//     if (!sessionId) {
//       return;
//     }

//     dispatch(
//       getClasses({
//         sessionId,
//       }),
//     );
//   }, [dispatch, sessionId]);

//   /* ===================================================
//      PHOTO CLEANUP
//   =================================================== */

//   useEffect(() => {
//     return () => {
//       if (photoPreview) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   /* ===================================================
//      SELECTED SESSION
//   =================================================== */

//   const selectedSession = useMemo(() => {
//     if (!sessionId) {
//       return null;
//     }

//     return sessions.find((session) => session._id === sessionId) ?? null;
//   }, [sessions, sessionId]);

//   /* ===================================================
//      FILTER CLASSES
//   =================================================== */

//   const filteredClasses = useMemo(() => {
//     if (!sessionId) {
//       return [];
//     }

//     return classes.filter((classItem) => classItem.sessionId === sessionId);
//   }, [classes, sessionId]);

//   /* ===================================================
//      FILTER SECTIONS
//   =================================================== */

//   const filteredSections = useMemo(() => {
//     if (!sessionId || !classId) {
//       return [];
//     }

//     return sections.filter(
//       (section) =>
//         section.sessionId === sessionId && section.classId === classId,
//     );
//   }, [sections, sessionId, classId]);

//   /* ===================================================
//      CLASS CHANGE
//   =================================================== */

//   const handleClassChange = (value: string) => {
//     setClassId(value);

//     setSectionId("");

//     if (!sessionId || !value) {
//       return;
//     }

//     dispatch(
//       getSections({
//         sessionId,
//         classId: value,
//       }),
//     );
//   };

//   /* ===================================================
//      PHOTO CHANGE
//   =================================================== */

//   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

//     if (!allowedTypes.includes(file.type)) {
//       setFormError("Photo must be JPG, PNG or WEBP.");

//       event.target.value = "";

//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       setFormError("Student photo must be less than 2 MB.");

//       event.target.value = "";

//       return;
//     }

//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhoto(file);

//     setPhotoPreview(URL.createObjectURL(file));

//     setFormError(null);
//   };

//   const removePhoto = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhoto(null);
//     setPhotoPreview(null);
//   };

//   /* ===================================================
//      ADD NEW / RESET FORM
//   =================================================== */

//   const handleAddNew = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setClassId("");
//     setSectionId("");

//     setAdmissionNumber("");
//     setRollNumber("");
//     setAdmissionDate("");
//     setAdmissionType("NEW");
//     setAdmissionCategory("REGULAR");

//     setName("");
//     setDob("");
//     setGender("");
//     setBloodGroup("");
//     setReligion("");
//     setCategory("");
//     setCaste("");
//     setAadhaarNumber("");
//     setApaarId("");
//     setMobile("");
//     setEmail("");

//     setCreateLoginAccount(true);
//     setLoginEmail("");
//     setLoginPassword("");

//     setPhoto(null);
//     setPhotoPreview(null);

//     setCurrentAddress(emptyAddress());

//     setPermanentAddress(emptyAddress());

//     setSameAsCurrent(false);

//     setFather(emptyParent());

//     setMother(emptyParent());

//     setFormError(null);

//     dispatch(clearStudentError());

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* ===================================================
//      ADDRESS CHANGE
//   =================================================== */

//   const updateCurrentAddress = (key: keyof StudentAddress, value: string) => {
//     setCurrentAddress((previous) => ({
//       ...previous,
//       [key]: value,
//     }));

//     if (sameAsCurrent) {
//       setPermanentAddress((previous) => ({
//         ...previous,
//         [key]: value,
//       }));
//     }
//   };

//   const updatePermanentAddress = (key: keyof StudentAddress, value: string) => {
//     setPermanentAddress((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const handleSameAddressChange = (checked: boolean) => {
//     setSameAsCurrent(checked);

//     if (checked) {
//       setPermanentAddress({
//         ...currentAddress,
//       });
//     }
//   };

//   /* ===================================================
//      PARENT CHANGE
//   =================================================== */

//   const updateFather = (key: keyof StudentParentDetails, value: string) => {
//     setFather((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const updateMother = (key: keyof StudentParentDetails, value: string) => {
//     setMother((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   /* ===================================================
//      VALIDATION
//   =================================================== */

//   const validateAadhaar = (value: string, label: string) => {
//     if (value && !/^\d{12}$/.test(value)) {
//       setFormError(`${label} must contain exactly 12 digits.`);

//       return false;
//     }

//     return true;
//   };

//   const validateForm = () => {
//     if (!name.trim()) {
//       setFormError("Student name is required.");

//       return false;
//     }

//     if (!admissionNumber.trim()) {
//       setFormError("Admission number is required.");

//       return false;
//     }

//     if (!sessionId) {
//       setFormError("Please select an academic session from the Topbar.");

//       return false;
//     }

//     if (!classId) {
//       setFormError("Please select a class.");

//       return false;
//     }

//     if (!sectionId) {
//       setFormError("Please select a section.");

//       return false;
//     }

//     if (!gender) {
//       setFormError("Please select student gender.");

//       return false;
//     }

//     if (
//       rollNumber &&
//       (Number.isNaN(Number(rollNumber)) || Number(rollNumber) <= 0)
//     ) {
//       setFormError("Roll number must be a valid positive number.");

//       return false;
//     }

//     if (!validateAadhaar(aadhaarNumber, "Student Aadhaar number")) {
//       return false;
//     }

//     if (apaarId && !/^\d{12}$/.test(apaarId)) {
//       setFormError("APAAR ID must contain exactly 12 digits.");

//       return false;
//     }

//     if (!validateAadhaar(father.aadhaarNumber ?? "", "Father Aadhaar number")) {
//       return false;
//     }

//     if (!validateAadhaar(mother.aadhaarNumber ?? "", "Mother Aadhaar number")) {
//       return false;
//     }

//     if (createLoginAccount) {
//       if (!loginEmail.trim()) {
//         setFormError("Login email is required to create the student account.");

//         return false;
//       }

//       if (!/^\S+@\S+\.\S+$/.test(loginEmail.trim())) {
//         setFormError("Please enter a valid login email.");

//         return false;
//       }

//       if (loginPassword.length < 6) {
//         setFormError("Login password must be at least 6 characters.");

//         return false;
//       }
//     }

//     setFormError(null);

//     return true;
//   };

//   /* ===================================================
//      CLEAN ADDRESS
//   =================================================== */

//   const cleanAddress = (source: StudentAddress): StudentAddress => {
//     const result: StudentAddress = {};

//     if (source.addressLine?.trim()) {
//       result.addressLine = source.addressLine.trim();
//     }

//     if (source.city?.trim()) {
//       result.city = source.city.trim();
//     }

//     if (source.district?.trim()) {
//       result.district = source.district.trim();
//     }

//     if (source.state?.trim()) {
//       result.state = source.state.trim();
//     }

//     if (source.pincode?.trim()) {
//       result.pincode = source.pincode.trim();
//     }

//     if (source.country?.trim()) {
//       result.country = source.country.trim();
//     }

//     return result;
//   };

//   /* ===================================================
//      CLEAN PARENT
//   =================================================== */

//   const cleanParent = (source: StudentParentDetails): StudentParentDetails => {
//     const result: StudentParentDetails = {};

//     if (source.name?.trim()) {
//       result.name = source.name.trim();
//     }

//     if (source.mobile?.trim()) {
//       result.mobile = source.mobile.trim();
//     }

//     if (source.aadhaarNumber?.trim()) {
//       result.aadhaarNumber = source.aadhaarNumber.trim();
//     }

//     if (source.occupation?.trim()) {
//       result.occupation = source.occupation.trim();
//     }

//     return result;
//   };

//   /* ===================================================
//      SUBMIT
//   =================================================== */

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     /*
//      * Required backend fields only.
//      *
//      * Optional properties are added below
//      * conditionally because project uses
//      * exactOptionalPropertyTypes.
//      */

//     const data: CreateStudentData = {
//       name: name.trim(),

//       admissionNumber: admissionNumber.trim(),

//       sessionId,

//       classId,

//       sectionId,

//       gender: gender as StudentGender,

//       admissionType,

//       admissionCategory,
//     };

//     /* ===============================================
//        OPTIONAL ADMISSION DATA
//     =============================================== */

//     if (rollNumber) {
//       data.rollNumber = Number(rollNumber);
//     }

//     if (admissionDate) {
//       data.admissionDate = admissionDate;
//     }

//     /* ===============================================
//        OPTIONAL STUDENT DATA
//     =============================================== */

//     if (dob) {
//       data.dob = dob;
//     }

//     if (bloodGroup) {
//       data.bloodGroup = bloodGroup;
//     }

//     if (religion.trim()) {
//       data.religion = religion.trim();
//     }

//     if (category) {
//       data.category = category;
//     }

//     if (caste.trim()) {
//       data.caste = caste.trim();
//     }

//     if (aadhaarNumber.trim()) {
//       data.aadhaarNumber = aadhaarNumber.trim();
//     }

//     if (apaarId.trim()) {
//       data.apaarId = apaarId.trim();
//     }

//     if (mobile.trim()) {
//       data.mobile = mobile.trim();
//     }

//     if (email.trim()) {
//       data.email = email.trim();
//     }

//     if (photo) {
//       data.photo = photo;
//     }

//     /* ===============================================
//        ADDRESS
//     =============================================== */

//     const cleanedCurrentAddress = cleanAddress(currentAddress);

//     if (Object.keys(cleanedCurrentAddress).length > 0) {
//       data.currentAddress = cleanedCurrentAddress;

//       /*
//        * Keep old address populated too
//        * for backward compatibility with
//        * existing Student screens.
//        */

//       data.address = cleanedCurrentAddress;
//     }

//     const cleanedPermanentAddress = cleanAddress(permanentAddress);

//     if (Object.keys(cleanedPermanentAddress).length > 0) {
//       data.permanentAddress = cleanedPermanentAddress;
//     }

//     /* ===============================================
//        PARENTS
//     =============================================== */

//     const cleanedFather = cleanParent(father);

//     if (Object.keys(cleanedFather).length > 0) {
//       data.father = cleanedFather;
//     }

//     const cleanedMother = cleanParent(mother);

//     if (Object.keys(cleanedMother).length > 0) {
//       data.mother = cleanedMother;
//     }

//     try {
//       const createdStudent = await dispatch(createStudent(data)).unwrap();

//       if (createLoginAccount) {
//         await dispatch(
//           createStudentAccount({
//             studentId: createdStudent._id,

//             data: {
//               email: loginEmail.trim().toLowerCase(),

//               password: loginPassword,
//             },
//           }),
//         ).unwrap();
//       }

//       navigate("/school-admin/students");
//     } catch (error) {
//       console.error("Failed to create student:", error);
//     }
//   };

//   /* ===================================================
//      COMMON CLASSES
//   =================================================== */

//   const inputClassName = `
//     min-h-11
//     w-full
//     rounded-lg
//     border
//     border-[#D1D5DB]
//     bg-white
//     px-3
//     text-sm
//     text-[#15243B]
//     outline-none
//     transition-all
//     placeholder:text-[#9CA3AF]
//     focus:border-[#1F5FAE]
//     focus:ring-1
//     focus:ring-[#1F5FAE]
//     disabled:cursor-not-allowed
//     disabled:bg-[#F9FAFB]
//     disabled:text-[#9CA3AF]
//   `;

//   const labelClassName = "mb-2 block text-sm font-semibold text-[#15243B]";

//   /* ===================================================
//      SECTION HEADER
//   =================================================== */

//   const SectionHeader = ({
//     icon,
//     title,
//     description,
//   }: {
//     icon: string;
//     title: string;
//     description: string;
//   }) => (
//     <div
//       className="
//         border-b
//         border-[#E5E7EB]
//         px-5
//         py-4
//       "
//     >
//       <div
//         className="
//           flex
//           items-center
//           gap-3
//         "
//       >
//         <div
//           className="
//             flex
//             h-10
//             w-10
//             shrink-0
//             items-center
//             justify-center
//             rounded-lg
//             bg-[#E8F0FB]
//             text-[#1F5FAE]
//           "
//         >
//           <Icon icon={icon} className="text-xl" />
//         </div>

//         <div>
//           <h2
//             className="
//               font-semibold
//               text-[#15243B]
//             "
//           >
//             {title}
//           </h2>

//           <p
//             className="
//               text-xs
//               text-[#6B7280]
//             "
//           >
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   /* ===================================================
//      UI
//   =================================================== */

//   return (
//     <div
//       className="
//         min-h-full
//         bg-[#F7F9FC]
//         p-4
//         md:p-6
//         lg:p-8
//       "
//     >
//       {/* ===============================================
//           HEADER
//       =============================================== */}

//       <div
//         className="
//           mb-6
//           flex
//           flex-col
//           gap-4
//           md:flex-row
//           md:items-center
//           md:justify-between
//         "
//       >
//         <div>
//           <div
//             className="
//               mb-2
//               flex
//               items-center
//               gap-2
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             <button
//               type="button"
//               onClick={() => navigate("/school-admin/students")}
//               className="
//                 transition-colors
//                 hover:text-[#1F5FAE]
//               "
//             >
//               Students
//             </button>

//             <Icon icon="lucide:chevron-right" />

//             <span
//               className="
//                 text-[#15243B]
//               "
//             >
//               Add Student
//             </span>
//           </div>

//           <h1
//             className="
//               text-2xl
//               font-bold
//               text-[#15243B]
//               md:text-3xl
//             "
//           >
//             Add Student
//           </h1>

//           <p
//             className="
//               mt-1
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             Add personal, academic, admission and parent details for a new
//             student.
//           </p>

//           {selectedSession && (
//             <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">
//               <Icon icon="lucide:calendar-days" />

//               {selectedSession.name}

//               {selectedSession.isCurrent && (
//                 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                   CURRENT
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={handleAddNew}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               bg-[#1F5FAE]
//               px-4
//               text-sm
//               font-semibold
//               text-white
//               transition-colors
//               hover:bg-[#174F91]
//               disabled:cursor-not-allowed
//               disabled:opacity-60
//             "
//           >
//             <Icon icon="lucide:plus" />
//             Add New
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               border
//               border-[#D1D5DB]
//               bg-white
//               px-4
//               text-sm
//               font-semibold
//               text-[#15243B]
//               transition-colors
//               hover:bg-[#F9FAFB]
//             "
//           >
//             <Icon icon="lucide:arrow-left" />
//             Back to Students
//           </button>
//         </div>
//       </div>

//       {!sessionId && (
//         <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
//           <Icon
//             icon="lucide:calendar-warning"
//             className="mt-0.5 shrink-0 text-xl text-amber-600"
//           />

//           <div>
//             <p className="text-sm font-semibold text-amber-800">
//               Academic session not selected
//             </p>

//             <p className="mt-1 text-sm text-amber-700">
//               Please select an academic session from the topbar before adding a
//               student.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ===============================================
//           ERROR
//       =============================================== */}

//       {(formError || studentError) && (
//         <div
//           className="
//             mb-6
//             flex
//             items-start
//             gap-3
//             rounded-lg
//             border
//             border-red-200
//             bg-red-50
//             p-4
//           "
//         >
//           <Icon
//             icon="lucide:circle-alert"
//             className="
//               mt-0.5
//               shrink-0
//               text-xl
//               text-red-500
//             "
//           />

//           <div>
//             <p
//               className="
//                 text-sm
//                 font-semibold
//                 text-red-700
//               "
//             >
//               Unable to add student
//             </p>

//             <p
//               className="
//                 mt-1
//                 text-sm
//                 text-red-600
//               "
//             >
//               {formError || studentError}
//             </p>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* =============================================
//             ACADEMIC DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:graduation-cap"
//             title="Academic Details"
//             description="Session comes from topbar. Select class and section for the new admission."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-3
//             "
//           >
//             <div>
//               <label className={labelClassName}>
//                 Academic Session
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <div
//                 className="
//                   flex
//                   min-h-11
//                   items-center
//                   gap-3
//                   rounded-lg
//                   border
//                   border-[#D1D5DB]
//                   bg-[#F9FAFB]
//                   px-3
//                   text-sm
//                   text-[#15243B]
//                 "
//               >
//                 <Icon
//                   icon="lucide:calendar-days"
//                   className="shrink-0 text-lg text-[#1F5FAE]"
//                 />

//                 <span className="font-medium">
//                   {selectedSession?.name ?? "Select a session from the Topbar"}
//                 </span>

//                 {selectedSession?.isCurrent && (
//                   <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                     CURRENT
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className={labelClassName}>
//                 Class
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <select
//                 value={classId}
//                 onChange={(event) => handleClassChange(event.target.value)}
//                 disabled={!sessionId || classLoading}
//                 className={inputClassName}
//               >
//                 <option value="">
//                   {classLoading
//                     ? "Loading classes..."
//                     : !sessionId
//                       ? "Select session first"
//                       : "Select class"}
//                 </option>

//                 {filteredClasses.map((classItem) => (
//                   <option key={classItem._id} value={classItem._id}>
//                     {classItem.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelClassName}>
//                 Section
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <select
//                 value={sectionId}
//                 onChange={(event) => setSectionId(event.target.value)}
//                 disabled={!classId || sectionLoading}
//                 className={inputClassName}
//               >
//                 <option value="">
//                   {sectionLoading
//                     ? "Loading sections..."
//                     : !classId
//                       ? "Select class first"
//                       : "Select section"}
//                 </option>

//                 {filteredSections.map((section) => (
//                   <option key={section._id} value={section._id}>
//                     {section.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             ADMISSION DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:clipboard-list"
//             title="Admission Details"
//             description="Enter student admission information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             <div>
//               <label className={labelClassName}>
//                 Admission Number
//                 <span className="ml-1 text-red-500">*</span>
//               </label>

//               <input
//                 type="text"
//                 value={admissionNumber}
//                 onChange={(event) => setAdmissionNumber(event.target.value)}
//                 placeholder="e.g. ADM-2026-001"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Roll Number</label>

//               <input
//                 type="number"
//                 min="1"
//                 value={rollNumber}
//                 onChange={(event) => setRollNumber(event.target.value)}
//                 placeholder="Enter roll number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Date</label>

//               <input
//                 type="date"
//                 value={admissionDate}
//                 onChange={(event) => setAdmissionDate(event.target.value)}
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Type</label>

//               <select
//                 value={admissionType}
//                 onChange={(event) =>
//                   setAdmissionType(event.target.value as AdmissionType)
//                 }
//                 className={inputClassName}
//               >
//                 <option value="NEW">New Admission</option>

//                 <option value="TRANSFER">Transfer</option>

//                 <option value="READMISSION">Re-admission</option>
//               </select>
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Category</label>

//               <select
//                 value={admissionCategory}
//                 onChange={(event) =>
//                   setAdmissionCategory(event.target.value as AdmissionCategory)
//                 }
//                 className={inputClassName}
//               >
//                 <option value="REGULAR">Regular</option>

//                 <option value="RTE">RTE</option>

//                 <option value="EWS">EWS</option>

//                 <option value="MANAGEMENT">Management</option>

//                 <option value="OTHER">Other</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             STUDENT DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user"
//             title="Student Details"
//             description="Enter personal and contact information."
//           />

//           <div className="p-5">
//             {/* PHOTO */}

//             <div
//               className="
//                 mb-6
//                 flex
//                 flex-col
//                 gap-4
//                 rounded-xl
//                 border
//                 border-dashed
//                 border-[#D1D5DB]
//                 bg-[#F9FAFB]
//                 p-4
//                 sm:flex-row
//                 sm:items-center
//               "
//             >
//               <div
//                 className="
//                   flex
//                   h-24
//                   w-24
//                   shrink-0
//                   items-center
//                   justify-center
//                   overflow-hidden
//                   rounded-xl
//                   border
//                   border-[#E5E7EB]
//                   bg-white
//                 "
//               >
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Student preview"
//                     className="
//                       h-full
//                       w-full
//                       object-cover
//                     "
//                   />
//                 ) : (
//                   <Icon
//                     icon="lucide:user-round"
//                     className="
//                       text-4xl
//                       text-[#9CA3AF]
//                     "
//                   />
//                 )}
//               </div>

//               <div className="flex-1">
//                 <p
//                   className="
//                     text-sm
//                     font-semibold
//                     text-[#15243B]
//                   "
//                 >
//                   Student Photo
//                 </p>

//                 <p
//                   className="
//                     mt-1
//                     text-xs
//                     text-[#6B7280]
//                   "
//                 >
//                   JPG, PNG or WEBP. Maximum file size 2 MB.
//                 </p>

//                 <div
//                   className="
//                     mt-3
//                     flex
//                     flex-wrap
//                     gap-2
//                   "
//                 >
//                   <label
//                     className="
//                       inline-flex
//                       min-h-10
//                       cursor-pointer
//                       items-center
//                       gap-2
//                       rounded-lg
//                       bg-[#1F5FAE]
//                       px-4
//                       text-sm
//                       font-semibold
//                       text-white
//                       hover:bg-[#174F91]
//                     "
//                   >
//                     <Icon icon="lucide:upload" />
//                     Choose Photo
//                     <input
//                       type="file"
//                       accept="
//                         image/jpeg,
//                         image/png,
//                         image/webp
//                       "
//                       onChange={handlePhotoChange}
//                       className="hidden"
//                     />
//                   </label>

//                   {photo && (
//                     <button
//                       type="button"
//                       onClick={removePhoto}
//                       className="
//                         min-h-10
//                         rounded-lg
//                         border
//                         border-[#D1D5DB]
//                         bg-white
//                         px-4
//                         text-sm
//                         font-semibold
//                         text-[#15243B]
//                       "
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               <div>
//                 <label className={labelClassName}>
//                   Student Name
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   placeholder="Enter student name"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Date of Birth</label>

//                 <input
//                   type="date"
//                   value={dob}
//                   onChange={(event) => setDob(event.target.value)}
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>
//                   Gender
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <select
//                   value={gender}
//                   onChange={(event) =>
//                     setGender(event.target.value as StudentGender | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select gender</option>

//                   <option value="MALE">Male</option>

//                   <option value="FEMALE">Female</option>

//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Blood Group</label>

//                 <select
//                   value={bloodGroup}
//                   onChange={(event) =>
//                     setBloodGroup(event.target.value as StudentBloodGroup | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select blood group</option>

//                   {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
//                     (group) => (
//                       <option key={group} value={group}>
//                         {group}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Religion</label>

//                 <input
//                   type="text"
//                   value={religion}
//                   onChange={(event) => setReligion(event.target.value)}
//                   placeholder="Enter religion"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Category</label>

//                 <select
//                   value={category}
//                   onChange={(event) =>
//                     setCategory(event.target.value as StudentCategory | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select category</option>

//                   <option value="GENERAL">General</option>

//                   <option value="OBC">OBC</option>

//                   <option value="SC">SC</option>

//                   <option value="ST">ST</option>

//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Caste</label>

//                 <input
//                   type="text"
//                   value={caste}
//                   onChange={(event) => setCaste(event.target.value)}
//                   placeholder="Enter caste"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Aadhaar Number</label>

//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={12}
//                   value={aadhaarNumber}
//                   onChange={(event) =>
//                     setAadhaarNumber(
//                       event.target.value.replace(/\D/g, "").slice(0, 12),
//                     )
//                   }
//                   placeholder="12 digit Aadhaar number"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>APAAR ID</label>

//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={12}
//                   value={apaarId}
//                   onChange={(event) =>
//                     setApaarId(
//                       event.target.value.replace(/\D/g, "").slice(0, 12),
//                     )
//                   }
//                   placeholder="12 digit APAAR ID"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Mobile</label>

//                 <input
//                   type="tel"
//                   value={mobile}
//                   onChange={(event) => setMobile(event.target.value)}
//                   placeholder="Enter mobile number"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Email</label>

//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   placeholder="Enter email"
//                   className={inputClassName}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             STUDENT LOGIN ACCOUNT
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:key-round"
//             title="Student Login Account"
//             description="Create login credentials so the student can access the mobile application."
//           />

//           <div className="p-5">
//             <label
//               className="
//                 mb-5
//                 inline-flex
//                 cursor-pointer
//                 items-center
//                 gap-2
//                 text-sm
//                 font-medium
//                 text-[#15243B]
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={createLoginAccount}
//                 onChange={(event) =>
//                   setCreateLoginAccount(event.target.checked)
//                 }
//                 className="
//                   h-4
//                   w-4
//                   accent-[#1F5FAE]
//                 "
//               />
//               Create student login account
//             </label>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//               "
//             >
//               <div>
//                 <label className={labelClassName}>
//                   Login Email
//                   {createLoginAccount && (
//                     <span className="ml-1 text-red-500">*</span>
//                   )}
//                 </label>

//                 <input
//                   type="email"
//                   disabled={!createLoginAccount}
//                   value={loginEmail}
//                   onChange={(event) => setLoginEmail(event.target.value)}
//                   placeholder="student@example.com"
//                   autoComplete="off"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>
//                   Login Password
//                   {createLoginAccount && (
//                     <span className="ml-1 text-red-500">*</span>
//                   )}
//                 </label>

//                 <input
//                   type="password"
//                   disabled={!createLoginAccount}
//                   value={loginPassword}
//                   onChange={(event) => setLoginPassword(event.target.value)}
//                   placeholder="Minimum 6 characters"
//                   minLength={6}
//                   autoComplete="new-password"
//                   className={inputClassName}
//                 />
//               </div>
//             </div>

//             {createLoginAccount && (
//               <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
//                 <Icon
//                   icon="lucide:info"
//                   className="mt-0.5 shrink-0 text-base"
//                 />

//                 <p>
//                   Student profile create hone ke baad isi email aur password se
//                   login account automatically create hoga.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* =============================================
//             CURRENT ADDRESS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:map-pin"
//             title="Current Address"
//             description="Enter student's current residential address."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             <div className="md:col-span-2 xl:col-span-3">
//               <label className={labelClassName}>Address Line</label>

//               <input
//                 type="text"
//                 value={currentAddress.addressLine ?? ""}
//                 onChange={(event) =>
//                   updateCurrentAddress("addressLine", event.target.value)
//                 }
//                 placeholder="House no., street, locality"
//                 className={inputClassName}
//               />
//             </div>

//             {(
//               [
//                 ["city", "City", "Enter city"],
//                 ["district", "District", "Enter district"],
//                 ["state", "State", "Enter state"],
//                 ["pincode", "Pincode", "Enter pincode"],
//                 ["country", "Country", "Enter country"],
//               ] as const
//             ).map(([key, label, placeholder]) => (
//               <div key={key}>
//                 <label className={labelClassName}>{label}</label>

//                 <input
//                   type="text"
//                   value={currentAddress[key] ?? ""}
//                   onChange={(event) =>
//                     updateCurrentAddress(key, event.target.value)
//                   }
//                   placeholder={placeholder}
//                   className={inputClassName}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* =============================================
//             PERMANENT ADDRESS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:home"
//             title="Permanent Address"
//             description="Enter student's permanent residential address."
//           />

//           <div className="p-5">
//             <label
//               className="
//                 mb-5
//                 inline-flex
//                 cursor-pointer
//                 items-center
//                 gap-2
//                 text-sm
//                 font-medium
//                 text-[#15243B]
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={sameAsCurrent}
//                 onChange={(event) =>
//                   handleSameAddressChange(event.target.checked)
//                 }
//                 className="
//                   h-4
//                   w-4
//                   accent-[#1F5FAE]
//                 "
//               />
//               Same as Current Address
//             </label>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               <div className="md:col-span-2 xl:col-span-3">
//                 <label className={labelClassName}>Address Line</label>

//                 <input
//                   type="text"
//                   disabled={sameAsCurrent}
//                   value={permanentAddress.addressLine ?? ""}
//                   onChange={(event) =>
//                     updatePermanentAddress("addressLine", event.target.value)
//                   }
//                   placeholder="House no., street, locality"
//                   className={inputClassName}
//                 />
//               </div>

//               {(
//                 [
//                   ["city", "City", "Enter city"],
//                   ["district", "District", "Enter district"],
//                   ["state", "State", "Enter state"],
//                   ["pincode", "Pincode", "Enter pincode"],
//                   ["country", "Country", "Enter country"],
//                 ] as const
//               ).map(([key, label, placeholder]) => (
//                 <div key={key}>
//                   <label className={labelClassName}>{label}</label>

//                   <input
//                     type="text"
//                     disabled={sameAsCurrent}
//                     value={permanentAddress[key] ?? ""}
//                     onChange={(event) =>
//                       updatePermanentAddress(key, event.target.value)
//                     }
//                     placeholder={placeholder}
//                     className={inputClassName}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             FATHER DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user-round"
//             title="Father Details"
//             description="Enter student's father information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//             "
//           >
//             <div>
//               <label className={labelClassName}>Father Name</label>

//               <input
//                 type="text"
//                 value={father.name ?? ""}
//                 onChange={(event) => updateFather("name", event.target.value)}
//                 placeholder="Enter father name"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Mobile</label>

//               <input
//                 type="tel"
//                 value={father.mobile ?? ""}
//                 onChange={(event) => updateFather("mobile", event.target.value)}
//                 placeholder="Enter mobile number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Aadhaar Number</label>

//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={12}
//                 value={father.aadhaarNumber ?? ""}
//                 onChange={(event) =>
//                   updateFather(
//                     "aadhaarNumber",
//                     event.target.value.replace(/\D/g, "").slice(0, 12),
//                   )
//                 }
//                 placeholder="12 digit Aadhaar number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Occupation</label>

//               <input
//                 type="text"
//                 value={father.occupation ?? ""}
//                 onChange={(event) =>
//                   updateFather("occupation", event.target.value)
//                 }
//                 placeholder="Enter occupation"
//                 className={inputClassName}
//               />
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             MOTHER DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user-round"
//             title="Mother Details"
//             description="Enter student's mother information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//             "
//           >
//             <div>
//               <label className={labelClassName}>Mother Name</label>

//               <input
//                 type="text"
//                 value={mother.name ?? ""}
//                 onChange={(event) => updateMother("name", event.target.value)}
//                 placeholder="Enter mother name"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Mobile</label>

//               <input
//                 type="tel"
//                 value={mother.mobile ?? ""}
//                 onChange={(event) => updateMother("mobile", event.target.value)}
//                 placeholder="Enter mobile number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Aadhaar Number</label>

//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={12}
//                 value={mother.aadhaarNumber ?? ""}
//                 onChange={(event) =>
//                   updateMother(
//                     "aadhaarNumber",
//                     event.target.value.replace(/\D/g, "").slice(0, 12),
//                   )
//                 }
//                 placeholder="12 digit Aadhaar number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Occupation</label>

//               <input
//                 type="text"
//                 value={mother.occupation ?? ""}
//                 onChange={(event) =>
//                   updateMother("occupation", event.target.value)
//                 }
//                 placeholder="Enter occupation"
//                 className={inputClassName}
//               />
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             ACTIONS
//         ============================================= */}

//         <div
//           className="
//             flex
//             flex-col-reverse
//             gap-3
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//             p-5
//             sm:flex-row
//             sm:justify-end
//           "
//         >
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               min-h-11
//               rounded-lg
//               border
//               border-[#D1D5DB]
//               bg-white
//               px-5
//               text-sm
//               font-semibold
//               text-[#15243B]
//               transition-colors
//               hover:bg-[#F9FAFB]
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={studentLoading || !sessionId}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               bg-[#1F5FAE]
//               px-6
//               text-sm
//               font-semibold
//               text-white
//               shadow-sm
//               transition-colors
//               hover:bg-[#174F91]
//               disabled:cursor-not-allowed
//               disabled:opacity-60
//             "
//           >
//             {studentLoading ? (
//               <>
//                 <Icon
//                   icon="lucide:loader-circle"
//                   className="
//                     animate-spin
//                     text-lg
//                   "
//                 />
//                 Creating Student...
//               </>
//             ) : (
//               <>
//                 <Icon icon="lucide:user-plus" className="text-lg" />
//                 Add Student
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddStudent;

// import React, { useEffect, useMemo, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import { Icon } from "@iconify/react";

// import {
//   clearStudentError,
//   createStudent,
//   createStudentAccount,
// } from "../../../features/student/student.slice";

// import type {
//   AdmissionCategory,
//   AdmissionType,
//   CreateStudentData,
//   StudentAddress,
//   StudentBloodGroup,
//   StudentCategory,
//   StudentGender,
//   StudentParentDetails,
// } from "../../../features/student/student.types";

// import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// import { getSessions } from "../../../features/academic/sessions/session.slice";

// import { getClasses } from "../../../features/academic/classes/class.slice";

// import { getSections } from "../../../features/academic/sections/section.slice";

// /* =====================================================
//    INITIAL ADDRESS
// ===================================================== */

// const emptyAddress = (): StudentAddress => ({
//   addressLine: "",
//   city: "",
//   district: "",
//   state: "",
//   pincode: "",
//   country: "India",
// });

// const emptyParent = (): StudentParentDetails => ({
//   name: "",
//   mobile: "",
//   aadhaarNumber: "",
//   occupation: "",
// });

// /* =====================================================
//    COMPONENT
// ===================================================== */

// const AddStudent: React.FC = () => {
//   const dispatch = useAppDispatch();

//   const navigate = useNavigate();

//   /* ===================================================
//      REDUX
//   =================================================== */

//   const { sessions } = useAppSelector((state) => state.sessions);

//   const { classes, loading: classLoading } = useAppSelector(
//     (state) => state.classes,
//   );

//   const { sections, loading: sectionLoading } = useAppSelector(
//     (state) => state.sections,
//   );

//   const { loading: studentLoading, error: studentError } = useAppSelector(
//     (state) => state.students,
//   );

//   const { selectedSessionId } = useAppSelector(
//     (state) => state.sessionSelection,
//   );

//   /* ===================================================
//      ACADEMIC STATE

//      Academic session global Topbar selection se aayega.
//      Add Student page apna alag session select nahi karega.
//   =================================================== */

//   const sessionId = selectedSessionId ?? "";

//   const [classId, setClassId] = useState("");

//   const [sectionId, setSectionId] = useState("");

//   /* ===================================================
//      ADMISSION STATE
//   =================================================== */

//   const [admissionNumber, setAdmissionNumber] = useState("");

//   const [rollNumber, setRollNumber] = useState("");

//   const [admissionDate, setAdmissionDate] = useState("");

//   const [admissionType, setAdmissionType] = useState<AdmissionType>("NEW");

//   const [admissionCategory, setAdmissionCategory] =
//     useState<AdmissionCategory>("REGULAR");

//   /* ===================================================
//      STUDENT STATE
//   =================================================== */

//   const [name, setName] = useState("");

//   const [dob, setDob] = useState("");

//   const [gender, setGender] = useState<StudentGender | "">("");

//   const [bloodGroup, setBloodGroup] = useState<StudentBloodGroup | "">("");

//   const [religion, setReligion] = useState("");

//   const [category, setCategory] = useState<StudentCategory | "">("");

//   const [caste, setCaste] = useState("");

//   const [aadhaarNumber, setAadhaarNumber] = useState("");

//   const [apaarId, setApaarId] = useState("");

//   const [mobile, setMobile] = useState("");

//   const [email, setEmail] = useState("");

//   /* ===================================================
//      STUDENT LOGIN ACCOUNT
//   =================================================== */

//   const [createLoginAccount, setCreateLoginAccount] = useState(true);

//   const [loginEmail, setLoginEmail] = useState("");

//   const [loginPassword, setLoginPassword] = useState("");

//   /* ===================================================
//      PHOTO
//   =================================================== */

//   const [photo, setPhoto] = useState<File | null>(null);

//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

//   /* ===================================================
//      ADDRESS
//   =================================================== */

//   const [currentAddress, setCurrentAddress] =
//     useState<StudentAddress>(emptyAddress());

//   const [permanentAddress, setPermanentAddress] =
//     useState<StudentAddress>(emptyAddress());

//   const [sameAsCurrent, setSameAsCurrent] = useState(false);

//   /* ===================================================
//      PARENTS
//   =================================================== */

//   const [father, setFather] = useState<StudentParentDetails>(emptyParent());

//   const [mother, setMother] = useState<StudentParentDetails>(emptyParent());

//   const [formError, setFormError] = useState<string | null>(null);

//   /* ===================================================
//      INITIAL DATA
//   =================================================== */

//   useEffect(() => {
//     if (sessions.length === 0) {
//       dispatch(getSessions());
//     }
//   }, [dispatch, sessions.length]);

//   /* ===================================================
//      GLOBAL SESSION CHANGE

//      Topbar selected session hi new student ki
//      admission session hogi.
//   =================================================== */

//   useEffect(() => {
//     setClassId("");

//     setSectionId("");

//     if (!sessionId) {
//       return;
//     }

//     dispatch(
//       getClasses({
//         sessionId,
//       }),
//     );
//   }, [dispatch, sessionId]);

//   /* ===================================================
//      PHOTO CLEANUP
//   =================================================== */

//   useEffect(() => {
//     return () => {
//       if (photoPreview) {
//         URL.revokeObjectURL(photoPreview);
//       }
//     };
//   }, [photoPreview]);

//   /* ===================================================
//      SELECTED SESSION
//   =================================================== */

//   const selectedSession = useMemo(() => {
//     if (!sessionId) {
//       return null;
//     }

//     return sessions.find((session) => session._id === sessionId) ?? null;
//   }, [sessions, sessionId]);

//   /* ===================================================
//      FILTER CLASSES
//   =================================================== */

//   const filteredClasses = useMemo(() => {
//     if (!sessionId) {
//       return [];
//     }

//     return classes.filter((classItem) => classItem.sessionId === sessionId);
//   }, [classes, sessionId]);

//   /* ===================================================
//      FILTER SECTIONS
//   =================================================== */

//   const filteredSections = useMemo(() => {
//     if (!sessionId || !classId) {
//       return [];
//     }

//     return sections.filter(
//       (section) =>
//         section.sessionId === sessionId && section.classId === classId,
//     );
//   }, [sections, sessionId, classId]);

//   /* ===================================================
//      CLASS CHANGE
//   =================================================== */

//   const handleClassChange = (value: string) => {
//     setClassId(value);

//     setSectionId("");

//     if (!sessionId || !value) {
//       return;
//     }

//     dispatch(
//       getSections({
//         sessionId,
//         classId: value,
//       }),
//     );
//   };

//   /* ===================================================
//      PHOTO CHANGE
//   =================================================== */

//   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

//     if (!allowedTypes.includes(file.type)) {
//       setFormError("Photo must be JPG, PNG or WEBP.");

//       event.target.value = "";

//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       setFormError("Student photo must be less than 2 MB.");

//       event.target.value = "";

//       return;
//     }

//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhoto(file);

//     setPhotoPreview(URL.createObjectURL(file));

//     setFormError(null);
//   };

//   const removePhoto = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setPhoto(null);
//     setPhotoPreview(null);
//   };

//   /* ===================================================
//      ADD NEW / RESET FORM
//   =================================================== */

//   const handleAddNew = () => {
//     if (photoPreview) {
//       URL.revokeObjectURL(photoPreview);
//     }

//     setClassId("");
//     setSectionId("");

//     setAdmissionNumber("");
//     setRollNumber("");
//     setAdmissionDate("");
//     setAdmissionType("NEW");
//     setAdmissionCategory("REGULAR");

//     setName("");
//     setDob("");
//     setGender("");
//     setBloodGroup("");
//     setReligion("");
//     setCategory("");
//     setCaste("");
//     setAadhaarNumber("");
//     setApaarId("");
//     setMobile("");
//     setEmail("");

//     setCreateLoginAccount(true);
//     setLoginEmail("");
//     setLoginPassword("");

//     setPhoto(null);
//     setPhotoPreview(null);

//     setCurrentAddress(emptyAddress());

//     setPermanentAddress(emptyAddress());

//     setSameAsCurrent(false);

//     setFather(emptyParent());

//     setMother(emptyParent());

//     setFormError(null);

//     dispatch(clearStudentError());

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   /* ===================================================
//      ADDRESS CHANGE
//   =================================================== */

//   const updateCurrentAddress = (key: keyof StudentAddress, value: string) => {
//     setCurrentAddress((previous) => ({
//       ...previous,
//       [key]: value,
//     }));

//     if (sameAsCurrent) {
//       setPermanentAddress((previous) => ({
//         ...previous,
//         [key]: value,
//       }));
//     }
//   };

//   const updatePermanentAddress = (key: keyof StudentAddress, value: string) => {
//     setPermanentAddress((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const handleSameAddressChange = (checked: boolean) => {
//     setSameAsCurrent(checked);

//     if (checked) {
//       setPermanentAddress({
//         ...currentAddress,
//       });
//     }
//   };

//   /* ===================================================
//      PARENT CHANGE
//   =================================================== */

//   const updateFather = (key: keyof StudentParentDetails, value: string) => {
//     setFather((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   const updateMother = (key: keyof StudentParentDetails, value: string) => {
//     setMother((previous) => ({
//       ...previous,
//       [key]: value,
//     }));
//   };

//   /* ===================================================
//      VALIDATION
//   =================================================== */

//   const validateAadhaar = (value: string, label: string) => {
//     if (value && !/^\d{12}$/.test(value)) {
//       setFormError(`${label} must contain exactly 12 digits.`);

//       return false;
//     }

//     return true;
//   };

//   const validateForm = () => {
//     if (!name.trim()) {
//       setFormError("Student name is required.");

//       return false;
//     }

//     if (!sessionId) {
//       setFormError("Please select an academic session from the Topbar.");

//       return false;
//     }

//     if (!classId) {
//       setFormError("Please select a class.");

//       return false;
//     }

//     if (!sectionId) {
//       setFormError("Please select a section.");

//       return false;
//     }

//     if (!gender) {
//       setFormError("Please select student gender.");

//       return false;
//     }

//     if (
//       rollNumber &&
//       (Number.isNaN(Number(rollNumber)) || Number(rollNumber) <= 0)
//     ) {
//       setFormError("Roll number must be a valid positive number.");

//       return false;
//     }

//     if (!validateAadhaar(aadhaarNumber, "Student Aadhaar number")) {
//       return false;
//     }

//     if (apaarId && !/^\d{12}$/.test(apaarId)) {
//       setFormError("APAAR ID must contain exactly 12 digits.");

//       return false;
//     }

//     if (!validateAadhaar(father.aadhaarNumber ?? "", "Father Aadhaar number")) {
//       return false;
//     }

//     if (!validateAadhaar(mother.aadhaarNumber ?? "", "Mother Aadhaar number")) {
//       return false;
//     }

//     if (createLoginAccount) {
//       if (!loginEmail.trim()) {
//         setFormError("Login email is required to create the student account.");

//         return false;
//       }

//       if (!/^\S+@\S+\.\S+$/.test(loginEmail.trim())) {
//         setFormError("Please enter a valid login email.");

//         return false;
//       }

//       if (loginPassword.length < 6) {
//         setFormError("Login password must be at least 6 characters.");

//         return false;
//       }
//     }

//     setFormError(null);

//     return true;
//   };

//   /* ===================================================
//      CLEAN ADDRESS
//   =================================================== */

//   const cleanAddress = (source: StudentAddress): StudentAddress => {
//     const result: StudentAddress = {};

//     if (source.addressLine?.trim()) {
//       result.addressLine = source.addressLine.trim();
//     }

//     if (source.city?.trim()) {
//       result.city = source.city.trim();
//     }

//     if (source.district?.trim()) {
//       result.district = source.district.trim();
//     }

//     if (source.state?.trim()) {
//       result.state = source.state.trim();
//     }

//     if (source.pincode?.trim()) {
//       result.pincode = source.pincode.trim();
//     }

//     if (source.country?.trim()) {
//       result.country = source.country.trim();
//     }

//     return result;
//   };

//   /* ===================================================
//      CLEAN PARENT
//   =================================================== */

//   const cleanParent = (source: StudentParentDetails): StudentParentDetails => {
//     const result: StudentParentDetails = {};

//     if (source.name?.trim()) {
//       result.name = source.name.trim();
//     }

//     if (source.mobile?.trim()) {
//       result.mobile = source.mobile.trim();
//     }

//     if (source.aadhaarNumber?.trim()) {
//       result.aadhaarNumber = source.aadhaarNumber.trim();
//     }

//     if (source.occupation?.trim()) {
//       result.occupation = source.occupation.trim();
//     }

//     return result;
//   };

//   /* ===================================================
//      SUBMIT
//   =================================================== */

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     /*
//      * Required backend fields only.
//      *
//      * Optional properties are added below
//      * conditionally because project uses
//      * exactOptionalPropertyTypes.
//      */

//     const data: CreateStudentData = {
//       name: name.trim(),

//       sessionId,

//       classId,

//       sectionId,

//       gender: gender as StudentGender,

//       admissionType,

//       admissionCategory,
//     };

//     /* ===============================================
//        OPTIONAL ADMISSION DATA
//     =============================================== */

//     if (admissionNumber.trim()) {
//       data.admissionNumber =
//         admissionNumber
//           .trim()
//           .toUpperCase();
//     }

//     if (rollNumber) {
//       data.rollNumber = Number(rollNumber);
//     }

//     if (admissionDate) {
//       data.admissionDate = admissionDate;
//     }

//     /* ===============================================
//        OPTIONAL STUDENT DATA
//     =============================================== */

//     if (dob) {
//       data.dob = dob;
//     }

//     if (bloodGroup) {
//       data.bloodGroup = bloodGroup;
//     }

//     if (religion.trim()) {
//       data.religion = religion.trim();
//     }

//     if (category) {
//       data.category = category;
//     }

//     if (caste.trim()) {
//       data.caste = caste.trim();
//     }

//     if (aadhaarNumber.trim()) {
//       data.aadhaarNumber = aadhaarNumber.trim();
//     }

//     if (apaarId.trim()) {
//       data.apaarId = apaarId.trim();
//     }

//     if (mobile.trim()) {
//       data.mobile = mobile.trim();
//     }

//     if (email.trim()) {
//       data.email = email.trim();
//     }

//     if (photo) {
//       data.photo = photo;
//     }

//     /* ===============================================
//        ADDRESS
//     =============================================== */

//     const cleanedCurrentAddress = cleanAddress(currentAddress);

//     if (Object.keys(cleanedCurrentAddress).length > 0) {
//       data.currentAddress = cleanedCurrentAddress;

//       /*
//        * Keep old address populated too
//        * for backward compatibility with
//        * existing Student screens.
//        */

//       data.address = cleanedCurrentAddress;
//     }

//     const cleanedPermanentAddress = cleanAddress(permanentAddress);

//     if (Object.keys(cleanedPermanentAddress).length > 0) {
//       data.permanentAddress = cleanedPermanentAddress;
//     }

//     /* ===============================================
//        PARENTS
//     =============================================== */

//     const cleanedFather = cleanParent(father);

//     if (Object.keys(cleanedFather).length > 0) {
//       data.father = cleanedFather;
//     }

//     const cleanedMother = cleanParent(mother);

//     if (Object.keys(cleanedMother).length > 0) {
//       data.mother = cleanedMother;
//     }

//     try {
//       const createdStudent = await dispatch(createStudent(data)).unwrap();

//       if (createLoginAccount) {
//         await dispatch(
//           createStudentAccount({
//             studentId: createdStudent._id,

//             data: {
//               email: loginEmail.trim().toLowerCase(),

//               password: loginPassword,
//             },
//           }),
//         ).unwrap();
//       }

//       navigate("/school-admin/students");
//     } catch (error) {
//       console.error("Failed to create student:", error);
//     }
//   };

//   /* ===================================================
//      COMMON CLASSES
//   =================================================== */

//   const inputClassName = `
//     min-h-11
//     w-full
//     rounded-lg
//     border
//     border-[#D1D5DB]
//     bg-white
//     px-3
//     text-sm
//     text-[#15243B]
//     outline-none
//     transition-all
//     placeholder:text-[#9CA3AF]
//     focus:border-[#1F5FAE]
//     focus:ring-1
//     focus:ring-[#1F5FAE]
//     disabled:cursor-not-allowed
//     disabled:bg-[#F9FAFB]
//     disabled:text-[#9CA3AF]
//   `;

//   const labelClassName = "mb-2 block text-sm font-semibold text-[#15243B]";

//   /* ===================================================
//      SECTION HEADER
//   =================================================== */

//   const SectionHeader = ({
//     icon,
//     title,
//     description,
//   }: {
//     icon: string;
//     title: string;
//     description: string;
//   }) => (
//     <div
//       className="
//         border-b
//         border-[#E5E7EB]
//         px-5
//         py-4
//       "
//     >
//       <div
//         className="
//           flex
//           items-center
//           gap-3
//         "
//       >
//         <div
//           className="
//             flex
//             h-10
//             w-10
//             shrink-0
//             items-center
//             justify-center
//             rounded-lg
//             bg-[#E8F0FB]
//             text-[#1F5FAE]
//           "
//         >
//           <Icon icon={icon} className="text-xl" />
//         </div>

//         <div>
//           <h2
//             className="
//               font-semibold
//               text-[#15243B]
//             "
//           >
//             {title}
//           </h2>

//           <p
//             className="
//               text-xs
//               text-[#6B7280]
//             "
//           >
//             {description}
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   /* ===================================================
//      UI
//   =================================================== */

//   return (
//     <div
//       className="
//         min-h-full
//         bg-[#F7F9FC]
//         p-4
//         md:p-6
//         lg:p-8
//       "
//     >
//       {/* ===============================================
//           HEADER
//       =============================================== */}

//       <div
//         className="
//           mb-6
//           flex
//           flex-col
//           gap-4
//           md:flex-row
//           md:items-center
//           md:justify-between
//         "
//       >
//         <div>
//           <div
//             className="
//               mb-2
//               flex
//               items-center
//               gap-2
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             <button
//               type="button"
//               onClick={() => navigate("/school-admin/students")}
//               className="
//                 transition-colors
//                 hover:text-[#1F5FAE]
//               "
//             >
//               Students
//             </button>

//             <Icon icon="lucide:chevron-right" />

//             <span
//               className="
//                 text-[#15243B]
//               "
//             >
//               Add Student
//             </span>
//           </div>

//           <h1
//             className="
//               text-2xl
//               font-bold
//               text-[#15243B]
//               md:text-3xl
//             "
//           >
//             Add Student
//           </h1>

//           <p
//             className="
//               mt-1
//               text-sm
//               text-[#6B7280]
//             "
//           >
//             Add personal, academic, admission and parent details for a new
//             student.
//           </p>

//           {selectedSession && (
//             <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">
//               <Icon icon="lucide:calendar-days" />

//               {selectedSession.name}

//               {selectedSession.isCurrent && (
//                 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                   CURRENT
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={handleAddNew}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               bg-[#1F5FAE]
//               px-4
//               text-sm
//               font-semibold
//               text-white
//               transition-colors
//               hover:bg-[#174F91]
//               disabled:cursor-not-allowed
//               disabled:opacity-60
//             "
//           >
//             <Icon icon="lucide:plus" />
//             Add New
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               border
//               border-[#D1D5DB]
//               bg-white
//               px-4
//               text-sm
//               font-semibold
//               text-[#15243B]
//               transition-colors
//               hover:bg-[#F9FAFB]
//             "
//           >
//             <Icon icon="lucide:arrow-left" />
//             Back to Students
//           </button>
//         </div>
//       </div>

//       {!sessionId && (
//         <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
//           <Icon
//             icon="lucide:calendar-warning"
//             className="mt-0.5 shrink-0 text-xl text-amber-600"
//           />

//           <div>
//             <p className="text-sm font-semibold text-amber-800">
//               Academic session not selected
//             </p>

//             <p className="mt-1 text-sm text-amber-700">
//               Please select an academic session from the topbar before adding a
//               student.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ===============================================
//           ERROR
//       =============================================== */}

//       {(formError || studentError) && (
//         <div
//           className="
//             mb-6
//             flex
//             items-start
//             gap-3
//             rounded-lg
//             border
//             border-red-200
//             bg-red-50
//             p-4
//           "
//         >
//           <Icon
//             icon="lucide:circle-alert"
//             className="
//               mt-0.5
//               shrink-0
//               text-xl
//               text-red-500
//             "
//           />

//           <div>
//             <p
//               className="
//                 text-sm
//                 font-semibold
//                 text-red-700
//               "
//             >
//               Unable to add student
//             </p>

//             <p
//               className="
//                 mt-1
//                 text-sm
//                 text-red-600
//               "
//             >
//               {formError || studentError}
//             </p>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* =============================================
//             ACADEMIC DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:graduation-cap"
//             title="Academic Details"
//             description="Session comes from topbar. Select class and section for the new admission."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-3
//             "
//           >
//             <div>
//               <label className={labelClassName}>
//                 Academic Session
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <div
//                 className="
//                   flex
//                   min-h-11
//                   items-center
//                   gap-3
//                   rounded-lg
//                   border
//                   border-[#D1D5DB]
//                   bg-[#F9FAFB]
//                   px-3
//                   text-sm
//                   text-[#15243B]
//                 "
//               >
//                 <Icon
//                   icon="lucide:calendar-days"
//                   className="shrink-0 text-lg text-[#1F5FAE]"
//                 />

//                 <span className="font-medium">
//                   {selectedSession?.name ?? "Select a session from the Topbar"}
//                 </span>

//                 {selectedSession?.isCurrent && (
//                   <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                     CURRENT
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className={labelClassName}>
//                 Class
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <select
//                 value={classId}
//                 onChange={(event) => handleClassChange(event.target.value)}
//                 disabled={!sessionId || classLoading}
//                 className={inputClassName}
//               >
//                 <option value="">
//                   {classLoading
//                     ? "Loading classes..."
//                     : !sessionId
//                       ? "Select session first"
//                       : "Select class"}
//                 </option>

//                 {filteredClasses.map((classItem) => (
//                   <option key={classItem._id} value={classItem._id}>
//                     {classItem.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelClassName}>
//                 Section
//                 <span
//                   className="
//                     ml-1
//                     text-red-500
//                   "
//                 >
//                   *
//                 </span>
//               </label>

//               <select
//                 value={sectionId}
//                 onChange={(event) => setSectionId(event.target.value)}
//                 disabled={!classId || sectionLoading}
//                 className={inputClassName}
//               >
//                 <option value="">
//                   {sectionLoading
//                     ? "Loading sections..."
//                     : !classId
//                       ? "Select class first"
//                       : "Select section"}
//                 </option>

//                 {filteredSections.map((section) => (
//                   <option key={section._id} value={section._id}>
//                     {section.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             ADMISSION DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:clipboard-list"
//             title="Admission Details"
//             description="Enter student admission information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             <div>
//               <label className={labelClassName}>
//                 Admission Number
//                 <span className="ml-1 text-xs font-normal text-[#6B7280]">
//                   (Optional)
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 value={admissionNumber}
//                 onChange={(event) => setAdmissionNumber(event.target.value)}
//                 placeholder="Leave blank to generate automatically"
//                 className={inputClassName}
//               />

//               <p className="mt-1.5 text-xs text-[#6B7280]">
//                 Automatic format: SCHOOL/SESSION/0001
//               </p>
//             </div>

//             <div>
//               <label className={labelClassName}>Roll Number</label>

//               <input
//                 type="number"
//                 min="1"
//                 value={rollNumber}
//                 onChange={(event) => setRollNumber(event.target.value)}
//                 placeholder="Enter roll number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Date</label>

//               <input
//                 type="date"
//                 value={admissionDate}
//                 onChange={(event) => setAdmissionDate(event.target.value)}
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Type</label>

//               <select
//                 value={admissionType}
//                 onChange={(event) =>
//                   setAdmissionType(event.target.value as AdmissionType)
//                 }
//                 className={inputClassName}
//               >
//                 <option value="NEW">New Admission</option>

//                 <option value="TRANSFER">Transfer</option>

//                 <option value="READMISSION">Re-admission</option>
//               </select>
//             </div>

//             <div>
//               <label className={labelClassName}>Admission Category</label>

//               <select
//                 value={admissionCategory}
//                 onChange={(event) =>
//                   setAdmissionCategory(event.target.value as AdmissionCategory)
//                 }
//                 className={inputClassName}
//               >
//                 <option value="REGULAR">Regular</option>

//                 <option value="RTE">RTE</option>

//                 <option value="EWS">EWS</option>

//                 <option value="MANAGEMENT">Management</option>

//                 <option value="OTHER">Other</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             STUDENT DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user"
//             title="Student Details"
//             description="Enter personal and contact information."
//           />

//           <div className="p-5">
//             {/* PHOTO */}

//             <div
//               className="
//                 mb-6
//                 flex
//                 flex-col
//                 gap-4
//                 rounded-xl
//                 border
//                 border-dashed
//                 border-[#D1D5DB]
//                 bg-[#F9FAFB]
//                 p-4
//                 sm:flex-row
//                 sm:items-center
//               "
//             >
//               <div
//                 className="
//                   flex
//                   h-24
//                   w-24
//                   shrink-0
//                   items-center
//                   justify-center
//                   overflow-hidden
//                   rounded-xl
//                   border
//                   border-[#E5E7EB]
//                   bg-white
//                 "
//               >
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Student preview"
//                     className="
//                       h-full
//                       w-full
//                       object-cover
//                     "
//                   />
//                 ) : (
//                   <Icon
//                     icon="lucide:user-round"
//                     className="
//                       text-4xl
//                       text-[#9CA3AF]
//                     "
//                   />
//                 )}
//               </div>

//               <div className="flex-1">
//                 <p
//                   className="
//                     text-sm
//                     font-semibold
//                     text-[#15243B]
//                   "
//                 >
//                   Student Photo
//                 </p>

//                 <p
//                   className="
//                     mt-1
//                     text-xs
//                     text-[#6B7280]
//                   "
//                 >
//                   JPG, PNG or WEBP. Maximum file size 2 MB.
//                 </p>

//                 <div
//                   className="
//                     mt-3
//                     flex
//                     flex-wrap
//                     gap-2
//                   "
//                 >
//                   <label
//                     className="
//                       inline-flex
//                       min-h-10
//                       cursor-pointer
//                       items-center
//                       gap-2
//                       rounded-lg
//                       bg-[#1F5FAE]
//                       px-4
//                       text-sm
//                       font-semibold
//                       text-white
//                       hover:bg-[#174F91]
//                     "
//                   >
//                     <Icon icon="lucide:upload" />
//                     Choose Photo
//                     <input
//                       type="file"
//                       accept="
//                         image/jpeg,
//                         image/png,
//                         image/webp
//                       "
//                       onChange={handlePhotoChange}
//                       className="hidden"
//                     />
//                   </label>

//                   {photo && (
//                     <button
//                       type="button"
//                       onClick={removePhoto}
//                       className="
//                         min-h-10
//                         rounded-lg
//                         border
//                         border-[#D1D5DB]
//                         bg-white
//                         px-4
//                         text-sm
//                         font-semibold
//                         text-[#15243B]
//                       "
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               <div>
//                 <label className={labelClassName}>
//                   Student Name
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   placeholder="Enter student name"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Date of Birth</label>

//                 <input
//                   type="date"
//                   value={dob}
//                   onChange={(event) => setDob(event.target.value)}
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>
//                   Gender
//                   <span className="ml-1 text-red-500">*</span>
//                 </label>

//                 <select
//                   value={gender}
//                   onChange={(event) =>
//                     setGender(event.target.value as StudentGender | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select gender</option>

//                   <option value="MALE">Male</option>

//                   <option value="FEMALE">Female</option>

//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Blood Group</label>

//                 <select
//                   value={bloodGroup}
//                   onChange={(event) =>
//                     setBloodGroup(event.target.value as StudentBloodGroup | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select blood group</option>

//                   {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
//                     (group) => (
//                       <option key={group} value={group}>
//                         {group}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Religion</label>

//                 <input
//                   type="text"
//                   value={religion}
//                   onChange={(event) => setReligion(event.target.value)}
//                   placeholder="Enter religion"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Category</label>

//                 <select
//                   value={category}
//                   onChange={(event) =>
//                     setCategory(event.target.value as StudentCategory | "")
//                   }
//                   className={inputClassName}
//                 >
//                   <option value="">Select category</option>

//                   <option value="GENERAL">General</option>

//                   <option value="OBC">OBC</option>

//                   <option value="SC">SC</option>

//                   <option value="ST">ST</option>

//                   <option value="OTHER">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={labelClassName}>Caste</label>

//                 <input
//                   type="text"
//                   value={caste}
//                   onChange={(event) => setCaste(event.target.value)}
//                   placeholder="Enter caste"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Aadhaar Number</label>

//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={12}
//                   value={aadhaarNumber}
//                   onChange={(event) =>
//                     setAadhaarNumber(
//                       event.target.value.replace(/\D/g, "").slice(0, 12),
//                     )
//                   }
//                   placeholder="12 digit Aadhaar number"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>APAAR ID</label>

//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={12}
//                   value={apaarId}
//                   onChange={(event) =>
//                     setApaarId(
//                       event.target.value.replace(/\D/g, "").slice(0, 12),
//                     )
//                   }
//                   placeholder="12 digit APAAR ID"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Mobile</label>

//                 <input
//                   type="tel"
//                   value={mobile}
//                   onChange={(event) => setMobile(event.target.value)}
//                   placeholder="Enter mobile number"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>Email</label>

//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   placeholder="Enter email"
//                   className={inputClassName}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             STUDENT LOGIN ACCOUNT
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:key-round"
//             title="Student Login Account"
//             description="Create login credentials so the student can access the mobile application."
//           />

//           <div className="p-5">
//             <label
//               className="
//                 mb-5
//                 inline-flex
//                 cursor-pointer
//                 items-center
//                 gap-2
//                 text-sm
//                 font-medium
//                 text-[#15243B]
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={createLoginAccount}
//                 onChange={(event) =>
//                   setCreateLoginAccount(event.target.checked)
//                 }
//                 className="
//                   h-4
//                   w-4
//                   accent-[#1F5FAE]
//                 "
//               />
//               Create student login account
//             </label>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//               "
//             >
//               <div>
//                 <label className={labelClassName}>
//                   Login Email
//                   {createLoginAccount && (
//                     <span className="ml-1 text-red-500">*</span>
//                   )}
//                 </label>

//                 <input
//                   type="email"
//                   disabled={!createLoginAccount}
//                   value={loginEmail}
//                   onChange={(event) => setLoginEmail(event.target.value)}
//                   placeholder="student@example.com"
//                   autoComplete="off"
//                   className={inputClassName}
//                 />
//               </div>

//               <div>
//                 <label className={labelClassName}>
//                   Login Password
//                   {createLoginAccount && (
//                     <span className="ml-1 text-red-500">*</span>
//                   )}
//                 </label>

//                 <input
//                   type="password"
//                   disabled={!createLoginAccount}
//                   value={loginPassword}
//                   onChange={(event) => setLoginPassword(event.target.value)}
//                   placeholder="Minimum 6 characters"
//                   minLength={6}
//                   autoComplete="new-password"
//                   className={inputClassName}
//                 />
//               </div>
//             </div>

//             {createLoginAccount && (
//               <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
//                 <Icon
//                   icon="lucide:info"
//                   className="mt-0.5 shrink-0 text-base"
//                 />

//                 <p>
//                   Student profile create hone ke baad isi email aur password se
//                   login account automatically create hoga.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* =============================================
//             CURRENT ADDRESS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:map-pin"
//             title="Current Address"
//             description="Enter student's current residential address."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             <div className="md:col-span-2 xl:col-span-3">
//               <label className={labelClassName}>Address Line</label>

//               <input
//                 type="text"
//                 value={currentAddress.addressLine ?? ""}
//                 onChange={(event) =>
//                   updateCurrentAddress("addressLine", event.target.value)
//                 }
//                 placeholder="House no., street, locality"
//                 className={inputClassName}
//               />
//             </div>

//             {(
//               [
//                 ["city", "City", "Enter city"],
//                 ["district", "District", "Enter district"],
//                 ["state", "State", "Enter state"],
//                 ["pincode", "Pincode", "Enter pincode"],
//                 ["country", "Country", "Enter country"],
//               ] as const
//             ).map(([key, label, placeholder]) => (
//               <div key={key}>
//                 <label className={labelClassName}>{label}</label>

//                 <input
//                   type="text"
//                   value={currentAddress[key] ?? ""}
//                   onChange={(event) =>
//                     updateCurrentAddress(key, event.target.value)
//                   }
//                   placeholder={placeholder}
//                   className={inputClassName}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* =============================================
//             PERMANENT ADDRESS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:home"
//             title="Permanent Address"
//             description="Enter student's permanent residential address."
//           />

//           <div className="p-5">
//             <label
//               className="
//                 mb-5
//                 inline-flex
//                 cursor-pointer
//                 items-center
//                 gap-2
//                 text-sm
//                 font-medium
//                 text-[#15243B]
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={sameAsCurrent}
//                 onChange={(event) =>
//                   handleSameAddressChange(event.target.checked)
//                 }
//                 className="
//                   h-4
//                   w-4
//                   accent-[#1F5FAE]
//                 "
//               />
//               Same as Current Address
//             </label>

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               <div className="md:col-span-2 xl:col-span-3">
//                 <label className={labelClassName}>Address Line</label>

//                 <input
//                   type="text"
//                   disabled={sameAsCurrent}
//                   value={permanentAddress.addressLine ?? ""}
//                   onChange={(event) =>
//                     updatePermanentAddress("addressLine", event.target.value)
//                   }
//                   placeholder="House no., street, locality"
//                   className={inputClassName}
//                 />
//               </div>

//               {(
//                 [
//                   ["city", "City", "Enter city"],
//                   ["district", "District", "Enter district"],
//                   ["state", "State", "Enter state"],
//                   ["pincode", "Pincode", "Enter pincode"],
//                   ["country", "Country", "Enter country"],
//                 ] as const
//               ).map(([key, label, placeholder]) => (
//                 <div key={key}>
//                   <label className={labelClassName}>{label}</label>

//                   <input
//                     type="text"
//                     disabled={sameAsCurrent}
//                     value={permanentAddress[key] ?? ""}
//                     onChange={(event) =>
//                       updatePermanentAddress(key, event.target.value)
//                     }
//                     placeholder={placeholder}
//                     className={inputClassName}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             FATHER DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user-round"
//             title="Father Details"
//             description="Enter student's father information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//             "
//           >
//             <div>
//               <label className={labelClassName}>Father Name</label>

//               <input
//                 type="text"
//                 value={father.name ?? ""}
//                 onChange={(event) => updateFather("name", event.target.value)}
//                 placeholder="Enter father name"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Mobile</label>

//               <input
//                 type="tel"
//                 value={father.mobile ?? ""}
//                 onChange={(event) => updateFather("mobile", event.target.value)}
//                 placeholder="Enter mobile number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Aadhaar Number</label>

//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={12}
//                 value={father.aadhaarNumber ?? ""}
//                 onChange={(event) =>
//                   updateFather(
//                     "aadhaarNumber",
//                     event.target.value.replace(/\D/g, "").slice(0, 12),
//                   )
//                 }
//                 placeholder="12 digit Aadhaar number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Occupation</label>

//               <input
//                 type="text"
//                 value={father.occupation ?? ""}
//                 onChange={(event) =>
//                   updateFather("occupation", event.target.value)
//                 }
//                 placeholder="Enter occupation"
//                 className={inputClassName}
//               />
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             MOTHER DETAILS
//         ============================================= */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//           "
//         >
//           <SectionHeader
//             icon="lucide:user-round"
//             title="Mother Details"
//             description="Enter student's mother information."
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               md:grid-cols-2
//             "
//           >
//             <div>
//               <label className={labelClassName}>Mother Name</label>

//               <input
//                 type="text"
//                 value={mother.name ?? ""}
//                 onChange={(event) => updateMother("name", event.target.value)}
//                 placeholder="Enter mother name"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Mobile</label>

//               <input
//                 type="tel"
//                 value={mother.mobile ?? ""}
//                 onChange={(event) => updateMother("mobile", event.target.value)}
//                 placeholder="Enter mobile number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Aadhaar Number</label>

//               <input
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={12}
//                 value={mother.aadhaarNumber ?? ""}
//                 onChange={(event) =>
//                   updateMother(
//                     "aadhaarNumber",
//                     event.target.value.replace(/\D/g, "").slice(0, 12),
//                   )
//                 }
//                 placeholder="12 digit Aadhaar number"
//                 className={inputClassName}
//               />
//             </div>

//             <div>
//               <label className={labelClassName}>Occupation</label>

//               <input
//                 type="text"
//                 value={mother.occupation ?? ""}
//                 onChange={(event) =>
//                   updateMother("occupation", event.target.value)
//                 }
//                 placeholder="Enter occupation"
//                 className={inputClassName}
//               />
//             </div>
//           </div>
//         </div>

//         {/* =============================================
//             ACTIONS
//         ============================================= */}

//         <div
//           className="
//             flex
//             flex-col-reverse
//             gap-3
//             rounded-xl
//             border
//             border-[#E5E7EB]
//             bg-white
//             p-5
//             sm:flex-row
//             sm:justify-end
//           "
//         >
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               min-h-11
//               rounded-lg
//               border
//               border-[#D1D5DB]
//               bg-white
//               px-5
//               text-sm
//               font-semibold
//               text-[#15243B]
//               transition-colors
//               hover:bg-[#F9FAFB]
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={studentLoading || !sessionId}
//             className="
//               inline-flex
//               min-h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-lg
//               bg-[#1F5FAE]
//               px-6
//               text-sm
//               font-semibold
//               text-white
//               shadow-sm
//               transition-colors
//               hover:bg-[#174F91]
//               disabled:cursor-not-allowed
//               disabled:opacity-60
//             "
//           >
//             {studentLoading ? (
//               <>
//                 <Icon
//                   icon="lucide:loader-circle"
//                   className="
//                     animate-spin
//                     text-lg
//                   "
//                 />
//                 Creating Student...
//               </>
//             ) : (
//               <>
//                 <Icon icon="lucide:user-plus" className="text-lg" />
//                 Add Student
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddStudent;

import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";

import {
  clearStudentError,
  createStudent,
  createStudentAccount,
} from "../../../features/student/student.slice";

import type {
  AdmissionCategory,
  AdmissionType,
  CreateStudentData,
  StudentAddress,
  StudentBloodGroup,
  StudentCategory,
  StudentGender,
  StudentParentDetails,
} from "../../../features/student/student.types";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { getSessions } from "../../../features/academic/sessions/session.slice";

import { getClasses } from "../../../features/academic/classes/class.slice";

import { getSections } from "../../../features/academic/sections/section.slice";

import SuccessModal from "../../../components/common/SuccessModal";

/* =====================================================
   INITIAL ADDRESS
===================================================== */

const emptyAddress = (): StudentAddress => ({
  addressLine: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
});

const emptyParent = (): StudentParentDetails => ({
  name: "",
  mobile: "",
  aadhaarNumber: "",
  occupation: "",
});

/* =====================================================
   COMPONENT
===================================================== */

const AddStudent: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  /* ===================================================
     REDUX
  =================================================== */

  const { sessions } = useAppSelector((state) => state.sessions);

  const { classes, loading: classLoading } = useAppSelector(
    (state) => state.classes,
  );

  const { sections, loading: sectionLoading } = useAppSelector(
    (state) => state.sections,
  );

  const { loading: studentLoading, error: studentError } = useAppSelector(
    (state) => state.students,
  );

  const { selectedSessionId } = useAppSelector(
    (state) => state.sessionSelection,
  );

  /* ===================================================
     ACADEMIC STATE

     Academic session global Topbar selection se aayega.
     Add Student page apna alag session select nahi karega.
  =================================================== */

  const sessionId = selectedSessionId ?? "";

  const [classId, setClassId] = useState("");

  const [sectionId, setSectionId] = useState("");

  /* ===================================================
     ADMISSION STATE
  =================================================== */

  const [admissionNumber, setAdmissionNumber] = useState("");

  const [admissionDate, setAdmissionDate] = useState("");

  const [admissionType, setAdmissionType] = useState<AdmissionType>("NEW");

  const [admissionCategory, setAdmissionCategory] =
    useState<AdmissionCategory>("REGULAR");

  /* ===================================================
     STUDENT STATE
  =================================================== */

  const [name, setName] = useState("");

  const [dob, setDob] = useState("");

  const [gender, setGender] = useState<StudentGender | "">("");

  const [bloodGroup, setBloodGroup] = useState<StudentBloodGroup | "">("");

  const [religion, setReligion] = useState("");

  const [category, setCategory] = useState<StudentCategory | "">("");

  const [caste, setCaste] = useState("");

  const [aadhaarNumber, setAadhaarNumber] = useState("");

  const [apaarId, setApaarId] = useState("");

  const [mobile, setMobile] = useState("");

  const [email, setEmail] = useState("");

  /* ===================================================
     STUDENT LOGIN ACCOUNT
  =================================================== */

  const [createLoginAccount, setCreateLoginAccount] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");

  const [loginPassword, setLoginPassword] = useState("");

  /* ===================================================
     PHOTO
  =================================================== */

  const [photo, setPhoto] = useState<File | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  /* ===================================================
     ADDRESS
  =================================================== */

  const [currentAddress, setCurrentAddress] =
    useState<StudentAddress>(emptyAddress());

  const [permanentAddress, setPermanentAddress] =
    useState<StudentAddress>(emptyAddress());

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  /* ===================================================
     PARENTS
  =================================================== */

  const [father, setFather] = useState<StudentParentDetails>(emptyParent());

  const [mother, setMother] = useState<StudentParentDetails>(emptyParent());

  const [formError, setFormError] = useState<string | null>(null);

  const [successStudentName, setSuccessStudentName] = useState<string | null>(
    null,
  );

  /* ===================================================
     INITIAL DATA
  =================================================== */

  useEffect(() => {
    if (sessions.length === 0) {
      dispatch(getSessions());
    }
  }, [dispatch, sessions.length]);

  /* ===================================================
     GLOBAL SESSION CHANGE

     Topbar selected session hi new student ki
     admission session hogi.
  =================================================== */

  useEffect(() => {
    setClassId("");

    setSectionId("");

    if (!sessionId) {
      return;
    }

    dispatch(
      getClasses({
        sessionId,
      }),
    );
  }, [dispatch, sessionId]);

  /* ===================================================
     PHOTO CLEANUP
  =================================================== */

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  /* ===================================================
     SELECTED SESSION
  =================================================== */

  const selectedSession = useMemo(() => {
    if (!sessionId) {
      return null;
    }

    return sessions.find((session) => session._id === sessionId) ?? null;
  }, [sessions, sessionId]);

  /* ===================================================
     FILTER CLASSES
  =================================================== */

  const filteredClasses = useMemo(() => {
    if (!sessionId) {
      return [];
    }

    return classes.filter((classItem) => classItem.sessionId === sessionId);
  }, [classes, sessionId]);

  /* ===================================================
     FILTER SECTIONS
  =================================================== */

  const filteredSections = useMemo(() => {
    if (!sessionId || !classId) {
      return [];
    }

    return sections.filter(
      (section) =>
        section.sessionId === sessionId && section.classId === classId,
    );
  }, [sections, sessionId, classId]);

  /* ===================================================
     CLASS CHANGE
  =================================================== */

  const handleClassChange = (value: string) => {
    setClassId(value);

    setSectionId("");

    if (!sessionId || !value) {
      return;
    }

    dispatch(
      getSections({
        sessionId,
        classId: value,
      }),
    );
  };

  /* ===================================================
     PHOTO CHANGE
  =================================================== */

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setFormError("Photo must be JPG, PNG or WEBP.");

      event.target.value = "";

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Student photo must be less than 2 MB.");

      event.target.value = "";

      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(file);

    setPhotoPreview(URL.createObjectURL(file));

    setFormError(null);
  };

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview(null);
  };

  /* ===================================================
     ADD NEW / RESET FORM
  =================================================== */

  const handleAddNew = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setClassId("");
    setSectionId("");

    setAdmissionNumber("");
    setAdmissionDate("");
    setAdmissionType("NEW");
    setAdmissionCategory("REGULAR");

    setName("");
    setDob("");
    setGender("");
    setBloodGroup("");
    setReligion("");
    setCategory("");
    setCaste("");
    setAadhaarNumber("");
    setApaarId("");
    setMobile("");
    setEmail("");

    setCreateLoginAccount(true);
    setLoginEmail("");
    setLoginPassword("");

    setPhoto(null);
    setPhotoPreview(null);

    setCurrentAddress(emptyAddress());

    setPermanentAddress(emptyAddress());

    setSameAsCurrent(false);

    setFather(emptyParent());

    setMother(emptyParent());

    setFormError(null);

    setSuccessStudentName(null);

    dispatch(clearStudentError());

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ===================================================
     ADDRESS CHANGE
  =================================================== */

  const updateCurrentAddress = (key: keyof StudentAddress, value: string) => {
    setCurrentAddress((previous) => ({
      ...previous,
      [key]: value,
    }));

    if (sameAsCurrent) {
      setPermanentAddress((previous) => ({
        ...previous,
        [key]: value,
      }));
    }
  };

  const updatePermanentAddress = (key: keyof StudentAddress, value: string) => {
    setPermanentAddress((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsCurrent(checked);

    if (checked) {
      setPermanentAddress({
        ...currentAddress,
      });
    }
  };

  /* ===================================================
     PARENT CHANGE
  =================================================== */

  const updateFather = (key: keyof StudentParentDetails, value: string) => {
    setFather((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateMother = (key: keyof StudentParentDetails, value: string) => {
    setMother((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* ===================================================
     VALIDATION
  =================================================== */

  const validateAadhaar = (value: string, label: string) => {
    if (value && !/^\d{12}$/.test(value)) {
      setFormError(`${label} must contain exactly 12 digits.`);

      return false;
    }

    return true;
  };

  const validateForm = () => {
    if (!name.trim()) {
      setFormError("Student name is required.");

      return false;
    }

    if (!sessionId) {
      setFormError("Please select an academic session from the Topbar.");

      return false;
    }

    if (!classId) {
      setFormError("Please select a class.");

      return false;
    }

    if (!sectionId) {
      setFormError("Please select a section.");

      return false;
    }

    if (!gender) {
      setFormError("Please select student gender.");

      return false;
    }

    if (!validateAadhaar(aadhaarNumber, "Student Aadhaar number")) {
      return false;
    }

    if (apaarId && !/^\d{12}$/.test(apaarId)) {
      setFormError("APAAR ID must contain exactly 12 digits.");

      return false;
    }

    if (!validateAadhaar(father.aadhaarNumber ?? "", "Father Aadhaar number")) {
      return false;
    }

    if (!validateAadhaar(mother.aadhaarNumber ?? "", "Mother Aadhaar number")) {
      return false;
    }

    if (createLoginAccount) {
      if (!loginEmail.trim()) {
        setFormError("Login email is required to create the student account.");

        return false;
      }

      if (!/^\S+@\S+\.\S+$/.test(loginEmail.trim())) {
        setFormError("Please enter a valid login email.");

        return false;
      }

      if (loginPassword.length < 6) {
        setFormError("Login password must be at least 6 characters.");

        return false;
      }
    }

    setFormError(null);

    return true;
  };

  /* ===================================================
     CLEAN ADDRESS
  =================================================== */

  const cleanAddress = (source: StudentAddress): StudentAddress => {
    const result: StudentAddress = {};

    if (source.addressLine?.trim()) {
      result.addressLine = source.addressLine.trim();
    }

    if (source.city?.trim()) {
      result.city = source.city.trim();
    }

    if (source.district?.trim()) {
      result.district = source.district.trim();
    }

    if (source.state?.trim()) {
      result.state = source.state.trim();
    }

    if (source.pincode?.trim()) {
      result.pincode = source.pincode.trim();
    }

    if (source.country?.trim()) {
      result.country = source.country.trim();
    }

    return result;
  };

  /* ===================================================
     CLEAN PARENT
  =================================================== */

  const cleanParent = (source: StudentParentDetails): StudentParentDetails => {
    const result: StudentParentDetails = {};

    if (source.name?.trim()) {
      result.name = source.name.trim();
    }

    if (source.mobile?.trim()) {
      result.mobile = source.mobile.trim();
    }

    if (source.aadhaarNumber?.trim()) {
      result.aadhaarNumber = source.aadhaarNumber.trim();
    }

    if (source.occupation?.trim()) {
      result.occupation = source.occupation.trim();
    }

    return result;
  };

  /* ===================================================
     SUBMIT
  =================================================== */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
     * Required backend fields only.
     *
     * Optional properties are added below
     * conditionally because project uses
     * exactOptionalPropertyTypes.
     */

    const data: CreateStudentData = {
      name: name.trim(),

      sessionId,

      classId,

      sectionId,

      gender: gender as StudentGender,

      admissionType,

      admissionCategory,
    };

    /* ===============================================
       OPTIONAL ADMISSION DATA
    =============================================== */

    if (admissionNumber.trim()) {
      data.admissionNumber = admissionNumber.trim().toUpperCase();
    }

    if (admissionDate) {
      data.admissionDate = admissionDate;
    }

    /* ===============================================
       OPTIONAL STUDENT DATA
    =============================================== */

    if (dob) {
      data.dob = dob;
    }

    if (bloodGroup) {
      data.bloodGroup = bloodGroup;
    }

    if (religion.trim()) {
      data.religion = religion.trim();
    }

    if (category) {
      data.category = category;
    }

    if (caste.trim()) {
      data.caste = caste.trim();
    }

    if (aadhaarNumber.trim()) {
      data.aadhaarNumber = aadhaarNumber.trim();
    }

    if (apaarId.trim()) {
      data.apaarId = apaarId.trim();
    }

    if (mobile.trim()) {
      data.mobile = mobile.trim();
    }

    if (email.trim()) {
      data.email = email.trim();
    }

    if (photo) {
      data.photo = photo;
    }

    /* ===============================================
       ADDRESS
    =============================================== */

    const cleanedCurrentAddress = cleanAddress(currentAddress);

    if (Object.keys(cleanedCurrentAddress).length > 0) {
      data.currentAddress = cleanedCurrentAddress;

      /*
       * Keep old address populated too
       * for backward compatibility with
       * existing Student screens.
       */

      data.address = cleanedCurrentAddress;
    }

    const cleanedPermanentAddress = cleanAddress(permanentAddress);

    if (Object.keys(cleanedPermanentAddress).length > 0) {
      data.permanentAddress = cleanedPermanentAddress;
    }

    /* ===============================================
       PARENTS
    =============================================== */

    const cleanedFather = cleanParent(father);

    if (Object.keys(cleanedFather).length > 0) {
      data.father = cleanedFather;
    }

    const cleanedMother = cleanParent(mother);

    if (Object.keys(cleanedMother).length > 0) {
      data.mother = cleanedMother;
    }

    try {
      const createdStudent = await dispatch(createStudent(data)).unwrap();

      if (createLoginAccount) {
        await dispatch(
          createStudentAccount({
            studentId: createdStudent._id,

            data: {
              email: loginEmail.trim().toLowerCase(),

              password: loginPassword,
            },
          }),
        ).unwrap();
      }

      setSuccessStudentName(createdStudent.name);
    } catch (error) {
      console.error("Failed to create student:", error);
    }
  };

  /* ===================================================
     COMMON CLASSES
  =================================================== */

  const inputClassName = `
    min-h-10
    w-full
    rounded-lg
    border
    border-[#D1D5DB]
    bg-white
    px-3
    text-sm
    text-[#15243B]
    outline-none
    transition-all
    placeholder:text-[#9CA3AF]
    focus:border-[#1F5FAE]
    focus:ring-1
    focus:ring-[#1F5FAE]
    disabled:cursor-not-allowed
    disabled:bg-[#F9FAFB]
    disabled:text-[#9CA3AF]
  `;

  const labelClassName = "mb-1.5 block text-sm font-semibold text-[#15243B]";

  /* ===================================================
     SECTION HEADER
  =================================================== */

  const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <div
      className="
        border-b
        border-[#E5E7EB]
        px-4
        py-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#E8F0FB]
            text-[#1F5FAE]
          "
        >
          <Icon icon={icon} className="text-xl" />
        </div>

        <div>
          <h2
            className="
              font-semibold
              text-[#15243B]
            "
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );

  /* ===================================================
     UI
  =================================================== */

  return (
    <div
      className="
        min-h-full
        bg-[#F7F9FC]
        p-4
        md:p-6
        lg:p-8
      "
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-[#15243B]">Add Student</h1>

          {/* {selectedSession && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">
              <Icon icon="lucide:calendar-days" />

              {selectedSession.name}

              {selectedSession.isCurrent && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  CURRENT
                </span>
              )}
            </div>
          )} */}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={studentLoading}
            onClick={handleAddNew}
            className="
    inline-flex
    min-h-10
    items-center
    justify-center
    gap-2
    rounded-lg
    bg-[#1F5FAE]
    px-4
    text-sm
    font-semibold
    text-white
    transition-colors
    hover:bg-[#174F91]
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
          >
            <Icon icon="lucide:rotate-ccw" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => navigate("/school-admin/students")}
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#D1D5DB]
              bg-white
              px-4
              text-sm
              font-semibold
              text-[#15243B]
              transition-colors
              hover:bg-[#F9FAFB]
            "
          >
            <Icon icon="lucide:arrow-left" />
            Back
          </button>
        </div>
      </div>

      {!sessionId && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <Icon
            icon="lucide:calendar-warning"
            className="mt-0.5 shrink-0 text-xl text-amber-600"
          />

          <div>
            <p className="text-sm font-semibold text-amber-800">
              Academic session not selected
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Please select an academic session from the topbar before adding a
              student.
            </p>
          </div>
        </div>
      )}

      {/* ===============================================
          ERROR
      =============================================== */}

      {(formError || studentError) && (
        <div
          className="
            mb-4
            flex
            items-start
            gap-3
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
          "
        >
          <Icon
            icon="lucide:circle-alert"
            className="
              mt-0.5
              shrink-0
              text-xl
              text-red-500
            "
          />

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-red-700
              "
            >
              Unable to add student
            </p>

            <p
              className="
                mt-1
                text-sm
                text-red-600
              "
            >
              {formError || studentError}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* =============================================
            ACADEMIC DETAILS
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <SectionHeader
            icon="lucide:graduation-cap"
            title="Academic Details"
          />

          <div
            className="
              grid
              grid-cols-1
              gap-4
              p-4
              md:grid-cols-3
            "
          >
            <div>
              <label className={labelClassName}>
                Academic Session
                <span
                  className="
                    ml-1
                    text-red-500
                  "
                >
                  *
                </span>
              </label>

              <div
                className="
                  flex
                  min-h-10
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-[#D1D5DB]
                  bg-[#F9FAFB]
                  px-3
                  text-sm
                  text-[#15243B]
                "
              >
                <Icon
                  icon="lucide:calendar-days"
                  className="shrink-0 text-lg text-[#1F5FAE]"
                />

                <span className="font-medium">
                  {selectedSession?.name ?? "Select a session from the Topbar"}
                </span>

                {selectedSession?.isCurrent && (
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    CURRENT
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className={labelClassName}>
                Class
                <span
                  className="
                    ml-1
                    text-red-500
                  "
                >
                  *
                </span>
              </label>

              <select
                value={classId}
                onChange={(event) => handleClassChange(event.target.value)}
                disabled={!sessionId || classLoading}
                className={inputClassName}
              >
                <option value="">
                  {classLoading
                    ? "Loading classes..."
                    : !sessionId
                      ? "Select session first"
                      : "Select class"}
                </option>

                {filteredClasses.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                Section
                <span
                  className="
                    ml-1
                    text-red-500
                  "
                >
                  *
                </span>
              </label>

              <select
                value={sectionId}
                onChange={(event) => setSectionId(event.target.value)}
                disabled={!classId || sectionLoading}
                className={inputClassName}
              >
                <option value="">
                  {sectionLoading
                    ? "Loading sections..."
                    : !classId
                      ? "Select class first"
                      : "Select section"}
                </option>

                {filteredSections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* =============================================
            ADMISSION DETAILS
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <SectionHeader
            icon="lucide:clipboard-list"
            title="Admission Details"
          />

          <div
            className="
              grid
              grid-cols-1
              gap-4
              p-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            <div>
              <label className={labelClassName}>
                Admission Number
                <span className="ml-1 text-xs font-normal text-[#6B7280]">
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                value={admissionNumber}
                onChange={(event) => setAdmissionNumber(event.target.value)}
                placeholder="Leave blank to generate automatically"
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>Admission Date</label>

              <input
                type="date"
                value={admissionDate}
                onChange={(event) => setAdmissionDate(event.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label className={labelClassName}>Admission Type</label>

              <select
                value={admissionType}
                onChange={(event) =>
                  setAdmissionType(event.target.value as AdmissionType)
                }
                className={inputClassName}
              >
                <option value="NEW">New Admission</option>

                <option value="TRANSFER">Transfer</option>

                <option value="READMISSION">Re-admission</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>Admission Category</label>

              <select
                value={admissionCategory}
                onChange={(event) =>
                  setAdmissionCategory(event.target.value as AdmissionCategory)
                }
                className={inputClassName}
              >
                <option value="REGULAR">Regular</option>

                <option value="RTE">RTE</option>

                <option value="EWS">EWS</option>

                <option value="MANAGEMENT">Management</option>

                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* =============================================
            STUDENT DETAILS
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <SectionHeader icon="lucide:user" title="Student Details" />

          <div className="p-4">
            {/* PHOTO */}

            <div
              className="
                mb-4
                flex
                flex-col
                gap-4
                rounded-xl
                border
                border-dashed
                border-[#D1D5DB]
                bg-[#F9FAFB]
                p-4
                sm:flex-row
                sm:items-center
              "
            >
              <div
                className="
                  flex
                  h-24
                  w-24
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                "
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Student preview"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <Icon
                    icon="lucide:user-round"
                    className="
                      text-4xl
                      text-[#9CA3AF]
                    "
                  />
                )}
              </div>

              <div className="flex-1">
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#15243B]
                  "
                >
                  Student Photo
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#6B7280]
                  "
                >
                  JPG, PNG or WEBP. Maximum file size 2 MB.
                </p>

                <div
                  className="
                    mt-3
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  <label
                    className="
                      inline-flex
                      min-h-10
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-lg
                      bg-[#1F5FAE]
                      px-4
                      text-sm
                      font-semibold
                      text-white
                      hover:bg-[#174F91]
                    "
                  >
                    <Icon icon="lucide:upload" />
                    Choose Photo
                    <input
                      type="file"
                      accept="
                        image/jpeg,
                        image/png,
                        image/webp
                      "
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>

                  {photo && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="
                        min-h-10
                        rounded-lg
                        border
                        border-[#D1D5DB]
                        bg-white
                        px-4
                        text-sm
                        font-semibold
                        text-[#15243B]
                      "
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              <div>
                <label className={labelClassName}>
                  Student Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter student name"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Date of Birth</label>

                <input
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Gender
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value as StudentGender | "")
                  }
                  className={inputClassName}
                >
                  <option value="">Select gender</option>

                  <option value="MALE">Male</option>

                  <option value="FEMALE">Female</option>

                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>Blood Group</label>

                <select
                  value={bloodGroup}
                  onChange={(event) =>
                    setBloodGroup(event.target.value as StudentBloodGroup | "")
                  }
                  className={inputClassName}
                >
                  <option value="">Select blood group</option>

                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Religion</label>

                <input
                  type="text"
                  value={religion}
                  onChange={(event) => setReligion(event.target.value)}
                  placeholder="Enter religion"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Category</label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as StudentCategory | "")
                  }
                  className={inputClassName}
                >
                  <option value="">Select category</option>

                  <option value="GENERAL">General</option>

                  <option value="OBC">OBC</option>

                  <option value="SC">SC</option>

                  <option value="ST">ST</option>

                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>Caste</label>

                <input
                  type="text"
                  value={caste}
                  onChange={(event) => setCaste(event.target.value)}
                  placeholder="Enter caste"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Aadhaar Number</label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={aadhaarNumber}
                  onChange={(event) =>
                    setAadhaarNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 12),
                    )
                  }
                  placeholder="12 digit Aadhaar number"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>APAAR ID</label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={apaarId}
                  onChange={(event) =>
                    setApaarId(
                      event.target.value.replace(/\D/g, "").slice(0, 12),
                    )
                  }
                  placeholder="12 digit APAAR ID"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Mobile</label>

                <input
                  type="tel"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  placeholder="Enter mobile number"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =============================================
            STUDENT LOGIN ACCOUNT
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <SectionHeader
            icon="lucide:key-round"
            title="Student Login Account"
          />

          <div className="p-4">
            <label
              className="
                mb-5
                inline-flex
                cursor-pointer
                items-center
                gap-2
                text-sm
                font-medium
                text-[#15243B]
              "
            >
              <input
                type="checkbox"
                checked={createLoginAccount}
                onChange={(event) =>
                  setCreateLoginAccount(event.target.checked)
                }
                className="
                  h-4
                  w-4
                  accent-[#1F5FAE]
                "
              />
              Create student login account
            </label>

            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >
              <div>
                <label className={labelClassName}>
                  Login Email
                  {createLoginAccount && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                <input
                  type="email"
                  disabled={!createLoginAccount}
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="student@example.com"
                  autoComplete="off"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Login Password
                  {createLoginAccount && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                <input
                  type="password"
                  disabled={!createLoginAccount}
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClassName}
                />
              </div>
            </div>

            {createLoginAccount && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                <Icon
                  icon="lucide:info"
                  className="mt-0.5 shrink-0 text-base"
                />

                <p>
                  A login account will be created automatically using the same
                  email and password after the student profile is created.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =============================================
            CURRENT ADDRESS
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <SectionHeader icon="lucide:map-pin" title="Current Address" />

          <div
            className="
              grid
              grid-cols-1
              gap-4
              p-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            <div className="md:col-span-2 xl:col-span-3">
              <label className={labelClassName}>Address Line</label>

              <input
                type="text"
                value={currentAddress.addressLine ?? ""}
                onChange={(event) =>
                  updateCurrentAddress("addressLine", event.target.value)
                }
                placeholder="House no., street, locality"
                className={inputClassName}
              />
            </div>

            {(
              [
                ["city", "City", "Enter city"],
                ["district", "District", "Enter district"],
                ["state", "State", "Enter state"],
                ["pincode", "Pincode", "Enter pincode"],
                ["country", "Country", "Enter country"],
              ] as const
            ).map(([key, label, placeholder]) => (
              <div key={key}>
                <label className={labelClassName}>{label}</label>

                <input
                  type="text"
                  value={currentAddress[key] ?? ""}
                  onChange={(event) =>
                    updateCurrentAddress(key, event.target.value)
                  }
                  placeholder={placeholder}
                  className={inputClassName}
                />
              </div>
            ))}
          </div>
        </div>

        {/* =============================================
            PERMANENT ADDRESS
        ============================================= */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
          "
        >
          <SectionHeader icon="lucide:home" title="Permanent Address" />

          <div className="p-4">
            <label
              className="
                mb-5
                inline-flex
                cursor-pointer
                items-center
                gap-2
                text-sm
                font-medium
                text-[#15243B]
              "
            >
              <input
                type="checkbox"
                checked={sameAsCurrent}
                onChange={(event) =>
                  handleSameAddressChange(event.target.checked)
                }
                className="
                  h-4
                  w-4
                  accent-[#1F5FAE]
                "
              />
              Same as Current Address
            </label>

            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              <div className="md:col-span-2 xl:col-span-3">
                <label className={labelClassName}>Address Line</label>

                <input
                  type="text"
                  disabled={sameAsCurrent}
                  value={permanentAddress.addressLine ?? ""}
                  onChange={(event) =>
                    updatePermanentAddress("addressLine", event.target.value)
                  }
                  placeholder="House no., street, locality"
                  className={inputClassName}
                />
              </div>

              {(
                [
                  ["city", "City", "Enter city"],
                  ["district", "District", "Enter district"],
                  ["state", "State", "Enter state"],
                  ["pincode", "Pincode", "Enter pincode"],
                  ["country", "Country", "Enter country"],
                ] as const
              ).map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className={labelClassName}>{label}</label>

                  <input
                    type="text"
                    disabled={sameAsCurrent}
                    value={permanentAddress[key] ?? ""}
                    onChange={(event) =>
                      updatePermanentAddress(key, event.target.value)
                    }
                    placeholder={placeholder}
                    className={inputClassName}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =============================================
            FATHER DETAILS
        ============================================= */}
        {/* =============================================
    PARENT DETAILS
============================================= */}

        <div
          className="
    overflow-hidden
    rounded-xl
    border
    border-[#E5E7EB]
    bg-white
  "
        >
          <SectionHeader icon="lucide:users-round" title="Parent Details" />

          <div
            className="
      grid
      grid-cols-1
      gap-6
      p-4
      lg:grid-cols-2
    "
          >
            {/* =============================================
        FATHER DETAILS
    ============================================= */}

            <div>
              <h3
                className="
          mb-4
          border-b
          border-[#E5E7EB]
          pb-2
          text-sm
          font-semibold
          text-[#1F2937]
        "
              >
                Father Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClassName}>Father Name</label>

                  <input
                    type="text"
                    value={father.name ?? ""}
                    onChange={(event) =>
                      updateFather("name", event.target.value)
                    }
                    placeholder="Enter father name"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className={labelClassName}>Mobile</label>

                  <input
                    type="tel"
                    value={father.mobile ?? ""}
                    onChange={(event) =>
                      updateFather("mobile", event.target.value)
                    }
                    placeholder="Enter mobile number"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className={labelClassName}>Aadhaar Number</label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    value={father.aadhaarNumber ?? ""}
                    onChange={(event) =>
                      updateFather(
                        "aadhaarNumber",
                        event.target.value.replace(/\D/g, "").slice(0, 12),
                      )
                    }
                    placeholder="12 digit Aadhaar number"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className={labelClassName}>Occupation</label>

                  <input
                    type="text"
                    value={father.occupation ?? ""}
                    onChange={(event) =>
                      updateFather("occupation", event.target.value)
                    }
                    placeholder="Enter occupation"
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* =============================================
        MOTHER DETAILS
    ============================================= */}

            <div>
              <h3
                className="
          mb-4
          border-b
          border-[#E5E7EB]
          pb-2
          text-sm
          font-semibold
          text-[#1F2937]
        "
              >
                Mother Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClassName}>Mother Name</label>

                  <input
                    type="text"
                    value={mother.name ?? ""}
                    onChange={(event) =>
                      updateMother("name", event.target.value)
                    }
                    placeholder="Enter mother name"
                    className={inputClassName}
                  />
                </div>

                {/* Mother Mobile Number - Currently Hidden
        <div>
          <label className={labelClassName}>
            Mobile
          </label>

          <input
            type="tel"
            value={mother.mobile ?? ""}
            onChange={(event) =>
              updateMother("mobile", event.target.value)
            }
            placeholder="Enter mobile number"
            className={inputClassName}
          />
        </div>
        */}

                <div>
                  <label className={labelClassName}>Occupation</label>

                  <input
                    type="text"
                    value={mother.occupation ?? ""}
                    onChange={(event) =>
                      updateMother("occupation", event.target.value)
                    }
                    placeholder="Enter occupation"
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================
            ACTIONS
        ============================================= */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            rounded-xl
            border
            border-[#E5E7EB]
            bg-white
            p-4
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            disabled={studentLoading}
            onClick={() => navigate("/school-admin/students")}
            className="
              min-h-10
              rounded-lg
              border
              border-[#D1D5DB]
              bg-white
              px-5
              text-sm
              font-semibold
              text-[#15243B]
              transition-colors
              hover:bg-[#F9FAFB]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={studentLoading || !sessionId}
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#1F5FAE]
              px-6
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-colors
              hover:bg-[#174F91]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {studentLoading ? (
              <>
                <Icon
                  icon="lucide:loader-circle"
                  className="
                    animate-spin
                    text-lg
                  "
                />
                Creating Student...
              </>
            ) : (
              <>
                <Icon icon="lucide:user-plus" className="text-lg" />
                Submit
              </>
            )}
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={Boolean(successStudentName)}
        title="Student added successfully"
        message={`${successStudentName ?? "Student"} ka profile${
          createLoginAccount ? " aur login account" : ""
        } successfully create ho gaya hai.`}
        primaryLabel="View Students"
        secondaryLabel="Add Another Student"
        onPrimary={() => navigate("/school-admin/students")}
        onSecondary={handleAddNew}
        onClose={() => navigate("/school-admin/students")}
      />
    </div>
  );
};

export default AddStudent;
