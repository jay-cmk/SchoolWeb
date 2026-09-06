import mongoose from "mongoose";

import {
  FeeStructure,
} from "../models/feeStructure.model";

import {
  FeeCategory,
} from "../models/feeCategory.model";

import {
  AcademicSession,
} from "../../academic/academicSession.model";

import type {
  CreateFeeStructureData,
  UpdateFeeStructureData,
} from "../fee.types";


// ============================================
// CREATE FEE STRUCTURE
// ============================================

export const createFeeStructure =
  async (
    schoolId: string,
    userId: string,
    data: CreateFeeStructureData
  ) => {

    // ------------------------------------------
    // SCHOOL ID
    // ------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }


    // ------------------------------------------
    // USER ID
    // ------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid user ID"
      );
    }


    // ------------------------------------------
    // SESSION ID
    // ------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        data.sessionId
      )
    ) {
      throw new Error(
        "Invalid academic session ID"
      );
    }


    // ------------------------------------------
    // CATEGORY ID
    // ------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        data.feeCategoryId
      )
    ) {
      throw new Error(
        "Invalid fee category ID"
      );
    }


    // ------------------------------------------
    // NAME
    // ------------------------------------------

    const name =
      data.name.trim();

    if (!name) {
      throw new Error(
        "Fee structure name is required"
      );
    }


    // ------------------------------------------
    // AMOUNT
    // ------------------------------------------

    if (
      typeof data.amount !==
        "number" ||
      !Number.isFinite(
        data.amount
      ) ||
      data.amount < 0
    ) {
      throw new Error(
        "Fee amount must be a valid non-negative number"
      );
    }


    // ------------------------------------------
    // DUE DAY
    // ------------------------------------------

    if (
      data.dueDay !== undefined &&
      (
        !Number.isInteger(
          data.dueDay
        ) ||
        data.dueDay < 1 ||
        data.dueDay > 31
      )
    ) {
      throw new Error(
        "Due day must be between 1 and 31"
      );
    }


    // ------------------------------------------
    // CHECK SESSION
    // Tenant isolation is important here.
    // ------------------------------------------

    const session =
      await AcademicSession.findOne({
        _id:
          data.sessionId,

        schoolId,
      }).lean();


    if (!session) {
      throw new Error(
        "Academic session not found"
      );
    }


    // ------------------------------------------
    // CHECK CATEGORY
    // ------------------------------------------

    const category =
      await FeeCategory.findOne({
        _id:
          data.feeCategoryId,

        schoolId,

        isActive:
          true,
      }).lean();


    if (!category) {
      throw new Error(
        "Fee category not found or inactive"
      );
    }


    // ------------------------------------------
    // DUPLICATE CHECK
    // ------------------------------------------

    const existingStructure =
      await FeeStructure.findOne({
        schoolId,

        sessionId:
          data.sessionId,

        feeCategoryId:
          data.feeCategoryId,

        name: {
          $regex:
            `^${escapeRegex(name)}$`,

          $options:
            "i",
        },
      }).lean();


    if (existingStructure) {
      throw new Error(
        "Fee structure already exists"
      );
    }


    // ------------------------------------------
    // exactOptionalPropertyTypes SAFE OBJECT
    // ------------------------------------------

    const structureData: {
      schoolId: string;
      sessionId: string;
      feeCategoryId: string;
      name: string;
      amount: number;
      frequency: CreateFeeStructureData["frequency"];
      isActive: boolean;
      createdBy: string;
      description?: string;
      dueDay?: number;
    } = {
      schoolId,

      sessionId:
        data.sessionId,

      feeCategoryId:
        data.feeCategoryId,

      name,

      amount:
        data.amount,

      frequency:
        data.frequency,

      isActive:
        data.isActive ?? true,

      createdBy:
        userId,
    };


    if (
      data.description !==
      undefined
    ) {
      structureData.description =
        data.description.trim();
    }


    if (
      data.dueDay !==
      undefined
    ) {
      structureData.dueDay =
        data.dueDay;
    }


    const structure =
      await FeeStructure.create(
        structureData
      );


    return structure;
  };


// ============================================
// GET FEE STRUCTURES
// ============================================

export const getFeeStructures =
  async (
    schoolId: string,
    filters?: {
      sessionId?: string;
      feeCategoryId?: string;
      isActive?: boolean;
      search?: string;
    }
  ) => {

    const query: Record<
      string,
      unknown
    > = {
      schoolId,
    };


    if (
      filters?.sessionId
    ) {
      query.sessionId =
        filters.sessionId;
    }


    if (
      filters?.feeCategoryId
    ) {
      query.feeCategoryId =
        filters.feeCategoryId;
    }


    if (
      typeof filters?.isActive ===
      "boolean"
    ) {
      query.isActive =
        filters.isActive;
    }


    if (
      filters?.search
    ) {
      query.$or = [
        {
          name: {
            $regex:
              filters.search,

            $options:
              "i",
          },
        },

        {
          description: {
            $regex:
              filters.search,

            $options:
              "i",
          },
        },
      ];
    }


    return FeeStructure.find(
      query
    )
      .populate(
        "sessionId",
        "name startDate endDate isCurrent"
      )
      .populate(
        "feeCategoryId",
        "name type"
      )
      .sort({
        createdAt:
          -1,
      })
      .lean();
  };


