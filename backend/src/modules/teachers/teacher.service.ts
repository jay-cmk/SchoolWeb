import mongoose from "mongoose";

import {
  Teacher,
} from "./teacher.model";

import type {
  CreateTeacherData,
  UpdateTeacherData,
  TeacherGender,
} from "./teacher.types";


// ============================================
// VALID GENDERS
// ============================================

const validGenders:
  TeacherGender[] = [
    "MALE",
    "FEMALE",
    "OTHER",
  ];


// ============================================
// CREATE TEACHER
// ============================================

export const createTeacher =
  async (
    schoolId: string,
    data: CreateTeacherData
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


    const employeeId =
      data.employeeId
        .trim()
        .toUpperCase();


    if (!employeeId) {
      throw new Error(
        "Employee ID is required"
      );
    }


    const name =
      data.name.trim();


    if (!name) {
      throw new Error(
        "Teacher name is required"
      );
    }


    const email =
      data.email
        .trim()
        .toLowerCase();


    if (!email) {
      throw new Error(
        "Teacher email is required"
      );
    }


    // ========================================
    // CHECK DUPLICATE EMPLOYEE ID
    // ========================================

    const employeeExists =
      await Teacher.findOne({
        schoolId,
        employeeId,
      });


    if (employeeExists) {
      throw new Error(
        "Teacher employee ID already exists"
      );
    }


    // ========================================
    // CHECK DUPLICATE EMAIL
    // ========================================

    const emailExists =
      await Teacher.findOne({
        schoolId,
        email,
      });


    if (emailExists) {
      throw new Error(
        "Teacher email already exists"
      );
    }


    // ========================================
    // GENDER
    // ========================================

    if (
      data.gender &&
      !validGenders.includes(
        data.gender
      )
    ) {
      throw new Error(
        "Invalid teacher gender"
      );
    }


    // ========================================
    // JOINING DATE
    // ========================================

    let joiningDate:
      | Date
      | undefined;


    if (data.joiningDate) {
      joiningDate =
        new Date(
          data.joiningDate
        );


      if (
        Number.isNaN(
          joiningDate.getTime()
        )
      ) {
        throw new Error(
          "Invalid joining date"
        );
      }
    }


    const teacher =
      await Teacher.create({
        schoolId,

        employeeId,

        name,

        email,

        ...(data.mobile
          ? {
              mobile:
                data.mobile.trim(),
            }
          : {}),

        ...(data.gender
          ? {
              gender:
                data.gender,
            }
          : {}),

        ...(data.qualification
          ? {
              qualification:
                data.qualification.trim(),
            }
          : {}),

        ...(joiningDate
          ? {
              joiningDate,
            }
          : {}),

        ...(data.profileImage
          ? {
              profileImage:
                data.profileImage.trim(),
            }
          : {}),

        isActive: true,
      });


    return teacher;
  };


// ============================================
// GET ALL TEACHERS
// ============================================

export const getTeachers =
  async (
    schoolId: string,
    isActive?: boolean,
    gender?: TeacherGender
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


    const query: {
      schoolId: string;

      isActive?: boolean;

      gender?: TeacherGender;
    } = {
      schoolId,
    };


    if (
      isActive !== undefined
    ) {
      query.isActive =
        isActive;
    }


    if (gender) {
      if (
        !validGenders.includes(
          gender
        )
      ) {
        throw new Error(
          "Invalid teacher gender"
        );
      }


      query.gender =
        gender;
    }


    return Teacher.find(
      query
    )
      .sort({
        name: 1,
      })
      .lean();
  };


// ============================================
// GET TEACHER BY ID
// ============================================

export const getTeacherById =
  async (
    schoolId: string,
    teacherId: string
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
        teacherId
      )
    ) {
      throw new Error(
        "Invalid teacher ID"
      );
    }


    const teacher =
      await Teacher.findOne({
        _id:
          teacherId,

        schoolId,
      }).lean();


    if (!teacher) {
      throw new Error(
        "Teacher not found"
      );
    }


    return teacher;
  };


