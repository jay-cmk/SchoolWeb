import { Request, Response } from "express";
import { createSchool,getSchools ,createSchoolAdmin,  getSchoolById,
  updateSchool,
  updateSchoolStatus,
  } from "./school.service";

  import { SchoolStatus } from "../../constants/school";
  

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


export const getSchoolByIdController = async (
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

    const school =
      await getSchoolById(schoolId);

    res.status(200).json({
      success: true,
      message:
        "School fetched successfully",
      data: {
        school,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch school",
    });
  }
};


export const updateSchoolController = async (
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

    const school = await updateSchool(
      schoolId,
      req.body
    );

    res.status(200).json({
      success: true,
      message:
        "School updated successfully",
      data: {
        school,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update school",
    });
  }
};


export const updateSchoolStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { schoolId } = req.params;

      const { status } = req.body;

      if (
        typeof schoolId !== "string"
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid school ID",
        });

        return;
      }

      if (
        !Object.values(
          SchoolStatus
        ).includes(
          status as SchoolStatus
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid school status",
        });

        return;
      }

      const school =
        await updateSchoolStatus(
          schoolId,
          status as SchoolStatus
        );

      res.status(200).json({
        success: true,
        message:
          "School status updated successfully",
        data: {
          school,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update school status",
      });
    }
  };

