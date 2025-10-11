import { Request, Response } from "express";
import prisma from "../config/prisma";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { getOtpForEmail, deleteOtpForEmail } from "../utils/otp";

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Normalize email to lowercase for consistent lookup and Redis keying
    const lowerEmail = String(email).toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: lowerEmail } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Get stored OTP from Redis
    const storedOtp = await getOtpForEmail(lowerEmail);

    // 🔍 Log both stored and incoming OTPs for debugging
    console.log("verifyOtp check:", {
      email: lowerEmail,
      incomingOtp: otp,
      storedOtp,
    });

    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Clear OTP after successful verification
    await deleteOtpForEmail(lowerEmail);

    // ✅ Mark user as verified
    await prisma.user.update({
      where: { email: lowerEmail },
      data: { isVerified: true },
    });

    // ✅ Generate tokens for auto-login
    const accessToken = signAccessToken(user.id.toString());
    const refreshToken = signRefreshToken(user.id.toString());

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      verified: true,
      needsVerification: false,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: lowerEmail,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
