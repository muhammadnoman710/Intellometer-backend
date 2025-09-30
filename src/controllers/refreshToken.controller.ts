import { Request, Response } from "express";
import prisma from "../config/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken: incomingToken } = req.body;

    if (!incomingToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: incomingToken },
      include: { user: true },
    });

    if (!storedToken || !storedToken.user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: String(storedToken.user.id),
    });
    const newRefreshToken = generateRefreshToken();

    // Rotate: replace old refresh token
    await prisma.refreshToken.update({
      where: { token: incomingToken },
      data: { token: newRefreshToken },
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("refresh token error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
