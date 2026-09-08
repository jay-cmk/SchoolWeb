

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

// import SuccessModal from "../../../components/common/SuccessModal";

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

//   const [successStudentName, setSuccessStudentName] = useState<string | null>(
//     null,
//   );

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

//     setSuccessStudentName(null);

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
//       data.admissionNumber = admissionNumber.trim().toUpperCase();
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

//       setSuccessStudentName(createdStudent.name);
//     } catch (error) {
//       console.error("Failed to create student:", error);
//     }
//   };

//   /* ===================================================
//      COMMON CLASSES
//   =================================================== */

//   const inputClassName = `
//     min-h-10
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

//   const labelClassName = "mb-1.5 block text-sm font-semibold text-[#15243B]";

//   /* ===================================================
//      SECTION HEADER
//   =================================================== */

//   const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
//     <div
//       className="
//         border-b
//         border-[#E5E7EB]
//         px-4
//         py-3
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
//             h-9
//             w-9
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
//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex flex-wrap items-center gap-3">
//           <h1 className="text-2xl font-bold text-[#15243B]">Add Student</h1>

//           {/* {selectedSession && (
//             <div className="inline-flex items-center gap-2 rounded-lg border border-[#D7E3F4] bg-[#EEF4FC] px-3 py-1.5 text-xs font-semibold text-[#1F5FAE]">
//               <Icon icon="lucide:calendar-days" />

//               {selectedSession.name}

//               {selectedSession.isCurrent && (
//                 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
//                   CURRENT
//                 </span>
//               )}
//             </div>
//           )} */}
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={handleAddNew}
//             className="
//     inline-flex
//     min-h-10
//     items-center
//     justify-center
//     gap-2
//     rounded-lg
//     bg-[#1F5FAE]
//     px-4
//     text-sm
//     font-semibold
//     text-white
//     transition-colors
//     hover:bg-[#174F91]
//     disabled:cursor-not-allowed
//     disabled:opacity-60
//   "
//           >
//             <Icon icon="lucide:rotate-ccw" />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               inline-flex
//               min-h-10
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
//             Back
//           </button>
//         </div>
//       </div>

//       {!sessionId && (
//         <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
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
//             mb-4
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

//       <form onSubmit={handleSubmit} className="space-y-4">
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
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-4
//               p-4
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
//                   min-h-10
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
//           />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-4
//               p-4
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
//           <SectionHeader icon="lucide:user" title="Student Details" />

//           <div className="p-4">
//             {/* PHOTO */}

//             <div
//               className="
//                 mb-4
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
//                 gap-4
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
//           />

//           <div className="p-4">
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
//                 gap-4
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
//                   A login account will be created automatically using the same
//                   email and password after the student profile is created.
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
//           <SectionHeader icon="lucide:map-pin" title="Current Address" />

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-4
//               p-4
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
//           <SectionHeader icon="lucide:home" title="Permanent Address" />

//           <div className="p-4">
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
//                 gap-4
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
//         {/* =============================================
//     PARENT DETAILS
// ============================================= */}

//         <div
//           className="
//     overflow-hidden
//     rounded-xl
//     border
//     border-[#E5E7EB]
//     bg-white
//   "
//         >
//           <SectionHeader icon="lucide:users-round" title="Parent Details" />

//           <div
//             className="
//       grid
//       grid-cols-1
//       gap-6
//       p-4
//       lg:grid-cols-2
//     "
//           >
//             {/* =============================================
//         FATHER DETAILS
//     ============================================= */}

//             <div>
//               <h3
//                 className="
//           mb-4
//           border-b
//           border-[#E5E7EB]
//           pb-2
//           text-sm
//           font-semibold
//           text-[#1F2937]
//         "
//               >
//                 Father Details
//               </h3>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <label className={labelClassName}>Father Name</label>