// ============================================
// GET FEE STRUCTURE BY ID
// ============================================

export const getFeeStructureById =
  async (
    schoolId: string,
    structureId: string
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        structureId
      )
    ) {
      throw new Error(
        "Invalid fee structure ID"
      );
    }


    const structure =
      await FeeStructure.findOne({
        _id:
          structureId,

        schoolId,
      })
        .populate(
          "sessionId",
          "name startDate endDate isCurrent"
        )
        .populate(
          "feeCategoryId",
          "name type"
        )
        .lean();


    if (!structure) {
      throw new Error(
        "Fee structure not found"
      );
    }


    return structure;
  };


// ============================================
// UPDATE FEE STRUCTURE
// ============================================

export const updateFeeStructure =
  async (
    schoolId: string,
    structureId: string,
    data: UpdateFeeStructureData
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        structureId
      )
    ) {
      throw new Error(
        "Invalid fee structure ID"
      );
    }


    const structure =
      await FeeStructure.findOne({
        _id:
          structureId,

        schoolId,
      });


    if (!structure) {
      throw new Error(
        "Fee structure not found"
      );
    }


    // ------------------------------------------
    // SESSION
    // ------------------------------------------

    if (
      data.sessionId !==
      undefined
    ) {

      if (
        !mongoose.Types.ObjectId.isValid(
          data.sessionId
        )
      ) {
        throw new Error(
          "Invalid academic session ID"
        );
      }


      const session =
        await AcademicSession.findOne({
          _id:
            data.sessionId,

          schoolId,
        }).lean();


      if (!session) {
        throw new Error(
          "Academic session not found"
        );
      }


      structure.sessionId =
        new mongoose.Types.ObjectId(
          data.sessionId
        );
    }


    // ------------------------------------------
    // CATEGORY
    // ------------------------------------------

    if (
      data.feeCategoryId !==
      undefined
    ) {

      if (
        !mongoose.Types.ObjectId.isValid(
          data.feeCategoryId
        )
      ) {
        throw new Error(
          "Invalid fee category ID"
        );
      }


      const category =
        await FeeCategory.findOne({
          _id:
            data.feeCategoryId,

          schoolId,

          isActive:
            true,
        }).lean();


      if (!category) {
        throw new Error(
          "Fee category not found or inactive"
        );
      }


      structure.feeCategoryId =
        new mongoose.Types.ObjectId(
          data.feeCategoryId
        );
    }


    // ------------------------------------------
    // NAME
    // ------------------------------------------

    if (
      data.name !==
      undefined
    ) {

      const name =
        data.name.trim();


      if (!name) {
        throw new Error(
          "Fee structure name is required"
        );
      }


      structure.name =
        name;
    }


    // ------------------------------------------
    // AMOUNT
    // ------------------------------------------

    if (
      data.amount !==
      undefined
    ) {

      if (
        !Number.isFinite(
          data.amount
        ) ||
        data.amount < 0
      ) {
        throw new Error(
          "Fee amount must be a valid non-negative number"
        );
      }


      structure.amount =
        data.amount;
    }


    // ------------------------------------------
    // FREQUENCY
    // ------------------------------------------

    if (
      data.frequency !==
      undefined
    ) {
      structure.frequency =
        data.frequency;
    }


    // ------------------------------------------
    // DESCRIPTION
    // ------------------------------------------

    if (
      data.description !==
      undefined
    ) {
      structure.description =
        data.description.trim();
    }


    // ------------------------------------------
    // DUE DAY
    // ------------------------------------------

    if (
      data.dueDay !==
      undefined
    ) {

      if (
        !Number.isInteger(
          data.dueDay
        ) ||
        data.dueDay < 1 ||
        data.dueDay > 31
      ) {
        throw new Error(
          "Due day must be between 1 and 31"
        );
      }


      structure.dueDay =
        data.dueDay;
    }


    // ------------------------------------------
    // STATUS
    // ------------------------------------------

    if (
      data.isActive !==
      undefined
    ) {
      structure.isActive =
        data.isActive;
    }


    // ------------------------------------------
    // DUPLICATE CHECK
    // After applying possible changes.
    // ------------------------------------------

    const duplicate =
      await FeeStructure.findOne({
        _id: {
          $ne:
            structure._id,
        },

        schoolId,

        sessionId:
          structure.sessionId,

        feeCategoryId:
          structure.feeCategoryId,

        name: {
          $regex:
            `^${escapeRegex(
              structure.name
            )}$`,

          $options:
            "i",
        },
      }).lean();


    if (duplicate) {
      throw new Error(
        "Fee structure already exists"
      );
    }


    await structure.save();


    return structure;
  };


// ============================================
// UPDATE STATUS
// ============================================

export const updateFeeStructureStatus =
  async (
    schoolId: string,
    structureId: string,
    isActive: boolean
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        structureId
      )
    ) {
      throw new Error(
        "Invalid fee structure ID"
      );
    }


    const structure =
      await FeeStructure.findOneAndUpdate(
        {
          _id:
            structureId,

          schoolId,
        },

        {
          isActive,
        },

        {
          new:
            true,
        }
      );


    if (!structure) {
      throw new Error(
        "Fee structure not found"
      );
    }


    return structure;
  };


// ============================================
// REGEX HELPER
// ============================================

const escapeRegex =
  (
    value: string
  ): string => {

    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
  };