import crypto from "crypto";
import redis from "../config/redis";
import dotenv from "dotenv";
dotenv.config();

const OTP_TTL = parseInt(process.env.OTP_TTL_SECONDS || "300", 10); // seconds
export const OTP_RESEND_COOLDOWN_SECONDS = parseInt(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || "60",
  10
); // seconds

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

// Cooldown helpers to prevent OTP resend spam
export async function getResendCooldownTtl(email: string): Promise<number> {
  const key = `otp:cooldown:${email.toLowerCase()}`;
  const ttl = await redis.ttl(key);
  return ttl > 0 ? ttl : 0;
}

export async function isResendOnCooldown(
  email: string
): Promise<{ active: boolean; ttl: number }> {
  const ttl = await getResendCooldownTtl(email);
  return { active: ttl > 0, ttl };
}

export async function setResendCooldown(email: string): Promise<void> {
  const key = `otp:cooldown:${email.toLowerCase()}`;
  await redis.set(key, "1", "EX", OTP_RESEND_COOLDOWN_SECONDS);
}