//                   <input
//                     type="text"
//                     value={father.name ?? ""}
//                     onChange={(event) =>
//                       updateFather("name", event.target.value)
//                     }
//                     placeholder="Enter father name"
//                     className={inputClassName}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelClassName}>Mobile</label>

//                   <input
//                     type="tel"
//                     value={father.mobile ?? ""}
//                     onChange={(event) =>
//                       updateFather("mobile", event.target.value)
//                     }
//                     placeholder="Enter mobile number"
//                     className={inputClassName}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelClassName}>Aadhaar Number</label>

//                   <input
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={12}
//                     value={father.aadhaarNumber ?? ""}
//                     onChange={(event) =>
//                       updateFather(
//                         "aadhaarNumber",
//                         event.target.value.replace(/\D/g, "").slice(0, 12),
//                       )
//                     }
//                     placeholder="12 digit Aadhaar number"
//                     className={inputClassName}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelClassName}>Occupation</label>

//                   <input
//                     type="text"
//                     value={father.occupation ?? ""}
//                     onChange={(event) =>
//                       updateFather("occupation", event.target.value)
//                     }
//                     placeholder="Enter occupation"
//                     className={inputClassName}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* =============================================
//         MOTHER DETAILS
//     ============================================= */}

//             <div>
//               <h3
//                 className="
//           mb-4
//           border-b
//           border-[#E5E7EB]
//           pb-2
//           text-sm
//           font-semibold
//           text-[#1F2937]
//         "
//               >
//                 Mother Details
//               </h3>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <label className={labelClassName}>Mother Name</label>

//                   <input
//                     type="text"
//                     value={mother.name ?? ""}
//                     onChange={(event) =>
//                       updateMother("name", event.target.value)
//                     }
//                     placeholder="Enter mother name"
//                     className={inputClassName}
//                   />
//                 </div>

//                 {/* Mother Mobile Number - Currently Hidden
//         <div>
//           <label className={labelClassName}>
//             Mobile
//           </label>

//           <input
//             type="tel"
//             value={mother.mobile ?? ""}
//             onChange={(event) =>
//               updateMother("mobile", event.target.value)
//             }
//             placeholder="Enter mobile number"
//             className={inputClassName}
//           />
//         </div>
//         */}

//                 <div>
//                   <label className={labelClassName}>Occupation</label>

//                   <input
//                     type="text"
//                     value={mother.occupation ?? ""}
//                     onChange={(event) =>
//                       updateMother("occupation", event.target.value)
//                     }
//                     placeholder="Enter occupation"
//                     className={inputClassName}
//                   />
//                 </div>
//               </div>
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
//             p-4
//             sm:flex-row
//             sm:justify-end
//           "
//         >
//           <button
//             type="button"
//             disabled={studentLoading}
//             onClick={() => navigate("/school-admin/students")}
//             className="
//               min-h-10
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
//               min-h-10
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
//                 Submit
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       <SuccessModal
//         isOpen={Boolean(successStudentName)}
//         title="Student added successfully"
//         message={`${successStudentName ?? "Student"} ka profile${
//           createLoginAccount ? " aur login account" : ""
//         } successfully create ho gaya hai.`}
//         primaryLabel="View Students"
//         secondaryLabel="Add Another Student"
//         onPrimary={() => navigate("/school-admin/students")}
//         onSecondary={handleAddNew}
//         onClose={() => navigate("/school-admin/students")}
//       />
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

import api from "../../../api/axios";

type StudentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";

type LocationAwareAddress = StudentAddress & {
  countryCode?: string;
  stateCode?: string;
  districtCode?: string;
  subDistrictCode?: string;
};

interface LocationOption {
  code: string;
  name: string;
}