// ============================================
// UPDATE TEACHER
// ============================================

export const updateTeacher =
  async (
    schoolId: string,
    teacherId: string,
    data: UpdateTeacherData
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
        teacherId
      )
    ) {
      throw new Error(
        "Invalid teacher ID"
      );
    }


    const teacher =
      await Teacher.findOne({
        _id:
          teacherId,

        schoolId,
      });


    if (!teacher) {
      throw new Error(
        "Teacher not found"
      );
    }


    // ========================================
    // EMPLOYEE ID
    // ========================================

    if (
      data.employeeId !==
      undefined
    ) {
      const employeeId =
        data.employeeId
          .trim()
          .toUpperCase();


      if (!employeeId) {
        throw new Error(
          "Employee ID cannot be empty"
        );
      }


      const duplicate =
        await Teacher.findOne({
          _id: {
            $ne:
              teacherId,
          },

          schoolId,

          employeeId,
        });


      if (duplicate) {
        throw new Error(
          "Teacher employee ID already exists"
        );
      }


      teacher.employeeId =
        employeeId;
    }


    // ========================================
    // NAME
    // ========================================

    if (
      data.name !==
      undefined
    ) {
      const name =
        data.name.trim();


      if (!name) {
        throw new Error(
          "Teacher name cannot be empty"
        );
      }


      teacher.name =
        name;
    }


    // ========================================
    // EMAIL
    // ========================================

    if (
      data.email !==
      undefined
    ) {
      const email =
        data.email
          .trim()
          .toLowerCase();


      if (!email) {
        throw new Error(
          "Teacher email cannot be empty"
        );
      }


      const duplicate =
        await Teacher.findOne({
          _id: {
            $ne:
              teacherId,
          },

          schoolId,

          email,
        });


      if (duplicate) {
        throw new Error(
          "Teacher email already exists"
        );
      }


      teacher.email =
        email;
    }


    // ========================================
    // MOBILE
    // ========================================

    if (
      data.mobile !==
      undefined
    ) {
      teacher.mobile =
        data.mobile.trim();
    }


    // ========================================
    // GENDER
    // ========================================

    if (
      data.gender !==
      undefined
    ) {
      if (
        !validGenders.includes(
          data.gender
        )
      ) {
        throw new Error(
          "Invalid teacher gender"
        );
      }


      teacher.gender =
        data.gender;
    }


    // ========================================
    // QUALIFICATION
    // ========================================

    if (
      data.qualification !==
      undefined
    ) {
      teacher.qualification =
        data.qualification.trim();
    }


    // ========================================
    // JOINING DATE
    // ========================================

    if (
      data.joiningDate !==
      undefined
    ) {
      const joiningDate =
        new Date(
          data.joiningDate
        );


      if (
        Number.isNaN(
          joiningDate.getTime()
        )
      ) {
        throw new Error(
          "Invalid joining date"
        );
      }


      teacher.joiningDate =
        joiningDate;
    }


    // ========================================
    // PROFILE IMAGE
    // ========================================

    if (
      data.profileImage !==
      undefined
    ) {
      teacher.profileImage =
        data.profileImage.trim();
    }


    await teacher.save();


    return teacher;
  };


// ============================================
// UPDATE TEACHER STATUS
// ============================================

export const updateTeacherStatus =
  async (
    schoolId: string,
    teacherId: string,
    isActive: boolean
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
        teacherId
      )
    ) {
      throw new Error(
        "Invalid teacher ID"
      );
    }


    if (
      typeof isActive !==
      "boolean"
    ) {
      throw new Error(
        "isActive must be boolean"
      );
    }


    const teacher =
      await Teacher.findOneAndUpdate(
        {
          _id:
            teacherId,

          schoolId,
        },

        {
          isActive,
        },

        {
          new: true,

          runValidators: true,
        }
      );


    if (!teacher) {
      throw new Error(
        "Teacher not found"
      );
    }


    return teacher;
  };