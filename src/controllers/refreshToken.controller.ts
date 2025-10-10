import { Request, Response } from "express";
import prisma from "../config/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    
    // 🔍 Debugging line — this helps you confirm body is parsed
    console.log("Incoming refresh request body:", req.body);

    // ✅ Safe destructuring
    const incomingToken = req.body?.refreshToken;

    if (!incomingToken) {
      console.warn("⚠️ Refresh token missing in request body");
      return res.status(400).json({ message: "Refresh token required" });
    }

    // 🔐 Check if token exists in DB and belongs to a valid user
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: incomingToken },
      include: { user: true },
    });

    if (!storedToken || !storedToken.user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // 🧾 Verify token signature
    let payload: any;
    try {
      payload = verifyRefreshToken(incomingToken) as { userId?: string };
    } catch (e) {
      console.warn("Invalid or expired refresh token");
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const expectedUserId = String(storedToken.user.id);
    if (!payload?.userId || payload.userId !== expectedUserId) {
      return res.status(401).json({ message: "Refresh token does not match user" });
    }

    // ♻️ Rotate tokens
    const newAccessToken = signAccessToken(expectedUserId);
    const newRefreshToken = signRefreshToken(expectedUserId);

    await prisma.refreshToken.update({
      where: { token: incomingToken },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    console.log("✅ Refresh token rotated successfully for user:", expectedUserId);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("refresh token error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
