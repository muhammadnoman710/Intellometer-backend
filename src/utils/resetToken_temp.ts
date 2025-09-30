import jwt from "jsonwebtoken";

const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || "secret_key";
const RESET_TOKEN_EXPIRES_IN = "15m"; // 15 minutes expiry

export const generateResetToken = (userId: number) => {
  return jwt.sign({ userId }, RESET_PASSWORD_SECRET, { expiresIn: RESET_TOKEN_EXPIRES_IN });
};

export const verifyResetToken = (token: string): { userId: number } => {
  return jwt.verify(token, RESET_PASSWORD_SECRET) as { userId: number };
};
