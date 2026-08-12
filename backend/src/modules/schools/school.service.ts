import { School } from "./school.model";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { User } from "../auth/user.model";
import { UserRole } from "../../constants/roles";

interface CreateSchoolData {
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  logo?: string;
}

interface CreateSchoolAdminData {
  name: string;
  email: string;
  mobile?: string;
  password: string;
}



export const createSchool = async (
  data: CreateSchoolData,
  createdBy: string
) => {
  const existingSchool = await School.findOne({
    code: data.code.toUpperCase().trim(),
  });

  if (existingSchool) {
    throw new Error("School code already exists");
  }

  const school = await School.create({
    ...data,
    code: data.code.toUpperCase().trim(),
    createdBy,
  });

  return school;

  
};


export const getSchools = async () => {
  return School.find()
    .sort({ createdAt: -1 })
    .lean();
};


export const createSchoolAdmin = async (
  schoolId: string,
  data: CreateSchoolAdminData
) => {
  // 1. Validate schoolId
  if (!mongoose.Types.ObjectId.isValid(schoolId)) {
    throw new Error("Invalid school ID");
  }

  // 2. Check school exists
  const school = await School.findById(schoolId);

  if (!school) {
    throw new Error("School not found");
  }

  // 3. Check email already exists
  const existingUser = await User.findOne({
    email: data.email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 5. Create School Admin
  const user = await User.create({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),

    ...(data.mobile
      ? { mobile: data.mobile.trim() }
      : {}),

    password: hashedPassword,
    role: UserRole.SCHOOL_ADMIN,
    schoolId: school._id,
    isActive: true,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    schoolId: user.schoolId,
  };
};


