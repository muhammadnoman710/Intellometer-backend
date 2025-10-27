import { Request, Response } from "express";
import * as expressValidator from "express-validator";
import { registerUser } from "../services/auth.service";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import prisma from "../config/prisma";
import {
  generateOtpDigits,
  storeOtpForEmail,
  isResendOnCooldown,
  setResendCooldown,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "../utils/otp"; // helper to generate & store 6-digit OTP and cooldown
// import { sendVerificationEmail } from "../utils/email"; // optional if email sending is set up

export async function signupHandler(req: Request, res: Response) {
  // validation results from route validators
  const errors = expressValidator.validationResult(req);
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
        // Check cooldown before resending
        const { active, ttl } = await isResendOnCooldown(lowerEmail);
        if (active) {
          return res.status(429).json({
            message: "Please wait before resending OTP.",
            retryAfter: ttl,
          });
        }
        // User exists but has not verified yet → resend OTP
        const newOtp = generateOtpDigits(6);

        // ensure isVerified remains false (no DB-stored OTP)
        await prisma.user.update({
          where: { email: lowerEmail },
          data: { isVerified: false },
        });

        // store OTP in Redis with TTL and log for debugging
        await storeOtpForEmail(lowerEmail, newOtp);
        await setResendCooldown(lowerEmail);
        console.log(`Resent OTP for ${lowerEmail}: ${newOtp} (valid for 5 minutes)`);

        // Optional: send verification email
        // await sendVerificationEmail(lowerEmail, newOtp);

        return res.status(200).json({
          message: "OTP sent successfully",
          email: lowerEmail,
          cooldown: OTP_RESEND_COOLDOWN_SECONDS,
        });
      }

      // User exists and verified → stop signup
      return res.status(409).json({ message: "User already exists" });
    }

    // Register a new user (no OTP stored in DB)
    const { user } = await registerUser(lowerEmail, password);

    // Generate and store OTP in Redis, do not return OTP in body
    const otp = generateOtpDigits(6);
    await storeOtpForEmail(lowerEmail, otp);
    await setResendCooldown(lowerEmail);
    console.log(`OTP for ${lowerEmail}: ${otp} (valid for 5 minutes)`);

    return res.status(201).json({
      message: "OTP sent successfully",
      email: lowerEmail,
      cooldown: OTP_RESEND_COOLDOWN_SECONDS,
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
