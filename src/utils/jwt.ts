import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "supersecret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

// Access token (short-lived)
export const signAccessToken = (userId: string) => {
  console.log("ACCESS_SECRET USED FOR SIGNING:", process.env.JWT_ACCESS_SECRET || "supersecret");
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "7d" });
};

// Refresh token (long-lived)
export const signRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

// Verify tokens
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
