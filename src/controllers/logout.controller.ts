import { Request, Response } from "express";
import prisma from "../config/prisma";

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // 1. Check if refresh token provided
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }

    // 2. Delete the token from DB
    const result = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (result.count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Token not found or already invalidated" });
    }

    // 3. Clear cookie (if using cookies)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // 4. Success response
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
