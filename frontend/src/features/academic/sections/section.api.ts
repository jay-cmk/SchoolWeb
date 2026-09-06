// ============================================
// SECTION API
// ============================================

import api from "../../../api/axios";

import type {
  SectionData,
  CreateSectionPayload,
  UpdateSectionPayload,
  GetSectionsParams,
  SectionResponse,
  SectionsResponse,
} from "./section.types";


// ============================================
// CREATE SECTION
// POST /academic/sections
// ============================================

export const createSectionApi = async (
  data: CreateSectionPayload
): Promise<SectionData> => {
  const response =
    await api.post<SectionResponse>(
      "/academic/sections",
      data
    );

  return response.data.data.section;
};


// ============================================
// GET ALL SECTIONS
// GET /academic/sections
// ============================================

export const getSectionsApi = async (
  params?: GetSectionsParams
): Promise<SectionData[]> => {
  const response =
    await api.get<SectionsResponse>(
      "/academic/sections",
      {
        params,
      }
    );

  return response.data.data.sections;
};


// ============================================
// GET SECTION BY ID
// GET /academic/sections/:sectionId
// ============================================

export const getSectionByIdApi = async (
  sectionId: string
): Promise<SectionData> => {
  const response =
    await api.get<SectionResponse>(
      `/academic/sections/${sectionId}`
    );

  return response.data.data.section;
};


// ============================================
// UPDATE SECTION
// PUT /academic/sections/:sectionId
// ============================================

export const updateSectionApi = async (
  sectionId: string,
  data: UpdateSectionPayload
): Promise<SectionData> => {
  const response =
    await api.put<SectionResponse>(
      `/academic/sections/${sectionId}`,
      data
    );

  return response.data.data.section;
};


// ============================================
// UPDATE SECTION STATUS
// PATCH /academic/sections/:sectionId/status
// ============================================

export const updateSectionStatusApi =
  async (
    sectionId: string,
    isActive: boolean
  ): Promise<SectionData> => {
    const response =
      await api.patch<SectionResponse>(
        `/academic/sections/${sectionId}/status`,
        {
          isActive,
        }
      );

    return response.data.data.section;
  };