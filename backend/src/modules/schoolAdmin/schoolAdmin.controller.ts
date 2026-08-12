import { Request, Response } from "express";

import {
  getSchoolAdminDashboard,
} from "./schoolAdmin.service";

export const getSchoolAdminDashboardController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const { schoolId } = req.user;

    if (!schoolId) {
      res.status(403).json({
        success: false,
        message: "School ID not found",
      });

      return;
    }

    const dashboard = await getSchoolAdminDashboard(
      schoolId
    );

    res.status(200).json({
      success: true,
      message: "School admin dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    console.error(
      "School admin dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard",
    });
  }
};