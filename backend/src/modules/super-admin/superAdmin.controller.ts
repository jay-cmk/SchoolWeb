import { Request, Response } from "express";

export const getDashboard = (
  req: Request,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    message: "Super Admin dashboard accessed successfully",
    data: {
      userId: req.user?.userId,
      role: req.user?.role,
    },
  });
};