interface MasterLocation {
  _id?: string | number;
  code?: string | number;
  id?: string | number;
  lgdCode?: string | number;
  countryCode?: string | number;
  stateCode?: string | number;
  districtCode?: string | number;
  subDistrictCode?: string | number;
  subdistrictCode?: string | number;
  tehsilCode?: string | number;
  isoCode?: string | number;
  iso2?: string | number;
  name?: string;
  localName?: string;
  countryName?: string;
  stateName?: string;
  districtName?: string;
  subDistrictName?: string;
  subdistrictName?: string;
  tehsilName?: string;
}

const getLocationOptions = (
  responseData: unknown,
  listKey: "countries" | "states" | "districts" | "subDistricts",
): LocationOption[] => {
  const response = responseData as {
    data?: unknown;
    [key: string]: unknown;
  };

  const nestedData = response?.data as
    | Record<string, unknown>
    | unknown[];

  const rawItems = Array.isArray(nestedData)
    ? nestedData
    : Array.isArray(nestedData?.[listKey])
      ? nestedData[listKey]
      : Array.isArray(response?.[listKey])
        ? response[listKey]
        : [];

  const options = (rawItems as MasterLocation[])
    .map((item) => {
      // Each API item can contain its parent codes too. Select the code
      // according to the requested list; otherwise every district may receive
      // its stateCode and every state may receive its countryCode.
      const rawCode =
        listKey === "countries"
          ? item.countryCode ?? item.iso2 ?? item.isoCode ?? item.code ?? item.id
          : listKey === "states"
            ? item.stateCode ?? item.lgdCode ?? item.code ?? item.id ?? item._id
            : listKey === "districts"
              ? item.districtCode ??
                item.lgdCode ??
                item.code ??
                item.id ??
                item._id
              : item.subDistrictCode ??
                item.subdistrictCode ??
                item.tehsilCode ??
                item.lgdCode ??
                item.code ??
                item.id ??
                item._id;

      const rawName =
        listKey === "countries"
          ? item.countryName ?? item.name
          : listKey === "states"
            ? item.stateName ?? item.name ?? item.localName
            : listKey === "districts"
              ? item.districtName ?? item.name ?? item.localName
              : item.subDistrictName ??
                item.subdistrictName ??
                item.tehsilName ??
                item.name ??
                item.localName;

      return {
        code: rawCode === undefined ? "" : String(rawCode),
        name: rawName?.trim() ?? "",
      };
    })
    .filter((item) => item.code && item.name);

  return Array.from(
    new Map(options.map((item) => [item.code, item])).values(),
  );
};

/* =====================================================
   INITIAL ADDRESS
===================================================== */

