import api from "../../api/axios";

import type {
  BulkPromotionSummary,
  BulkStudentPromotionRequest,
  PromotionCandidate,
  PromotionCandidateFilters,
  PromotionPreviewResult,
  SingleStudentPromotionRequest,
  StudentEnrollment,
  UpdateStudentEnrollmentData,
} from "./studentPromotion.types";


// ==========================================
// 1. GET PROMOTION CANDIDATES
// ==========================================

export const getPromotionCandidatesApi = async (
  filters: PromotionCandidateFilters
): Promise<PromotionCandidate[]> => {
  const params: Record<string, string> = {
    sessionId: filters.sessionId,
    classId: filters.classId,
  };


  if (filters.sectionId) {
    params.sectionId =
      filters.sectionId;
  }


  const response = await api.get(
    "/students/promotions/candidates",
    {
      params,
    }
  );


  const data =
    response.data?.data;


  if (!Array.isArray(data)) {
    console.error(
      "Promotion candidates API data is not an array:",
      response.data
    );

    return [];
  }


  return data as PromotionCandidate[];
};


// ==========================================
// 2. PREVIEW BULK PROMOTION
// ==========================================

export const previewBulkPromotionApi = async (
  data: BulkStudentPromotionRequest
): Promise<PromotionPreviewResult> => {
  const response = await api.post(
    "/students/promotions/preview",
    data
  );


  return response.data
    .data as PromotionPreviewResult;
};


// ==========================================
// 3. EXECUTE BULK PROMOTION
// ==========================================

export const bulkPromoteStudentsApi = async (
  data: BulkStudentPromotionRequest
): Promise<BulkPromotionSummary> => {
  const response = await api.post(
    "/students/promotions/bulk",
    data
  );


  return response.data
    .data as BulkPromotionSummary;
};


// ==========================================
// 4. SINGLE STUDENT PROMOTION
// ==========================================

export const promoteSingleStudentApi = async (
  studentId: string,
  data: SingleStudentPromotionRequest
): Promise<BulkPromotionSummary> => {
  const response = await api.post(
    `/students/${studentId}/promotion`,
    data
  );


  return response.data
    .data as BulkPromotionSummary;
};


// ==========================================
// 5. GET STUDENT ENROLLMENT HISTORY
// ==========================================

export const getStudentEnrollmentHistoryApi = async (
  studentId: string
): Promise<StudentEnrollment[]> => {
  const response = await api.get(
    `/students/${studentId}/enrollments`
  );

  const enrollments =
    response.data?.data?.enrollments;

  if (!Array.isArray(enrollments)) {
    console.error(
      "Invalid enrollment history response:",
      response.data
    );

    return [];
  }

  return enrollments as StudentEnrollment[];
};


// ==========================================
// 6. GET ONE ENROLLMENT
// ==========================================

export const getEnrollmentByIdApi = async (
  enrollmentId: string
): Promise<StudentEnrollment> => {
  const response = await api.get(
    `/students/enrollments/${enrollmentId}`
  );


  return response.data
    .data as StudentEnrollment;
};


// ==========================================
// 7. UPDATE ENROLLMENT
// ==========================================

export const updateEnrollmentApi = async (
  enrollmentId: string,
  data: UpdateStudentEnrollmentData
): Promise<StudentEnrollment> => {
  const response = await api.patch(
    `/students/enrollments/${enrollmentId}`,
    data
  );


  return response.data
    .data as StudentEnrollment;
};