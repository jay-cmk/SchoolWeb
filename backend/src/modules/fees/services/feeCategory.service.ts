import mongoose from "mongoose";

import {
  FeeCategory,
} from "../models/feeCategory.model";

import type {
  CreateFeeCategoryData,
  UpdateFeeCategoryData,
  FeeCategoryType
} from "../fee.types";

export const createFeeCategory =
  async (
    schoolId: string,
    userId: string,
    data: CreateFeeCategoryData
  ) => {

    if (
      !mongoose.Types.ObjectId.isValid(
        schoolId
      )
    ) {
      throw new Error(
        "Invalid school ID"
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid user ID"
      );
    }

    const name =
      data.name.trim();

    if (!name) {
      throw new Error(
        "Fee category name is required"
      );
    }

    const existingCategory =
      await FeeCategory.findOne({
        schoolId,
        name: {
          $regex: `^${name}$`,
          $options: "i",
        },
      });

    if (existingCategory) {
      throw new Error(
        "Fee category already exists"
      );
    }

const categoryData: {
  schoolId: string;
  name: string;
  type: FeeCategoryType;
  isActive: boolean;
  createdBy: string;
  description?: string;
} = {
  schoolId,
  name,
  type: data.type,
  isActive: data.isActive ?? true,
  createdBy: userId,
};

if (data.description !== undefined) {
  categoryData.description =
    data.description.trim();
}

const category =
  await FeeCategory.create(
    categoryData
  );

return category;
}


export const getFeeCategories =
  async (
    schoolId: string,
    filters?: {
      type?: string;
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

    if (filters?.type) {
      query.type =
        filters.type;
    }

    if (
      typeof filters?.isActive ===
      "boolean"
    ) {
      query.isActive =
        filters.isActive;
    }

    if (filters?.search) {
      query.$or = [
        {
          name: {
            $regex:
              filters.search,
            $options: "i",
          },
        },
        {
          description: {
            $regex:
              filters.search,
            $options: "i",
          },
        },
      ];
    }

    return FeeCategory.find(
      query
    )
      .sort({
        createdAt: -1,
      })
      .lean();
  };


export const getFeeCategoryById =
  async (
    schoolId: string,
    categoryId: string
  ) => {

    const category =
      await FeeCategory.findOne({
        _id: categoryId,
        schoolId,
      }).lean();

    if (!category) {
      throw new Error(
        "Fee category not found"
      );
    }

    return category;
  };


export const updateFeeCategory =
  async (
    schoolId: string,
    categoryId: string,
    data: UpdateFeeCategoryData
  ) => {

    const category =
      await FeeCategory.findOne({
        _id: categoryId,
        schoolId,
      });

    if (!category) {
      throw new Error(
        "Fee category not found"
      );
    }

    if (data.name) {

      const name =
        data.name.trim();

      const duplicate =
        await FeeCategory.findOne({
          _id: {
            $ne: categoryId,
          },

          schoolId,

          name: {
            $regex: `^${name}$`,
            $options: "i",
          },
        });

      if (duplicate) {
        throw new Error(
          "Fee category already exists"
        );
      }

      category.name =
        name;
    }

    if (
      data.description !==
      undefined
    ) {
      category.description =
        data.description.trim();
    }

    if (
      data.type !==
      undefined
    ) {
      category.type =
        data.type;
    }

    if (
      data.isActive !==
      undefined
    ) {
      category.isActive =
        data.isActive;
    }

    await category.save();

    return category;
  };


export const updateFeeCategoryStatus =
  async (
    schoolId: string,
    categoryId: string,
    isActive: boolean
  ) => {

    const category =
      await FeeCategory.findOneAndUpdate(
        {
          _id: categoryId,
          schoolId,
        },

        {
          isActive,
        },

        {
          new: true,
        }
      );

    if (!category) {
      throw new Error(
        "Fee category not found"
      );
    }

    return category;
  };