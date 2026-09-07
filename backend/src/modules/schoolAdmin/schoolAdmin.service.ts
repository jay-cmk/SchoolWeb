



import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { School } from "../schools/school.model";
import { User } from "../auth/user.model";
import { Teacher } from "../teachers/teacher.model";
import { Student } from "../students/student.model";

import { StudentEnrollment } from "../students/studentEnrollment.model";

import { ClassModel } from "../academic/classes/class.model";

import { AcademicSession } from "../academic/academicSession.model";

import { Attendance } from "../attendance/attendance.model";

import { AttendanceStatus } from "../attendance/attendance.types";

import { Homework } from "../homework/homework.model";

import { HomeworkStatus } from "../homework/homework.types";

import { UserRole } from "../../constants/roles";

// ============================================
// TYPES
// ============================================

interface UpdateSchoolAdminData {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  isActive?: boolean;
}

interface DashboardStudentStatistics {
  male: number;
  female: number;
  classWise: Array<{
    classId: string;
    className: string;
    totalStudents: number;
  }>;
}

// ============================================
// SCHOOL ADMIN DASHBOARD
// ============================================

export const getSchoolAdminDashboard = async (
  schoolId: string,
  userId: string,
  sessionId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(schoolId)) {
    throw new Error("Invalid school ID");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid academic session ID");
  }

  const schoolObjectId = new mongoose.Types.ObjectId(schoolId);

  // ============================================
  // SCHOOL
  // ============================================

  const school = await School.findById(schoolObjectId)
    .select("_id name code email phone logo status")
    .lean();

  if (!school) {
    throw new Error("School not found");
  }

  // ============================================
  // LOGGED IN SCHOOL ADMIN
  // ============================================

  const admin = await User.findOne({
    _id: userId,

    schoolId: schoolObjectId,

    role: UserRole.SCHOOL_ADMIN,

    isActive: true,
  })
    .select("_id name email mobile")
    .lean();

  if (!admin) {
    throw new Error("School admin not found");
  }

  // ============================================
  // SELECTED ACADEMIC SESSION
  // ============================================

  const selectedSession = await AcademicSession.findOne({
    _id: new mongoose.Types.ObjectId(sessionId),

    schoolId: schoolObjectId,
  })
    .select("_id name startDate endDate isCurrent")
    .lean();

  if (!selectedSession) {
    throw new Error("Academic session not found for this school");
  }

  // ============================================
  // TODAY DATE RANGE
  // ============================================

  const startOfDay = new Date();

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();

  endOfDay.setHours(23, 59, 59, 999);

  // ============================================
  // BASE FILTERS
  // ============================================

  const classFilter: {
    schoolId: mongoose.Types.ObjectId;

    sessionId?: mongoose.Types.ObjectId;

    isActive: boolean;
  } = {
    schoolId: schoolObjectId,

    isActive: true,
  };

  classFilter.sessionId = selectedSession._id;

  const attendanceFilter: {
    schoolId: mongoose.Types.ObjectId;

    sessionId?: mongoose.Types.ObjectId;

    date: {
      $gte: Date;
      $lte: Date;
    };
  } = {
    schoolId: schoolObjectId,

    date: {
      $gte: startOfDay,

      $lte: endOfDay,
    },
  };

  attendanceFilter.sessionId = selectedSession._id;

  const homeworkFilter: {
    schoolId: mongoose.Types.ObjectId;

    sessionId?: mongoose.Types.ObjectId;

    status: HomeworkStatus;

    isActive: boolean;

    dueDate: {
      $gte: Date;
    };
  } = {
    schoolId: schoolObjectId,

    status: HomeworkStatus.PUBLISHED,

    isActive: true,

    dueDate: {
      $gte: startOfDay,
    },
  };

  homeworkFilter.sessionId = selectedSession._id;

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================

  const [
    totalStudents,
    studentStatisticsResult,
    totalTeachers,
    totalClasses,

    presentCount,
    absentCount,
    leaveCount,
    halfDayCount,

    pendingHomework,
  ] = await Promise.all([
    // ACTIVE STUDENT ENROLLMENTS
    StudentEnrollment.countDocuments({
      schoolId: schoolObjectId,

      sessionId: selectedSession._id,

      enrollmentStatus: "ACTIVE",
    }),

    // GENDER AND CLASS-WISE STUDENT COUNTS
    StudentEnrollment.aggregate<DashboardStudentStatistics>([
      {
        $match: {
          schoolId: schoolObjectId,

          sessionId: selectedSession._id,

          enrollmentStatus: "ACTIVE",
        },
      },
      {
        $lookup: {
          from: Student.collection.name,

          localField: "studentId",

          foreignField: "_id",

          as: "student",
        },
      },
      {
        $unwind: {
          path: "$student",

          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: ClassModel.collection.name,

          localField: "classId",

          foreignField: "_id",

          as: "classDetails",
        },
      },
      {
        $unwind: {
          path: "$classDetails",

          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$classId",

          className: {
            $first: {
              $ifNull: ["$classDetails.name", "Unnamed Class"],
            },
          },

          totalStudents: {
            $sum: 1,
          },

          male: {
            $sum: {
              $cond: [
                {
                  $eq: ["$student.gender", "MALE"],
                },
                1,
                0,
              ],
            },
          },

          female: {
            $sum: {
              $cond: [
                {
                  $eq: ["$student.gender", "FEMALE"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          className: 1,
        },
      },
      {
        $group: {
          _id: null,

          male: {
            $sum: "$male",
          },

          female: {
            $sum: "$female",
          },

          classWise: {
            $push: {
              classId: {
                $toString: "$_id",
              },

              className: "$className",

              totalStudents: "$totalStudents",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,

          male: 1,

          female: 1,

          classWise: 1,
        },
      },
    ]),

    // ACTIVE TEACHERS
    Teacher.countDocuments({
      schoolId: schoolObjectId,

      isActive: true,
    }),

    // ACTIVE CLASSES
    ClassModel.countDocuments(classFilter),

    // PRESENT
    Attendance.countDocuments({
      ...attendanceFilter,

      status: AttendanceStatus.PRESENT,
    }),

    // ABSENT
    Attendance.countDocuments({
      ...attendanceFilter,

      status: AttendanceStatus.ABSENT,
    }),

    // LEAVE
    Attendance.countDocuments({
      ...attendanceFilter,

      status: AttendanceStatus.LEAVE,
    }),

    // HALF DAY
    Attendance.countDocuments({
      ...attendanceFilter,

      status: AttendanceStatus.HALF_DAY,
    }),

    // PENDING / ACTIVE HOMEWORK
    Homework.countDocuments(homeworkFilter),
  ]);

  // ============================================
  // ATTENDANCE CALCULATIONS
  // ============================================

  const totalAttendanceMarked =
    presentCount + absentCount + leaveCount + halfDayCount;

  const attendancePercentage =
    totalAttendanceMarked > 0
      ? Number(
          ((presentCount + halfDayCount * 0.5) / totalAttendanceMarked) * 100,
        ).toFixed(1)
      : 0;

  const studentStatistics = studentStatisticsResult[0] ?? {
    male: 0,

    female: 0,

    classWise: [],
  };

  // ============================================
  // RESPONSE
  // ============================================

  return {
    school: {
      id: school._id,

      name: school.name,

      code: school.code,

      email: school.email,

      phone: school.phone,

      logo: school.logo,

      status: school.status,
    },

    admin: {
      id: admin._id,

      name: admin.name,

      email: admin.email,

      mobile: admin.mobile,
    },

    currentSession: {
      id: selectedSession._id,

      name: selectedSession.name,

      startDate: selectedSession.startDate,

      endDate: selectedSession.endDate,
    },

    statistics: {
      totalStudents: totalStudents,

      totalTeachers,

      // Staff module pending
      totalStaff: 0,

      totalClasses,

      studentStatistics,

      attendance: {
        present: presentCount,

        absent: absentCount,

        leave: leaveCount,

        halfDay: halfDayCount,

        totalMarked: totalAttendanceMarked,

        percentage: attendancePercentage,
      },

      // Fees module pending
      pendingFees: 0,

      // Examination module pending
      upcomingExams: 0,

      pendingHomework,
    },
  };
};

// ============================================
// GET SCHOOL ADMINS
// ============================================

export const getSchoolAdmins = async (schoolId: string) => {
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
      "_id name email mobile role schoolId isActive lastLoginAt createdAt",
    )
    .lean();

  return admins;
};

// ============================================
// UPDATE SCHOOL ADMIN
// ============================================

export const updateSchoolAdmin = async (
  schoolId: string,
  adminId: string,
  data: UpdateSchoolAdminData,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(schoolId) ||
    !mongoose.Types.ObjectId.isValid(adminId)
  ) {
    throw new Error("Invalid ID");
  }

  const admin = await User.findOne({
    _id: adminId,

    schoolId,

    role: UserRole.SCHOOL_ADMIN,
  });

  if (!admin) {
    throw new Error("School admin not found");
  }

  if (
    data.email !== undefined &&
    data.email.toLowerCase().trim() !== admin.email
  ) {
    const existingUser = await User.findOne({
      email: data.email.toLowerCase().trim(),

      _id: {
        $ne: admin._id,
      },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    admin.email = data.email.toLowerCase().trim();
  }

  if (data.name !== undefined) {
    admin.name = data.name.trim();
  }

  if (data.mobile !== undefined) {
    admin.mobile = data.mobile.trim();
  }

  if (data.password !== undefined) {
    admin.password = await bcrypt.hash(data.password, 10);
  }

  if (data.isActive !== undefined) {
    admin.isActive = data.isActive;
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

// ============================================
// UPDATE SCHOOL ADMIN STATUS
// ============================================

export const updateSchoolAdminStatus = async (
  schoolId: string,
  adminId: string,
  isActive: boolean,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(schoolId) ||
    !mongoose.Types.ObjectId.isValid(adminId)
  ) {
    throw new Error("Invalid ID");
  }

  const admin = await User.findOneAndUpdate(
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
    },
  );

  if (!admin) {
    throw new Error("School admin not found");
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
