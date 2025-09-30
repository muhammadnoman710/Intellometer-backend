import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { registerUser } from "../services/auth.service";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import prisma from "../config/prisma";

export async function signupHandler(req: Request, res: Response) {
  // validation results from route validators
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { user, otp } = await registerUser(email.toLowerCase(), password);

    // For now we log the OTP (replace with email/SMS send in production)
    console.log(`OTP for ${email}: ${otp}  (valid for 5 minutes)`);

    return res.status(201).json({
      message: "User created. OTP sent to email (check server logs in dev).",
      user: { id: user.id, email: user.email, isVerified: user.isVerified },
    });
  } catch (err: any) {
    if (err.message === "USER_ALREADY_EXISTS") {
      return res.status(409).json({ message: "User already exists" });
    }
    console.error("signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function googleCallbackHandler(req: Request, res: Response) {
  try {
    // User is available from passport authentication
    const user = req.user as { id: number; email: string; provider: string };

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate tokens
    const accessToken = signAccessToken(user.id.toString());
    const refreshToken = signRefreshToken(user.id.toString());

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("Google callback error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