const emptyAddress = (): LocationAwareAddress => ({
  addressLine: "",
  city: "",
  district: "",
  districtCode: "",
  subDistrictCode: "",
  state: "",
  stateCode: "",
  pincode: "",
  country: "India",
  countryCode: "IN",
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

  const [penNumber, setPenNumber] = useState("");

  const [stream, setStream] = useState<StudentStream | "">("");

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
    useState<LocationAwareAddress>(emptyAddress());

  const [permanentAddress, setPermanentAddress] =
    useState<LocationAwareAddress>(emptyAddress());

  const [countries, setCountries] = useState<LocationOption[]>([]);

  const [currentStates, setCurrentStates] = useState<LocationOption[]>([]);

  const [currentDistricts, setCurrentDistricts] =
    useState<LocationOption[]>([]);

  const [currentSubDistricts, setCurrentSubDistricts] =
    useState<LocationOption[]>([]);

  const [permanentStates, setPermanentStates] = useState<LocationOption[]>([]);

  const [permanentDistricts, setPermanentDistricts] =
    useState<LocationOption[]>([]);

  const [permanentSubDistricts, setPermanentSubDistricts] =
    useState<LocationOption[]>([]);

  const [countryLoading, setCountryLoading] = useState(false);

  const [currentStateLoading, setCurrentStateLoading] = useState(false);

  const [currentDistrictLoading, setCurrentDistrictLoading] = useState(false);

  const [currentSubDistrictLoading, setCurrentSubDistrictLoading] =
    useState(false);

  const [permanentStateLoading, setPermanentStateLoading] = useState(false);

  const [permanentDistrictLoading, setPermanentDistrictLoading] =
    useState(false);

  const [permanentSubDistrictLoading, setPermanentSubDistrictLoading] =
    useState(false);

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  /* ===================================================
     PARENTS
  =================================================== */

  const [father, setFather] = useState<StudentParentDetails>(emptyParent());

  const [mother, setMother] = useState<StudentParentDetails>(emptyParent());

  const [formError, setFormError] = useState<string | null>(null);

  const [locationError, setLocationError] = useState<string | null>(null);

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
     LOCATION MASTER DATA
  =================================================== */

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      setCountryLoading(true);

      try {
        const response = await api.get(
          "/master/locations/countries",
        );

        if (active) {
          setCountries(
            getLocationOptions(response.data, "countries"),
          );
        }
      } catch {
        if (active) {
          setLocationError("Failed to load countries.");
        }
      } finally {
        if (active) {
          setCountryLoading(false);
        }
      }
    };

    void loadCountries();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const countryCode = currentAddress.countryCode;

    setCurrentStates([]);
    setCurrentDistricts([]);
    setCurrentSubDistricts([]);

    if (!countryCode) {
      return;
    }

    let active = true;

    const loadStates = async () => {
      setCurrentStateLoading(true);

      try {
        const response = await api.get(
          "/master/locations/states",
          {
            params: {
              countryCode,
            },
          },
        );

        if (active) {
          setCurrentStates(
            getLocationOptions(response.data, "states"),
          );
        }
      } catch {
        if (active) {
          setLocationError("Failed to load states.");
        }
      } finally {
        if (active) {
          setCurrentStateLoading(false);
        }
      }
    };

    void loadStates();

    return () => {
      active = false;
    };
  }, [currentAddress.countryCode]);

  useEffect(() => {
    const stateCode = currentAddress.stateCode;

    setCurrentDistricts([]);
    setCurrentSubDistricts([]);

    if (!stateCode) {
      return;
    }

    let active = true;

    const loadDistricts = async () => {
      setCurrentDistrictLoading(true);

      try {
        const response = await api.get(
          "/master/locations/districts",
          {
            params: {
              stateCode,
            },
          },
        );

        if (active) {
          setCurrentDistricts(
            getLocationOptions(response.data, "districts"),
          );
        }
      } catch {
        if (active) {
          setLocationError("Failed to load districts.");
        }
      } finally {
        if (active) {
          setCurrentDistrictLoading(false);
        }
      }
    };

    void loadDistricts();

    return () => {
      active = false;
    };
  }, [currentAddress.stateCode]);

  useEffect(() => {
    const districtCode = currentAddress.districtCode;

    setCurrentSubDistricts([]);

    if (!districtCode) {
      return;
    }

    let active = true;

    const loadSubDistricts = async () => {
      setCurrentSubDistrictLoading(true);

      try {
        const response = await api.get(
          "/master/locations/sub-districts",
          {
            params: {
              districtCode,
            },
          },
        );

        if (active) {
          setCurrentSubDistricts(
            getLocationOptions(response.data, "subDistricts"),
          );
        }
      } catch {
        if (active) {
          setLocationError("Failed to load sub-districts / tehsils.");
        }
      } finally {
        if (active) {
          setCurrentSubDistrictLoading(false);
        }
      }
    };

    void loadSubDistricts();

    return () => {
      active = false;
    };
  }, [currentAddress.districtCode]);

  useEffect(() => {
    const countryCode = permanentAddress.countryCode;

    setPermanentStates([]);
    setPermanentDistricts([]);
    setPermanentSubDistricts([]);

    if (!countryCode || sameAsCurrent) {
      return;
    }

    let active = true;

    const loadStates = async () => {
      setPermanentStateLoading(true);

      try {
        const response = await api.get(
          "/master/locations/states",
          {
            params: {
              countryCode,
            },
          },
        );

        if (active) {
          setPermanentStates(
            getLocationOptions(response.data, "states"),
          );
        }
      } catch {
        if (active) {
          setLocationError("Failed to load permanent-address states.");
        }
      } finally {
        if (active) {
          setPermanentStateLoading(false);
        }
      }
    };

    void loadStates();

    return () => {
      active = false;
    };
  }, [permanentAddress.countryCode, sameAsCurrent]);

  useEffect(() => {
    const stateCode = permanentAddress.stateCode;

    setPermanentDistricts([]);
    setPermanentSubDistricts([]);

    if (!stateCode || sameAsCurrent) {
      return;
    }

    let active = true;

    const loadDistricts = async () => {
      setPermanentDistrictLoading(true);

      try {
        const response = await api.get(
          "/master/locations/districts",
          {
            params: {
              stateCode,
            },
          },
        );

        if (active) {
          setPermanentDistricts(
            getLocationOptions(response.data, "districts"),
          );
        }
      } catch {
        if (active) {
          setLocationError("Failed to load permanent-address districts.");
        }
      } finally {
        if (active) {
          setPermanentDistrictLoading(false);
        }
      }
    };

    void loadDistricts();

    return () => {
      active = false;
    };
  }, [permanentAddress.stateCode, sameAsCurrent]);

  useEffect(() => {
    const districtCode = permanentAddress.districtCode;

    setPermanentSubDistricts([]);

    if (!districtCode || sameAsCurrent) {
      return;
    }

    let active = true;

    const loadSubDistricts = async () => {
      setPermanentSubDistrictLoading(true);

      try {
        const response = await api.get(
          "/master/locations/sub-districts",
          {
            params: {
              districtCode,
            },
          },
        );

        if (active) {
          setPermanentSubDistricts(
            getLocationOptions(response.data, "subDistricts"),
          );
        }
      } catch {
        if (active) {
          setLocationError(
            "Failed to load permanent-address sub-districts / tehsils.",
          );
        }
      } finally {
        if (active) {
          setPermanentSubDistrictLoading(false);
        }
      }
    };

    void loadSubDistricts();

    return () => {
      active = false;
    };
  }, [permanentAddress.districtCode, sameAsCurrent]);

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

  const selectedClass = useMemo(
    () =>
      filteredClasses.find(
        (classItem) => classItem._id === classId,
      ) ?? null,
    [filteredClasses, classId],
  );

  const isSeniorSecondaryClass = useMemo(() => {
    if (!selectedClass) {
      return false;
    }

    const classData = selectedClass as typeof selectedClass & {
      order?: number;
    };

    const normalizedName = classData.name
      ?.trim()
      .toLowerCase()
      .replace(/^class\s*/, "")
      .replace(/^(xi|11th)$/, "11")
      .replace(/^(xii|12th)$/, "12");

    return (
      classData.order === 11 ||
      classData.order === 12 ||
      normalizedName === "11" ||
      normalizedName === "12"
    );
  }, [selectedClass]);

  /* ===================================================
     CLASS CHANGE
  =================================================== */

  const handleClassChange = (value: string) => {
    setClassId(value);

    setSectionId("");

    const nextClass = filteredClasses.find(
      (classItem) => classItem._id === value,
    ) as
      | ((typeof filteredClasses)[number] & {
          order?: number;
        })
      | undefined;

    const normalizedName = nextClass?.name
      ?.trim()
      .toLowerCase()
      .replace(/^class\s*/, "")
      .replace(/^(xi|11th)$/, "11")
      .replace(/^(xii|12th)$/, "12");

    const nextClassRequiresStream =
      nextClass?.order === 11 ||
      nextClass?.order === 12 ||
      normalizedName === "11" ||
      normalizedName === "12";

    if (!nextClassRequiresStream) {
      setStream("");
    }

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
    setPenNumber("");
    setStream("");
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

  const updateCurrentAddress = (
    key: keyof LocationAwareAddress,
    value: string,
  ) => {
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

  const updatePermanentAddress = (
    key: keyof LocationAwareAddress,
    value: string,
  ) => {
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

  const handleCurrentCountryChange = (countryCode: string) => {
    const country = countries.find(
      (item) => item.code === countryCode,
    );

    const nextAddress: LocationAwareAddress = {
      ...currentAddress,
      countryCode,
      country: country?.name ?? "",
      stateCode: "",
      state: "",
      districtCode: "",
      district: "",
      subDistrictCode: "",
      city: "",
    };

    setCurrentAddress(nextAddress);

    if (sameAsCurrent) {
      setPermanentAddress({
        ...nextAddress,
      });
    }
  };

  const handleCurrentStateChange = (stateCode: string) => {
    const state = currentStates.find(
      (item) => item.code === stateCode,
    );

    const nextAddress: LocationAwareAddress = {
      ...currentAddress,
      stateCode,
      state: state?.name ?? "",
      districtCode: "",
      district: "",
      subDistrictCode: "",
      city: "",
    };

    setCurrentAddress(nextAddress);

    if (sameAsCurrent) {
      setPermanentAddress({
        ...nextAddress,
      });
    }
  };

  const handleCurrentDistrictChange = (districtCode: string) => {
    const district = currentDistricts.find(
      (item) => item.code === districtCode,
    );

    const nextAddress: LocationAwareAddress = {
      ...currentAddress,
      districtCode,
      district: district?.name ?? "",
      subDistrictCode: "",
      city: "",
    };

    setCurrentAddress(nextAddress);

    if (sameAsCurrent) {
      setPermanentAddress({
        ...nextAddress,
      });
    }
  };

  const handleCurrentSubDistrictChange = (subDistrictCode: string) => {
    const subDistrict = currentSubDistricts.find(
      (item) => item.code === subDistrictCode,
    );

    const nextAddress: LocationAwareAddress = {
      ...currentAddress,
      subDistrictCode,
      // Existing backend address schema stores this value in city.
      city: subDistrict?.name ?? "",
    };

    setCurrentAddress(nextAddress);

    if (sameAsCurrent) {
      setPermanentAddress({ ...nextAddress });
    }
  };

  const handlePermanentCountryChange = (countryCode: string) => {
    const country = countries.find(
      (item) => item.code === countryCode,
    );

    setPermanentAddress((previous) => ({
      ...previous,
      countryCode,
      country: country?.name ?? "",
      stateCode: "",
      state: "",
      districtCode: "",
      district: "",
      subDistrictCode: "",
      city: "",
    }));
  };

  const handlePermanentStateChange = (stateCode: string) => {
    const state = permanentStates.find(
      (item) => item.code === stateCode,
    );

    setPermanentAddress((previous) => ({
      ...previous,
      stateCode,
      state: state?.name ?? "",
      districtCode: "",
      district: "",
      subDistrictCode: "",
      city: "",
    }));
  };

  const handlePermanentDistrictChange = (districtCode: string) => {
    const district = permanentDistricts.find(
      (item) => item.code === districtCode,
    );

    setPermanentAddress((previous) => ({
      ...previous,
      districtCode,
      district: district?.name ?? "",
      subDistrictCode: "",
      city: "",
    }));
  };

  const handlePermanentSubDistrictChange = (subDistrictCode: string) => {
    const subDistrict = permanentSubDistricts.find(
      (item) => item.code === subDistrictCode,
    );

    setPermanentAddress((previous) => ({
      ...previous,
      subDistrictCode,
      // Existing backend address schema stores this value in city.
      city: subDistrict?.name ?? "",
    }));
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

    if (penNumber && !/^\d{11}$/.test(penNumber)) {
      setFormError("PEN Number must contain exactly 11 digits.");

      return false;
    }

    if (isSeniorSecondaryClass && !stream) {
      setFormError("Please select a stream for Class 11 or Class 12.");

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

  const cleanAddress = (
    source: LocationAwareAddress,
  ): LocationAwareAddress => {
    const result: LocationAwareAddress = {};

    if (source.addressLine?.trim()) {
      result.addressLine = source.addressLine.trim();
    }

    if (source.city?.trim()) {
      result.city = source.city.trim();
    }

    if (source.district?.trim()) {
      result.district = source.district.trim();
    }

    if (source.districtCode?.trim()) {
      result.districtCode = source.districtCode.trim();
    }

    if (source.state?.trim()) {
      result.state = source.state.trim();
    }

    if (source.stateCode?.trim()) {
      result.stateCode = source.stateCode.trim();
    }

    if (source.pincode?.trim()) {
      result.pincode = source.pincode.trim();
    }

    if (source.country?.trim()) {
      result.country = source.country.trim();
    }

    if (source.countryCode?.trim()) {
      result.countryCode = source.countryCode.trim().toUpperCase();
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

    const data: CreateStudentData & {
      penNumber?: string;
      stream?: StudentStream;
    } = {
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

    if (penNumber.trim()) {
      data.penNumber = penNumber.trim();
    }

    if (isSeniorSecondaryClass && stream) {
      data.stream = stream;
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
        {locationError && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <Icon
              icon="lucide:map-pin-off"
              className="mt-0.5 shrink-0 text-xl text-amber-600"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                Location data could not be loaded
              </p>
              <p className="mt-1 text-sm text-amber-700">{locationError}</p>
            </div>
            <button
              type="button"
              onClick={() => setLocationError(null)}
              aria-label="Close location error"
              className="text-amber-700 hover:text-amber-900"
            >
              <Icon icon="lucide:x" className="text-lg" />
            </button>
          </div>
        )}

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
            className={`
              grid
              grid-cols-1
              gap-4
              p-4
              ${
                isSeniorSecondaryClass
                  ? "md:grid-cols-2 xl:grid-cols-4"
                  : "md:grid-cols-3"
              }
            `}
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

            {isSeniorSecondaryClass && (
              <div>
                <label className={labelClassName}>
                  Stream
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  value={stream}
                  onChange={(event) =>
                    setStream(
                      event.target.value as StudentStream | "",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="">Select stream</option>
                  <option value="SCIENCE">Science</option>
                  <option value="COMMERCE">Commerce</option>
                  <option value="ARTS">Arts</option>
                  <option value="VOCATIONAL">Vocational</option>
                </select>
              </div>
            )}
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
              </label>

              <div className="flex min-h-10 items-center gap-2 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] px-3 text-sm text-[#6B7280]">
                <Icon
                  icon="lucide:sparkles"
                  className="text-[#1F5FAE]"
                />
                Generated automatically
              </div>
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
                <label className={labelClassName}>PEN Number</label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={penNumber}
                  onChange={(event) =>
                    setPenNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 11),
                    )
                  }
                  placeholder="11 digit PEN Number"
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

            <div>
              <label className={labelClassName}>Country</label>

              <select
                value={currentAddress.countryCode ?? ""}
                onChange={(event) =>
                  handleCurrentCountryChange(event.target.value)
                }
                disabled={countryLoading}
                className={inputClassName}
              >
                <option value="">
                  {countryLoading ? "Loading countries..." : "Select country"}
                </option>

                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>State</label>

              <select
                value={currentAddress.stateCode ?? ""}
                onChange={(event) =>
                  handleCurrentStateChange(event.target.value)
                }
                disabled={
                  !currentAddress.countryCode ||
                  currentStateLoading
                }
                className={inputClassName}
              >
                <option value="">
                  {currentStateLoading ? "Loading states..." : "Select state"}
                </option>

                {currentStates.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>District</label>

              <select
                value={currentAddress.districtCode ?? ""}
                onChange={(event) =>
                  handleCurrentDistrictChange(event.target.value)
                }
                disabled={
                  !currentAddress.stateCode ||
                  currentDistrictLoading
                }
                className={inputClassName}
              >
                <option value="">
                  {currentDistrictLoading
                    ? "Loading districts..."
                    : "Select district"}
                </option>

                {currentDistricts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Sub-District / Tehsil</label>

              <select
                value={currentAddress.subDistrictCode ?? ""}
                onChange={(event) =>
                  handleCurrentSubDistrictChange(event.target.value)
                }
                disabled={
                  !currentAddress.districtCode ||
                  currentSubDistrictLoading
                }
                className={inputClassName}
              >
                <option value="">
                  {currentSubDistrictLoading
                    ? "Loading sub-districts..."
                    : "Select sub-district / tehsil"}
                </option>

                {currentSubDistricts.map((subDistrict) => (
                  <option key={subDistrict.code} value={subDistrict.code}>
                    {subDistrict.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>Pincode</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={currentAddress.pincode ?? ""}
                onChange={(event) =>
                  updateCurrentAddress(
                    "pincode",
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder="Enter pincode"
                className={inputClassName}
              />
            </div>
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

              <div>
                <label className={labelClassName}>Country</label>

                <select
                  value={permanentAddress.countryCode ?? ""}
                  onChange={(event) =>
                    handlePermanentCountryChange(event.target.value)
                  }
                  disabled={sameAsCurrent || countryLoading}
                  className={inputClassName}
                >
                  <option value="">
                    {countryLoading
                      ? "Loading countries..."
                      : "Select country"}
                  </option>

                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>State</label>

                <select
                  value={permanentAddress.stateCode ?? ""}
                  onChange={(event) =>
                    handlePermanentStateChange(event.target.value)
                  }
                  disabled={
                    sameAsCurrent ||
                    !permanentAddress.countryCode ||
                    permanentStateLoading
                  }
                  className={inputClassName}
                >
                  <option value="">
                    {permanentStateLoading
                      ? "Loading states..."
                      : "Select state"}
                  </option>

                  {(sameAsCurrent ? currentStates : permanentStates).map(
                    (state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className={labelClassName}>District</label>

                <select
                  value={permanentAddress.districtCode ?? ""}
                  onChange={(event) =>
                    handlePermanentDistrictChange(event.target.value)
                  }
                  disabled={
                    sameAsCurrent ||
                    !permanentAddress.stateCode ||
                    permanentDistrictLoading
                  }
                  className={inputClassName}
                >
                  <option value="">
                    {permanentDistrictLoading
                      ? "Loading districts..."
                      : "Select district"}
                  </option>

                  {(sameAsCurrent
                    ? currentDistricts
                    : permanentDistricts
                  ).map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Sub-District / Tehsil</label>

                <select
                  value={permanentAddress.subDistrictCode ?? ""}
                  onChange={(event) =>
                    handlePermanentSubDistrictChange(event.target.value)
                  }
                  disabled={
                    sameAsCurrent ||
                    !permanentAddress.districtCode ||
                    permanentSubDistrictLoading
                  }
                  className={inputClassName}
                >
                  <option value="">
                    {permanentSubDistrictLoading
                      ? "Loading sub-districts..."
                      : "Select sub-district / tehsil"}
                  </option>

                  {(sameAsCurrent
                    ? currentSubDistricts
                    : permanentSubDistricts
                  ).map((subDistrict) => (
                    <option key={subDistrict.code} value={subDistrict.code}>
                      {subDistrict.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Pincode</label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={sameAsCurrent}
                  value={permanentAddress.pincode ?? ""}
                  onChange={(event) =>
                    updatePermanentAddress(
                      "pincode",
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="Enter pincode"
                  className={inputClassName}
                />
              </div>
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

