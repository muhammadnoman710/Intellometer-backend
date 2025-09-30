import prisma from "../config/db";
import { hashPassword } from "../utils/hash";
import { generateOtpDigits, storeOtpForEmail } from "../utils/otp";
import { AuthProvider } from "@prisma/client";

export async function registerUser(email: string, password: string) {
  // check existing
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      provider: AuthProvider.GOOGLE,
      isVerified: false,
    },
    select: {
    id: true,
    email: true,
    isVerified: true,  // ✅ ensures TS knows it exists
  },
  });

  // generate OTP and store in Redis
  const otp = generateOtpDigits(6);
  await storeOtpForEmail(email, otp);

  // TODO: send OTP via email or SMS here. For now we return it/log it to server.
  return { user, otp };
}
