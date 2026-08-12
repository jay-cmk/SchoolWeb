import { Request, Response } from "express";
import { createSchool,getSchools ,createSchoolAdmin} from "./school.service";

export const createSchoolController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      code,
      email,
      phone,
      address,
      logo,
    } = req.body;

    if (!name || !code) {
      res.status(400).json({
        success: false,
        message: "School name and school code are required",
      });

      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const school = await createSchool(
      {
        name,
        code,
        email,
        phone,
        address,
        logo,
      },
      req.user.userId
    );

    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: {
        school,
      },
    });
  } catch (error) {
    console.error("Create school error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create school",
    });
  }
};


export const getSchoolsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const schools = await getSchools();

    res.status(200).json({
      success: true,
      message: "Schools fetched successfully",
      data: {
        schools,
      },
    });
  } catch (error) {
    console.error("Get schools error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch schools",
    });
  }
};

export const createSchoolAdminController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { schoolId } = req.params;

    if (typeof schoolId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid school ID",
      });

      return;
    }

    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });

      return;
    }

    const admin = await createSchoolAdmin(
      schoolId,
      {
        name,
        email,
        mobile,
        password,
      }
    );

    res.status(201).json({
      success: true,
      message: "School admin created successfully",
      data: {
        admin,
      },
    });
  } catch (error) {
    console.error("Create school admin error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create school admin",
    });
  }
};