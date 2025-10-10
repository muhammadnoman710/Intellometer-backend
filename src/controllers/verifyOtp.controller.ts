import { Request, Response } from "express";
import prisma from "../config/prisma";
import redis from "../config/redis";

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Get OTP from Redis
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    // Delete OTP after successful verification
    await redis.del(`otp:${email}`);

    return res.status(200).json({
      message: "Email verified successfully",
      verified: true,
      needsVerification: false,
    });
  } catch (error: any) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
