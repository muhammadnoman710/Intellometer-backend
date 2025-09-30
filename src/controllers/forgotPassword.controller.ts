import { Request, Response } from "express";
import prisma from "../config/prisma";
import { generateResetToken } from "../utils/resetToken_temp";
import { sendResetEmail } from "../utils/email"; // ✅ correct util

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal whether the email exists
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // ✅ generate token for this user
    const token = generateResetToken(user.id);

    // ✅ call utils/email.ts to send email
    await sendResetEmail(email, token);

    return res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
