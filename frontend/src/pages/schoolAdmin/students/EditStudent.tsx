import React, { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Icon } from "@iconify/react";

import {
  clearSelectedStudent,
  clearStudentError,
  getStudentById,
  updateStudent,
} from "../../../features/student/student.slice";

import {
  clearEnrollmentHistory,
  getStudentEnrollmentHistory,
  updateEnrollment,
} from "../../../features/student/studentPromotion.slice";

import type {
  AdmissionCategory,
  AdmissionType,
  StudentAddress,
  StudentBloodGroup,
  StudentCategory,
  StudentGender,
  StudentParentDetails,
  StudentStatus,
  UpdateStudentData,
} from "../../../features/student/student.types";

import type { StudentStream } from "../../../features/student/studentPromotion.types";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import api from "../../../api/axios";
import ModalComponent from "../../../components/common/EditStudent";

type LocationAwareAddress = StudentAddress & {
  countryCode?: string;
  stateCode?: string;
  districtCode?: string;
};

interface LocationOption {
  code: string;
  name: string;
}

interface MasterLocation {
  code?: string | number;
  id?: string | number;
  countryCode?: string | number;
  stateCode?: string | number;
  districtCode?: string | number;
  isoCode?: string | number;
  iso2?: string | number;
  name?: string;
  countryName?: string;
  stateName?: string;
  districtName?: string;
}

const getLocationOptions = (
  responseData: unknown,
  listKey: "countries" | "states" | "districts",
): LocationOption[] => {
  const response = responseData as {
    data?: unknown;
    [key: string]: unknown;
  };

  const nestedData = response?.data as Record<string, unknown> | unknown[];

  const rawItems = Array.isArray(nestedData)
    ? nestedData
    : Array.isArray(nestedData?.[listKey])
      ? nestedData[listKey]
      : Array.isArray(response?.[listKey])
        ? response[listKey]
        : [];

  return (rawItems as MasterLocation[])
    .map((item) => {
      const rawCode =
        item.countryCode ??
        item.stateCode ??
        item.districtCode ??
        item.isoCode ??
        item.iso2 ??
        item.code ??
        item.id;

      const rawName =
        item.countryName ?? item.stateName ?? item.districtName ?? item.name;

      return {
        code: rawCode === undefined ? "" : String(rawCode),
        name: rawName?.trim() ?? "",
      };
    })
    .filter((item) => item.code && item.name);
};

const loadLocationOptions = async (
  listKey: "countries" | "states" | "districts",
  params?: Record<string, string>,
) => {
  const response = await api.get(`/master/locations/${listKey}`, {
    params,
  });

  return getLocationOptions(response.data, listKey);
};

/* =====================================================
   HELPERS
===================================================== */

const emptyAddress = (): LocationAwareAddress => ({
  addressLine: "",
  city: "",
  district: "",
  districtCode: "",
  state: "",
  stateCode: "",
  pincode: "",
  country: "",
  countryCode: "",
});

const emptyParent = (): StudentParentDetails => ({
  name: "",
  mobile: "",
  aadhaarNumber: "",
  occupation: "",
});

const relationName = (
  value:
    | string
    | {
        name?: string;
      }
    | undefined,
) => {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.name ?? "—";
};

const relationId = (value: string | { _id?: string } | undefined): string => {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value : (value._id ?? "");
};

const isSeniorSecondaryClass = (
  value:
    | {
        name?: string;
        order?: number;
      }
    | string
    | undefined,
): boolean => {
  if (!value || typeof value === "string") {
    return false;
  }

  if (value.order === 11 || value.order === 12) {
    return true;
  }

  const name = value.name?.trim().toLowerCase().replace(/\s+/g, "") ?? "";

  return ["11", "12", "class11", "class12", "xi", "xii"].includes(name);
};

const toDateInputValue = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

/* =====================================================
   COMPONENT
===================================================== */

