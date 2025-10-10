import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { registerUser } from "../services/auth.service";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import prisma from "../config/prisma";
import { generateOtpDigits } from "../utils/otp"; // helper to generate 6-digit OTP
// import { sendVerificationEmail } from "../utils/email"; // optional if email sending is set up

export async function signupHandler(req: Request, res: Response) {
  // validation results from route validators
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const lowerEmail = email.toLowerCase();

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: lowerEmail } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // User exists but has not verified yet → resend OTP
        const newOtp = generateOtpDigits();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

        await prisma.user.update({
          where: { email: lowerEmail },
          data: {
            // otp: newOtp,
            // otpExpiresAt: otpExpiry,
            isVerified: false,
          },
        });

        console.log(`Resent OTP for ${lowerEmail}: ${newOtp} (valid for 5 minutes)`);

        // Optional: send verification email
        // await sendVerificationEmail(lowerEmail, newOtp);

        return res.status(200).json({
          message: "User already registered but not verified. OTP resent to email.",
          needsVerification: true,
          verificationRequired: true,
          user: { id: existingUser.id, email: existingUser.email, isVerified: false },
        });
      }

      // User exists and verified → stop signup
      return res.status(409).json({ message: "User already exists" });
    }

    // Register a new user
    const { user, otp } = await registerUser(lowerEmail, password);

    console.log(`OTP for ${lowerEmail}: ${otp} (valid for 5 minutes)`);

    return res.status(201).json({
      message: "User created. OTP sent to email (check server logs in dev).",
      needsVerification: true,
      verificationRequired: true,
      user: { id: user.id, email: user.email, isVerified: user.isVerified },
    });
  } catch (err: any) {
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
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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
