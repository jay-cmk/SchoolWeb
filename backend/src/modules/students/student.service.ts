import { Types } from "mongoose";
import Student from "./student.model";
import { ICreateStudentRequest, IUpdateStudentRequest } from "./student.types";

export class StudentService {
  async createStudent(
    schoolId: Types.ObjectId,
    userId: Types.ObjectId,
    data: ICreateStudentRequest,
  ) {
    const existingStudent = await Student.findOne({
      schoolId,
      sessionId: data.sessionId,
      admissionNumber: data.admissionNumber.toUpperCase(),
    });

    if (existingStudent) {
      throw new Error("Admission number already exists");
    }

    const student = await Student.create({
      ...data,

      admissionNumber: data.admissionNumber.toUpperCase(),

      schoolId,

      createdBy: userId,
    });

    return student;
  }

  async getStudents(
    schoolId: Types.ObjectId,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      sessionId?: string;
      classId?: string;
      sectionId?: string;
      status?: string;
    },
  ) {
    const page = Number(query.page) || 1;

    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter: any = {
      schoolId,
    };

    if (query.sessionId) {
      filter.sessionId = new Types.ObjectId(query.sessionId);
    }

    if (query.classId) {
      filter.classId = new Types.ObjectId(query.classId);
    }

    if (query.sectionId) {
      filter.sectionId = new Types.ObjectId(query.sectionId);
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        {
          name: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          admissionNumber: {
            $regex: query.search,
            $options: "i",
          },
        },
      ];
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("sessionId")
        .populate("classId")
        .populate("sectionId")
        .populate("parentId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Student.countDocuments(filter),
    ]);

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStudentById(schoolId: Types.ObjectId, studentId: string) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new Error("Invalid student ID");
    }

    const student = await Student.findOne({
      _id: studentId,
      schoolId,
    })
      .populate("sessionId")
      .populate("classId")
      .populate("sectionId")
      .populate("parentId");

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  async updateStudent(
    schoolId: Types.ObjectId,
    userId: Types.ObjectId,
    studentId: string,
    data: IUpdateStudentRequest,
  ) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new Error("Invalid student ID");
    }

    const student = await Student.findOneAndUpdate(
      {
        _id: studentId,
        schoolId,
      },

      {
        ...data,
        updatedBy: userId,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  async updateStatus(
    schoolId: Types.ObjectId,
    userId: Types.ObjectId,
    studentId: string,
    status: string,
  ) {
    const student = await Student.findOneAndUpdate(
      {
        _id: studentId,
        schoolId,
      },

      {
        status,
        updatedBy: userId,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }
}

export default new StudentService();
