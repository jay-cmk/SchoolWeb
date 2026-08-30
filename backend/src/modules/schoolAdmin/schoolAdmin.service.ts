import { School } from "../schools/school.model";


import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { User } from "../auth/user.model";
import { UserRole } from "../../constants/roles";
import { SchoolStatus } from "../../constants/school";


interface UpdateSchoolAdminData {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  isActive?: boolean;
}

export const getSchoolAdminDashboard = async (
  schoolId: string
) => {
  const school = await School.findById(schoolId).lean();

  if (!school) {
    throw new Error("School not found");
  }

  return {
    school: {
      id: school._id,
      name: school.name,
      code: school.code,
      email: school.email,
      phone: school.phone,
      logo: school.logo,
    },

    statistics: {
      students: 0,
      teachers: 0,
      classes: 0,
      parents: 0,
    },
  };
};

export const getSchoolAdmins = async (
  schoolId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(schoolId)) {
    throw new Error("Invalid school ID");
  }

  const school = await School.exists({
    _id: schoolId,
  });

  if (!school) {
    throw new Error("School not found");
  }

  const admins = await User.find({
    schoolId,
    role: UserRole.SCHOOL_ADMIN,
  })
    .select(
      "_id name email mobile role schoolId isActive lastLoginAt createdAt"
    )
    .lean();

  return admins;
};


export const updateSchoolAdmin = async (
  schoolId: string,
  adminId: string,
  data: UpdateSchoolAdminData
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      schoolId
    ) ||
    !mongoose.Types.ObjectId.isValid(
      adminId
    )
  ) {
    throw new Error("Invalid ID");
  }

  const admin = await User.findOne({
    _id: adminId,
    schoolId,
    role: UserRole.SCHOOL_ADMIN,
  });

  if (!admin) {
    throw new Error(
      "School admin not found"
    );
  }

  if (
    data.email !== undefined &&
    data.email.toLowerCase().trim() !==
      admin.email
  ) {
    const existingUser = await User.findOne({
      email: data.email
        .toLowerCase()
        .trim(),

      _id: {
        $ne: admin._id,
      },
    });

    if (existingUser) {
      throw new Error(
        "User with this email already exists"
      );
    }

    admin.email = data.email
      .toLowerCase()
      .trim();
  }

  if (data.name !== undefined) {
    admin.name = data.name.trim();
  }

  if (data.mobile !== undefined) {
    admin.mobile = data.mobile.trim();
  }

  await admin.save();

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    mobile: admin.mobile,
    role: admin.role,
    schoolId: admin.schoolId,
    isActive: admin.isActive,
  };
};

export const updateSchoolAdminStatus = async (
  schoolId: string,
  adminId: string,
  isActive: boolean
) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      schoolId
    ) ||
    !mongoose.Types.ObjectId.isValid(
      adminId
    )
  ) {
    throw new Error("Invalid ID");
  }

  const admin =
    await User.findOneAndUpdate(
      {
        _id: adminId,
        schoolId,
        role: UserRole.SCHOOL_ADMIN,
      },
      {
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!admin) {
    throw new Error(
      "School admin not found"
    );
  }

  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    schoolId: admin.schoolId,
    isActive: admin.isActive,
  };
};