const EditStudent: React.FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { studentId } = useParams<{
    studentId: string;
  }>();

  const { selectedStudent, loading, error } = useAppSelector(
    (state) => state.students,
  );

  const {
    enrollmentHistory,
    enrollmentHistoryLoading,
    enrollmentUpdating,
    error: enrollmentError,
  } = useAppSelector((state) => state.studentPromotion);

  const currentEnrollment = useMemo(() => {
    const activeEnrollments = enrollmentHistory.filter(
      (enrollment) => enrollment.enrollmentStatus === "ACTIVE",
    );

    const selectedSessionId = relationId(selectedStudent?.sessionId);

    return (
      activeEnrollments.find(
        (enrollment) => relationId(enrollment.sessionId) === selectedSessionId,
      ) ??
      activeEnrollments[0] ??
      enrollmentHistory[0] ??
      null
    );
  }, [enrollmentHistory, selectedStudent?.sessionId]);

  const currentClass = currentEnrollment?.classId;

  const canEditStream = isSeniorSecondaryClass(currentClass);

  /* ===================================================
     ADMISSION DETAILS
  =================================================== */

  const [admissionNumber, setAdmissionNumber] = useState("");

  const [admissionDate, setAdmissionDate] = useState("");

  const [admissionType, setAdmissionType] = useState<AdmissionType>("NEW");

  const [admissionCategory, setAdmissionCategory] =
    useState<AdmissionCategory>("REGULAR");

  /* ===================================================
     PERSONAL DETAILS
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

  const [mobile, setMobile] = useState("");

  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<StudentStatus>("ACTIVE");

  /* ===================================================
     PHOTO
  =================================================== */

  const [photo, setPhoto] = useState<File | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [existingPhoto, setExistingPhoto] = useState("");

  /* ===================================================
     ADDRESS / PARENTS
  =================================================== */

  const [currentAddress, setCurrentAddress] =
    useState<LocationAwareAddress>(emptyAddress());

  const [permanentAddress, setPermanentAddress] =
    useState<LocationAwareAddress>(emptyAddress());

  const [countries, setCountries] = useState<LocationOption[]>([]);

  const [currentStates, setCurrentStates] = useState<LocationOption[]>([]);

  const [currentDistricts, setCurrentDistricts] = useState<LocationOption[]>(
    [],
  );

  const [permanentStates, setPermanentStates] = useState<LocationOption[]>([]);

  const [permanentDistricts, setPermanentDistricts] = useState<
    LocationOption[]
  >([]);

  const [locationLoading, setLocationLoading] = useState(false);

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [father, setFather] = useState<StudentParentDetails>(emptyParent());

  const [mother, setMother] = useState<StudentParentDetails>(emptyParent());

  const [formError, setFormError] = useState<string | null>(null);

  const [updateSucceeded, setUpdateSucceeded] = useState(false);

  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);

  const [selectedStream, setSelectedStream] = useState<StudentStream | "">("");

  const [streamFormError, setStreamFormError] = useState<string | null>(null);

  const [streamUpdateSucceeded, setStreamUpdateSucceeded] = useState(false);

  /* ===================================================
     LOAD STUDENT DIRECTLY BY ROUTE ID
  =================================================== */

  useEffect(() => {
    if (!studentId) {
      return;
    }

    dispatch(getStudentById(studentId));

    dispatch(getStudentEnrollmentHistory(studentId));

    return () => {
      dispatch(clearSelectedStudent());

      dispatch(clearStudentError());

      dispatch(clearEnrollmentHistory());
    };
  }, [dispatch, studentId]);

  useEffect(() => {
    setSelectedStream(currentEnrollment?.stream ?? "");
  }, [currentEnrollment?.stream]);

  useEffect(() => {
    if (!isStreamModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !enrollmentUpdating) {
        setIsStreamModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enrollmentUpdating, isStreamModalOpen]);

  /* ===================================================
     POPULATE FORM
  =================================================== */

  useEffect(() => {
    if (!selectedStudent || selectedStudent._id !== studentId) {
      return;
    }

    setAdmissionNumber(selectedStudent.admissionNumber ?? "");

    setAdmissionDate(toDateInputValue(selectedStudent.admissionDate));

    setAdmissionType(selectedStudent.admissionType ?? "NEW");

    setAdmissionCategory(selectedStudent.admissionCategory ?? "REGULAR");

    setName(selectedStudent.name ?? "");

    setDob(toDateInputValue(selectedStudent.dob));

    setGender(selectedStudent.gender ?? "");

    setBloodGroup(selectedStudent.bloodGroup ?? "");

    setReligion(selectedStudent.religion ?? "");

    setCategory(selectedStudent.category ?? "");

    setCaste(selectedStudent.caste ?? "");

    setAadhaarNumber(selectedStudent.aadhaarNumber ?? "");

    setApaarId(selectedStudent.apaarId ?? "");

    setPenNumber(selectedStudent.penNumber ?? "");

    setMobile(selectedStudent.mobile ?? "");

    setEmail(selectedStudent.email ?? "");

    setStatus(selectedStudent.status ?? "ACTIVE");

    setExistingPhoto(selectedStudent.photo ?? "");

    setCurrentAddress({
      ...emptyAddress(),
      ...(selectedStudent.currentAddress ?? selectedStudent.address ?? {}),
    });

    setPermanentAddress({
      ...emptyAddress(),
      ...(selectedStudent.permanentAddress ?? {}),
    });

    setFather({
      ...emptyParent(),
      ...(selectedStudent.father ?? {}),
    });

    setMother({
      ...emptyParent(),
      ...(selectedStudent.mother ?? {}),
    });
  }, [selectedStudent, studentId]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  /* ===================================================
     LOCATION MASTER DATA
  =================================================== */

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      setLocationLoading(true);

      try {
        const result = await loadLocationOptions("countries");

        if (active) {
          setCountries(result);
        }
      } catch {
        if (active) {
          setFormError("Failed to load countries.");
        }
      } finally {
        if (active) {
          setLocationLoading(false);
        }
      }
    };

    void loadCountries();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (
      currentAddress.countryCode ||
      !currentAddress.country ||
      countries.length === 0
    ) {
      return;
    }

    const match = countries.find(
      (item) =>
        item.name.toLowerCase() ===
        currentAddress.country?.trim().toLowerCase(),
    );

    if (match) {
      setCurrentAddress((previous) => ({
        ...previous,
        countryCode: match.code,
      }));
    }
  }, [countries, currentAddress.country, currentAddress.countryCode]);

  useEffect(() => {
    const countryCode = currentAddress.countryCode;

    setCurrentStates([]);
    setCurrentDistricts([]);

    if (!countryCode) {
      return;
    }

    let active = true;

    const loadStates = async () => {
      try {
        const result = await loadLocationOptions("states", {
          countryCode,
        });

        if (active) {
          setCurrentStates(result);
        }
      } catch {
        if (active) {
          setFormError("Failed to load states.");
        }
      }
    };

    void loadStates();

    return () => {
      active = false;
    };
  }, [currentAddress.countryCode]);

  useEffect(() => {
    if (
      currentAddress.stateCode ||
      !currentAddress.state ||
      currentStates.length === 0
    ) {
      return;
    }

    const match = currentStates.find(
      (item) =>
        item.name.toLowerCase() === currentAddress.state?.trim().toLowerCase(),
    );

    if (match) {
      setCurrentAddress((previous) => ({
        ...previous,
        stateCode: match.code,
      }));
    }
  }, [currentAddress.state, currentAddress.stateCode, currentStates]);

  useEffect(() => {
    const stateCode = currentAddress.stateCode;

    setCurrentDistricts([]);

    if (!stateCode) {
      return;
    }

    let active = true;

    const loadDistricts = async () => {
      try {
        const result = await loadLocationOptions("districts", {
          stateCode,
        });

        if (active) {
          setCurrentDistricts(result);
        }
      } catch {
        if (active) {
          setFormError("Failed to load districts.");
        }
      }
    };

    void loadDistricts();

    return () => {
      active = false;
    };
  }, [currentAddress.stateCode]);

  useEffect(() => {
    if (
      currentAddress.districtCode ||
      !currentAddress.district ||
      currentDistricts.length === 0
    ) {
      return;
    }

    const match = currentDistricts.find(
      (item) =>
        item.name.toLowerCase() ===
        currentAddress.district?.trim().toLowerCase(),
    );

    if (match) {
      setCurrentAddress((previous) => ({
        ...previous,
        districtCode: match.code,
      }));
    }
  }, [currentAddress.district, currentAddress.districtCode, currentDistricts]);

  useEffect(() => {
    if (
      permanentAddress.countryCode ||
      !permanentAddress.country ||
      countries.length === 0
    ) {
      return;
    }

    const match = countries.find(
      (item) =>
        item.name.toLowerCase() ===
        permanentAddress.country?.trim().toLowerCase(),
    );

    if (match) {
      setPermanentAddress((previous) => ({
        ...previous,
        countryCode: match.code,
      }));
    }
  }, [countries, permanentAddress.country, permanentAddress.countryCode]);

  useEffect(() => {
    const countryCode = permanentAddress.countryCode;

    setPermanentStates([]);
    setPermanentDistricts([]);

    if (!countryCode || sameAsCurrent) {
      return;
    }

    let active = true;

    const loadStates = async () => {
      try {
        const result = await loadLocationOptions("states", {
          countryCode,
        });

        if (active) {
          setPermanentStates(result);
        }
      } catch {
        if (active) {
          setFormError("Failed to load permanent-address states.");
        }
      }
    };

    void loadStates();

    return () => {
      active = false;
    };
  }, [permanentAddress.countryCode, sameAsCurrent]);

  useEffect(() => {
    if (
      permanentAddress.stateCode ||
      !permanentAddress.state ||
      permanentStates.length === 0 ||
      sameAsCurrent
    ) {
      return;
    }

    const match = permanentStates.find(
      (item) =>
        item.name.toLowerCase() ===
        permanentAddress.state?.trim().toLowerCase(),
    );

    if (match) {
      setPermanentAddress((previous) => ({
        ...previous,
        stateCode: match.code,
      }));
    }
  }, [
    permanentAddress.state,
    permanentAddress.stateCode,
    permanentStates,
    sameAsCurrent,
  ]);

  useEffect(() => {
    const stateCode = permanentAddress.stateCode;

    setPermanentDistricts([]);

    if (!stateCode || sameAsCurrent) {
      return;
    }

    let active = true;

    const loadDistricts = async () => {
      try {
        const result = await loadLocationOptions("districts", {
          stateCode,
        });

        if (active) {
          setPermanentDistricts(result);
        }
      } catch {
        if (active) {
          setFormError("Failed to load permanent-address districts.");
        }
      }
    };

    void loadDistricts();

    return () => {
      active = false;
    };
  }, [permanentAddress.stateCode, sameAsCurrent]);

  useEffect(() => {
    if (
      permanentAddress.districtCode ||
      !permanentAddress.district ||
      permanentDistricts.length === 0 ||
      sameAsCurrent
    ) {
      return;
    }

    const match = permanentDistricts.find(
      (item) =>
        item.name.toLowerCase() ===
        permanentAddress.district?.trim().toLowerCase(),
    );

    if (match) {
      setPermanentAddress((previous) => ({
        ...previous,
        districtCode: match.code,
      }));
    }
  }, [
    permanentAddress.district,
    permanentAddress.districtCode,
    permanentDistricts,
    sameAsCurrent,
  ]);

  /* ===================================================
     CHANGE HANDLERS
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

  const removeNewPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview(null);
  };

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

  const handleCurrentCountryChange = (countryCode: string) => {
    const country = countries.find((item) => item.code === countryCode);

    const nextAddress: LocationAwareAddress = {
      ...currentAddress,
      countryCode,
      country: country?.name ?? "",
      stateCode: "",
      state: "",
      districtCode: "",
      district: "",
    };

    setCurrentAddress(nextAddress);

    if (sameAsCurrent) {
      setPermanentAddress({
        ...nextAddress,
      });
    }
  };

  const handleCurrentStateChange = (stateCode: string) => {
    const state = currentStates.find((item) => item.code === stateCode);

    const nextAddress: LocationAwareAddress = {
      ...currentAddress,
      stateCode,
      state: state?.name ?? "",
      districtCode: "",
      district: "",
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
    };

    setCurrentAddress(nextAddress);

    if (sameAsCurrent) {
      setPermanentAddress({
        ...nextAddress,
      });
    }
  };

  const handlePermanentCountryChange = (countryCode: string) => {
    const country = countries.find((item) => item.code === countryCode);

    setPermanentAddress((previous) => ({
      ...previous,
      countryCode,
      country: country?.name ?? "",
      stateCode: "",
      state: "",
      districtCode: "",
      district: "",
    }));
  };

  const handlePermanentStateChange = (stateCode: string) => {
    const state = permanentStates.find((item) => item.code === stateCode);

    setPermanentAddress((previous) => ({
      ...previous,
      stateCode,
      state: state?.name ?? "",
      districtCode: "",
      district: "",
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
    }));
  };

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
     VALIDATION / CLEANERS
  =================================================== */

  const validateTwelveDigits = (value: string, label: string) => {
    if (value && !/^\d{12}$/.test(value)) {
      setFormError(`${label} must contain exactly 12 digits.`);

      return false;
    }

    return true;
  };

  const cleanAddress = (source: LocationAwareAddress): LocationAwareAddress => {
    const result: LocationAwareAddress = {};

    (
      [
        "addressLine",
        "city",
        "district",
        "districtCode",
        "state",
        "stateCode",
        "pincode",
        "country",
        "countryCode",
      ] as const
    ).forEach((key) => {
      const value = source[key]?.trim();

      if (value) {
        result[key] = value;
      }
    });

    return result;
  };

  const cleanParent = (source: StudentParentDetails): StudentParentDetails => {
    const result: StudentParentDetails = {};

    (["name", "mobile", "aadhaarNumber", "occupation"] as const).forEach(
      (key) => {
        const value = source[key]?.trim();

        if (value) {
          result[key] = value;
        }
      },
    );

    return result;
  };

  /* ===================================================
     STREAM UPDATE
  =================================================== */

  const openStreamModal = () => {
    if (!currentEnrollment) {
      setFormError("Current academic enrollment is not available.");

      return;
    }

    if (!canEditStream) {
      setFormError("Stream can only be changed for Class 11 or Class 12.");

      return;
    }

    setSelectedStream(currentEnrollment.stream ?? "");
    setStreamFormError(null);
    setIsStreamModalOpen(true);
  };

  const handleStreamUpdate = async () => {
    if (!currentEnrollment) {
      setStreamFormError("Current academic enrollment is not available.");

      return;
    }

    if (!selectedStream) {
      setStreamFormError("Please select a student stream.");

      return;
    }

    if (selectedStream === currentEnrollment.stream) {
      setStreamFormError("Please select a different stream.");

      return;
    }

    setStreamFormError(null);

    try {
      await dispatch(
        updateEnrollment({
          enrollmentId: currentEnrollment._id,
          data: {
            stream: selectedStream,
            remarks: `Stream changed from ${currentEnrollment.stream ?? "Not assigned"} to ${selectedStream}`,
          },
        }),
      ).unwrap();

      setIsStreamModalOpen(false);
      setStreamUpdateSucceeded(true);

      if (studentId) {
        dispatch(getStudentEnrollmentHistory(studentId));
      }
    } catch (streamError) {
      setStreamFormError(
        typeof streamError === "string"
          ? streamError
          : "Failed to update student stream.",
      );
    }
  };

  /* ===================================================
     SUBMIT
  =================================================== */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!studentId) {
      setFormError("Student ID is missing.");

      return;
    }

    if (!name.trim()) {
      setFormError("Student name is required.");

      return;
    }

    if (!gender) {
      setFormError("Please select student gender.");

      return;
    }

    if (
      !validateTwelveDigits(aadhaarNumber, "Student Aadhaar number") ||
      !validateTwelveDigits(apaarId, "APAAR ID") ||
      !validateTwelveDigits(
        father.aadhaarNumber ?? "",
        "Father Aadhaar number",
      ) ||
      !validateTwelveDigits(mother.aadhaarNumber ?? "", "Mother Aadhaar number")
    ) {
      return;
    }

    if (penNumber && !/^\d{11}$/.test(penNumber)) {
      setFormError("PEN Number must contain exactly 11 digits.");

      return;
    }

    const data: UpdateStudentData = {
      name: name.trim(),

      gender: gender as StudentGender,

      admissionType,

      admissionCategory,

      status,
    };

    if (admissionDate) {
      data.admissionDate = admissionDate;
    }

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

    if (mobile.trim()) {
      data.mobile = mobile.trim();
    }

    if (email.trim()) {
      data.email = email.trim().toLowerCase();
    }

    if (photo) {
      data.photo = photo;
    }

    const cleanedCurrent = cleanAddress(currentAddress);

    if (Object.keys(cleanedCurrent).length > 0) {
      data.currentAddress = cleanedCurrent;

      data.address = cleanedCurrent;
    }

    const cleanedPermanent = cleanAddress(permanentAddress);

    if (Object.keys(cleanedPermanent).length > 0) {
      data.permanentAddress = cleanedPermanent;
    }

    const cleanedFather = cleanParent(father);

    if (Object.keys(cleanedFather).length > 0) {
      data.father = cleanedFather;
    }

    const cleanedMother = cleanParent(mother);

    if (Object.keys(cleanedMother).length > 0) {
      data.mother = cleanedMother;
    }

    setFormError(null);

    try {
      await dispatch(
        updateStudent({
          studentId,
          data,
        }),
      ).unwrap();

      setUpdateSucceeded(true);
    } catch (updateError) {
      console.error("Failed to update student:", updateError);
    }
  };

  /* ===================================================
     UI HELPERS
  =================================================== */

  const inputClassName = `
    min-h-11
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

  const labelClassName = "mb-2 block text-sm font-semibold text-[#15243B]";

  const SectionHeader = ({
    icon,
    title,
    description,
  }: {
    icon: string;
    title: string;
    description: string;
  }) => (
    <div className="border-b border-[#E5E7EB] px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F0FB] text-[#1F5FAE]">
          <Icon icon={icon} className="text-xl" />
        </div>

        <div>
          <h2 className="font-semibold text-[#15243B]">{title}</h2>

          <p className="text-xs text-[#6B7280]">{description}</p>
        </div>
      </div>
    </div>
  );

  if (loading && !selectedStudent) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <Icon
            icon="lucide:loader-circle"
            className="mx-auto animate-spin text-4xl text-[#1F5FAE]"
          />

          <p className="mt-3 text-sm text-[#6B7280]">Loading student...</p>
        </div>
      </div>
    );
  }

  if (!loading && !selectedStudent) {
    return (
      <div className="flex min-h-[420px] items-center justify-center bg-[#F7F9FC] p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center">
          <Icon
            icon="lucide:circle-alert"
            className="mx-auto text-4xl text-red-500"
          />

          <h2 className="mt-3 font-semibold text-[#15243B]">
            Student not found
          </h2>

          <p className="mt-2 text-sm text-[#6B7280]">
            {error ?? "Unable to load student details."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/school-admin/students")}
            className="mt-5 min-h-11 rounded-lg bg-[#1F5FAE] px-5 text-sm font-semibold text-white"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const previewSource = photoPreview || existingPhoto;

  /* ===================================================
     UI
  =================================================== */

  return (
    <div className="min-h-full bg-[#F7F9FC] p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-[#6B7280]">
            <button
              type="button"
              onClick={() => navigate("/school-admin/students")}
              className="hover:text-[#1F5FAE]"
            >
              Students
            </button>

            <Icon icon="lucide:chevron-right" />

            <span className="text-[#15243B]">Edit Student</span>
          </div>

          <h1 className="text-2xl font-bold text-[#15243B] md:text-3xl">
            Edit Student
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Update student profile, admission, parent and address details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/school-admin/students/${studentId}`)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB]"
        >
          <Icon icon="lucide:arrow-left" />
          Back to Details
        </button>
      </div>

      {(formError || error) && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <Icon
            icon="lucide:circle-alert"
            className="mt-0.5 shrink-0 text-xl text-red-500"
          />

          <div>
            <p className="text-sm font-semibold text-red-700">
              Unable to update student
            </p>

            <p className="mt-1 text-sm text-red-600">{formError || error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ACADEMIC PLACEMENT */}

        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <SectionHeader
            icon="lucide:graduation-cap"
            title="Academic Placement"
            description="Review the current placement and safely change the stream for Class 11 or 12."
          />

          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                [
                  "Academic Session",
                  relationName(
                    currentEnrollment?.sessionId ?? selectedStudent?.sessionId,
                  ),
                ],
                [
                  "Class",
                  relationName(
                    currentEnrollment?.classId ?? selectedStudent?.classId,
                  ),
                ],
                [
                  "Section",
                  relationName(
                    currentEnrollment?.sectionId ?? selectedStudent?.sectionId,
                  ),
                ],
                [
                  "Roll Number",
                  currentEnrollment?.rollNumber?.toString() ??
                    selectedStudent?.rollNumber?.toString() ??
                    "—",
                ],
                [
                  "Stream",
                  currentEnrollment?.stream
                    ? currentEnrollment.stream.charAt(0) +
                      currentEnrollment.stream.slice(1).toLowerCase()
                    : "—",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3.5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    {label}
                  </p>

                  <p className="mt-1.5 font-bold text-[#15243B]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-[#1F5FAE] shadow-sm">
                  <Icon icon="lucide:route" />
                </span>

                <div>
                  <p className="text-sm font-bold text-[#15243B]">
                    Academic correction
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#64748B]">
                    Stream changes may drop electives that do not belong to the
                    new stream.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openStreamModal}
                disabled={
                  enrollmentHistoryLoading ||
                  enrollmentUpdating ||
                  !currentEnrollment ||
                  !canEditStream
                }
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174F91] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
              >
                {enrollmentHistoryLoading ? (
                  <Icon
                    icon="lucide:loader-circle"
                    className="animate-spin text-lg"
                  />
                ) : (
                  <Icon icon="lucide:shuffle" className="text-lg" />
                )}

                {canEditStream ? "Change Stream" : "Stream Not Applicable"}
              </button>
            </div>

            {enrollmentError && (
              <p className="mt-3 text-sm font-medium text-red-600">
                {enrollmentError}
              </p>
            )}
          </div>
        </div>

        {/* ADMISSION DETAILS */}

        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <SectionHeader
            icon="lucide:clipboard-list"
            title="Admission Details"
            description="Update non-academic admission information."
          />

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className={labelClassName}>Admission Number</label>

              <input
                value={admissionNumber}
                disabled
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

        {/* STUDENT DETAILS */}

        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <SectionHeader
            icon="lucide:user"
            title="Student Details"
            description="Update personal and contact information."
          />

          <div className="p-5">
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-4 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
                {previewSource ? (
                  <img
                    src={previewSource}
                    alt="Student"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon
                    icon="lucide:user-round"
                    className="text-4xl text-[#9CA3AF]"
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#15243B]">
                  Student Photo
                </p>

                <p className="mt-1 text-xs text-[#6B7280]">
                  JPG, PNG or WEBP. Maximum 2 MB.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#1F5FAE] px-4 text-sm font-semibold text-white hover:bg-[#174F91]">
                    <Icon icon="lucide:upload" />
                    Change Photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>

                  {photo && (
                    <button
                      type="button"
                      onClick={removeNewPhoto}
                      className="min-h-10 rounded-lg border border-[#D1D5DB] bg-white px-4 text-sm font-semibold text-[#15243B]"
                    >
                      Undo New Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className={labelClassName}>
                  Student Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
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
                  value={religion}
                  onChange={(event) => setReligion(event.target.value)}
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

              {[
                ["Caste", caste, setCaste, "text"],
                ["Mobile", mobile, setMobile, "tel"],
                ["Email", email, setEmail, "email"],
              ].map(([label, value, setter, type]) => (
                <div key={label as string}>
                  <label className={labelClassName}>{label as string}</label>

                  <input
                    type={type as string}
                    value={value as string}
                    onChange={(event) =>
                      (setter as React.Dispatch<React.SetStateAction<string>>)(
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  />
                </div>
              ))}

              <div>
                <label className={labelClassName}>Aadhaar Number</label>

                <input
                  inputMode="numeric"
                  maxLength={12}
                  value={aadhaarNumber}
                  onChange={(event) =>
                    setAadhaarNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 12),
                    )
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>APAAR ID</label>

                <input
                  inputMode="numeric"
                  maxLength={12}
                  value={apaarId}
                  onChange={(event) =>
                    setApaarId(
                      event.target.value.replace(/\D/g, "").slice(0, 12),
                    )
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>PEN Number</label>

                <input
                  inputMode="numeric"
                  maxLength={11}
                  value={penNumber}
                  onChange={(event) =>
                    setPenNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 11),
                    )
                  }
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Status</label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as StudentStatus)
                  }
                  className={inputClassName}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="TRANSFERRED">Transferred</option>
                  <option value="PASSED">Passed</option>
                  <option value="LEFT">Left</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ADDRESS */}

        {[
          {
            title: "Current Address",
            icon: "lucide:map-pin",
            address: currentAddress,
            update: updateCurrentAddress,
            disabled: false,
            states: currentStates,
            districts: currentDistricts,
            onCountryChange: handleCurrentCountryChange,
            onStateChange: handleCurrentStateChange,
            onDistrictChange: handleCurrentDistrictChange,
          },
          {
            title: "Permanent Address",
            icon: "lucide:home",
            address: permanentAddress,
            update: updatePermanentAddress,
            disabled: sameAsCurrent,
            states: sameAsCurrent ? currentStates : permanentStates,
            districts: sameAsCurrent ? currentDistricts : permanentDistricts,
            onCountryChange: handlePermanentCountryChange,
            onStateChange: handlePermanentStateChange,
            onDistrictChange: handlePermanentDistrictChange,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
          >
            <SectionHeader
              icon={item.icon}
              title={item.title}
              description={`Update student's ${item.title.toLowerCase()}.`}
            />

            <div className="p-5">
              {item.title === "Permanent Address" && (
                <label className="mb-5 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#15243B]">
                  <input
                    type="checkbox"
                    checked={sameAsCurrent}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      setSameAsCurrent(checked);

                      if (checked) {
                        setPermanentAddress({
                          ...currentAddress,
                        });
                      }
                    }}
                    className="h-4 w-4 accent-[#1F5FAE]"
                  />
                  Same as Current Address
                </label>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div className="md:col-span-2 xl:col-span-3">
                  <label className={labelClassName}>Address Line</label>

                  <input
                    disabled={item.disabled}
                    value={item.address.addressLine ?? ""}
                    onChange={(event) =>
                      item.update("addressLine", event.target.value)
                    }
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className={labelClassName}>Country</label>

                  <select
                    disabled={item.disabled || locationLoading}
                    value={item.address.countryCode ?? ""}
                    onChange={(event) =>
                      item.onCountryChange(event.target.value)
                    }
                    className={inputClassName}
                  >
                    <option value="">
                      {locationLoading
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
                    disabled={item.disabled || !item.address.countryCode}
                    value={item.address.stateCode ?? ""}
                    onChange={(event) => item.onStateChange(event.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Select state</option>

                    {item.states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClassName}>District</label>

                  <select
                    disabled={item.disabled || !item.address.stateCode}
                    value={item.address.districtCode ?? ""}
                    onChange={(event) =>
                      item.onDistrictChange(event.target.value)
                    }
                    className={inputClassName}
                  >
                    <option value="">Select district</option>

                    {item.districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClassName}>City</label>

                  <input
                    disabled={item.disabled}
                    value={item.address.city ?? ""}
                    onChange={(event) =>
                      item.update("city", event.target.value)
                    }
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className={labelClassName}>Pincode</label>

                  <input
                    inputMode="numeric"
                    maxLength={6}
                    disabled={item.disabled}
                    value={item.address.pincode ?? ""}
                    onChange={(event) =>
                      item.update(
                        "pincode",
                        event.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* PARENTS */}

        {[
          {
            title: "Father Details",
            parent: father,
            update: updateFather,
          },
          {
            title: "Mother Details",
            parent: mother,
            update: updateMother,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
          >
            <SectionHeader
              icon="lucide:user-round"
              title={item.title}
              description={`Update student's ${item.title.toLowerCase()}.`}
            />

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              {(
                [
                  ["name", "Name"],
                  ["mobile", "Mobile"],
                  ["aadhaarNumber", "Aadhaar Number"],
                  ["occupation", "Occupation"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={labelClassName}>{label}</label>

                  <input
                    inputMode={key === "aadhaarNumber" ? "numeric" : undefined}
                    maxLength={key === "aadhaarNumber" ? 12 : undefined}
                    value={item.parent[key] ?? ""}
                    onChange={(event) => {
                      const value =
                        key === "aadhaarNumber"
                          ? event.target.value.replace(/\D/g, "").slice(0, 12)
                          : event.target.value;

                      item.update(key, value);
                    }}
                    className={inputClassName}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate(`/school-admin/students/${studentId}`)}
            className="min-h-11 rounded-lg border border-[#D1D5DB] bg-white px-5 text-sm font-semibold text-[#15243B] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#174F91] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Icon
                  icon="lucide:loader-circle"
                  className="animate-spin text-lg"
                />
                Saving Changes...
              </>
            ) : (
              <>
                <Icon icon="lucide:save" className="text-lg" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {isStreamModalOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !enrollmentUpdating) {
              setIsStreamModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stream-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-[#173C73] via-[#1F5FAE] to-[#3B82C4] px-6 py-6 text-white">
              <div className="absolute -right-10 -top-14 size-40 rounded-full bg-white/10" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl">
                    <Icon icon="lucide:shuffle" />
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                      Academic Enrollment
                    </p>

                    <h2
                      id="stream-modal-title"
                      className="mt-1 text-xl font-bold"
                    >
                      Change Student Stream
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close stream modal"
                  disabled={enrollmentUpdating}
                  onClick={() => setIsStreamModalOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20 disabled:opacity-50"
                >
                  <Icon icon="lucide:x" />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold uppercase text-[#64748B]">
                    Student
                  </p>
                  <p className="mt-1 font-bold text-[#15243B]">
                    {selectedStudent?.name ?? "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold uppercase text-[#64748B]">
                    Current stream
                  </p>
                  <p className="mt-1 font-bold text-[#15243B]">
                    {currentEnrollment?.stream ?? "Not assigned"}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="student-stream" className={labelClassName}>
                  New Stream <span className="text-red-500">*</span>
                </label>

                <select
                  id="student-stream"
                  autoFocus
                  value={selectedStream}
                  disabled={enrollmentUpdating}
                  onChange={(event) => {
                    setSelectedStream(event.target.value as StudentStream | "");
                    setStreamFormError(null);
                  }}
                  className={inputClassName}
                >
                  <option value="">Select new stream</option>
                  <option value="SCIENCE">Science</option>
                  <option value="COMMERCE">Commerce</option>
                  <option value="ARTS">Arts</option>
                  <option value="VOCATIONAL">Vocational</option>
                </select>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <Icon
                  icon="lucide:triangle-alert"
                  className="mt-0.5 shrink-0 text-xl text-amber-600"
                />

                <p className="text-sm leading-6 text-amber-800">
                  Elective subjects that are incompatible with the new stream
                  will be marked as dropped. Entire-class electives will remain
                  active.
                </p>
              </div>

              {streamFormError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  <Icon icon="lucide:circle-alert" className="mt-0.5 text-lg" />
                  <span>{streamFormError}</span>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={enrollmentUpdating}
                  onClick={() => setIsStreamModalOpen(false)}
                  className="min-h-11 rounded-lg border border-[#CBD5E1] bg-white px-5 text-sm font-semibold text-[#334155] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={enrollmentUpdating || !selectedStream}
                  onClick={handleStreamUpdate}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1F5FAE] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174F91] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
                >
                  {enrollmentUpdating ? (
                    <Icon
                      icon="lucide:loader-circle"
                      className="animate-spin text-lg"
                    />
                  ) : (
                    <Icon icon="lucide:check" className="text-lg" />
                  )}

                  {enrollmentUpdating
                    ? "Updating Stream..."
                    : "Confirm Stream Change"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalComponent
        isOpen={streamUpdateSucceeded}
        title="Student stream updated"
        message={`${name.trim() || "Student"} ka stream successfully update ho gaya hai. Incompatible electives have been dropped.`}
        primaryLabel="Continue Editing"
        onPrimary={() => setStreamUpdateSucceeded(false)}
        onClose={() => setStreamUpdateSucceeded(false)}
      />

      <ModalComponent
        isOpen={updateSucceeded}
        title="Student updated successfully"
        message={`${name.trim() || "Student"} ka profile successfully update ho gaya hai.`}
        primaryLabel="View Student"
        secondaryLabel="Continue Editing"
        onPrimary={() => navigate(`/school-admin/students/${studentId}`)}
        onSecondary={() => setUpdateSucceeded(false)}
        onClose={() => setUpdateSucceeded(false)}
      />
    </div>
  );
};

export default EditStudent;
