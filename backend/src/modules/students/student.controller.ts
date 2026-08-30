import { Request, Response } from "express";
import studentService from "./student.service";

export class StudentController {

  async create(
    req: Request,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const student =
        await studentService.createStudent(
          req.user.schoolId,
          req.user.userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }
  }


  async getAll(
    req: Request,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const result =
        await studentService.getStudents(
          req.user.schoolId,
          req.query
        );

      return res.status(200).json({
        success: true,
        data: result.students,
        pagination: result.pagination
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }
  }


  async getOne(
    req: Request,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const student =
        await studentService.getStudentById(
          req.user.schoolId,
          req.params.studentId
        );

      return res.status(200).json({
        success: true,
        data: student
      });

    } catch (error: any) {

      return res.status(404).json({
        success: false,
        message: error.message
      });

    }
  }
  async update(
    req: Request,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const student =
        await studentService.updateStudent(
          req.user.schoolId,
          req.user.userId,
          req.params.studentId,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: student
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }
  }


  async updateStatus(
    req: Request,
    res: Response
  ) {

    try {

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { status } = req.body;

      const student =
        await studentService.updateStatus(
          req.user.schoolId,
          req.user.userId,
          req.params.studentId,
          status
        );

      return res.status(200).json({
        success: true,
        message: "Student status updated",
        data: student
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }
  }
}

export default new StudentController();