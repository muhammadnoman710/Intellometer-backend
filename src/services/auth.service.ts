import prisma from "../config/db";
import { hashPassword } from "../utils/hash";
import { AuthProvider } from "@prisma/client";

export async function registerUser(email: string, password: string) {
  // normalize email to lowercase
  const lowerEmail = email.toLowerCase();

  // check existing
  const existing = await prisma.user.findUnique({ where: { email: lowerEmail } });
  if (existing) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: lowerEmail,
      password: hashed,
      provider: AuthProvider.EMAIL,
      isVerified: false,
    },
    select: {
    id: true,
    email: true,
    isVerified: true,  // ✅ ensures TS knows it exists
  },
  });

  // Return just the user; OTP is handled at controller level in Redis
  return { user };
}
