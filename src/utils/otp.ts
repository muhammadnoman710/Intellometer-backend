import crypto from "crypto";
import redis from "../config/redis";
import dotenv from "dotenv";
dotenv.config();

const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || "300", 10); // seconds

export function generateOtpDigits(digits = 6): string {
  // crypto-based 6-digit OTP
  const num = crypto.randomInt(0, Math.pow(10, digits));
  return num.toString().padStart(digits, "0");
}

export async function storeOtpForEmail(email: string, otp: string): Promise<void> {
  const key = `otp:${email.toLowerCase()}`;
  // store OTP hashed? for now store plaintext (Redis is ephemeral). If you want, hash before storing.
  await redis.set(key, otp, "EX", OTP_TTL);
}

export async function getOtpForEmail(email: string): Promise<string | null> {
  const key = `otp:${email.toLowerCase()}`;
  return redis.get(key);
}

export async function deleteOtpForEmail(email: string): Promise<void> {
  const key = `otp:${email.toLowerCase()}`;
  await redis.del(key);
}
