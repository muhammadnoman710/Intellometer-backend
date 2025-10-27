import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Middleware to protect routes that require authentication
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Extract Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    // 4️⃣ Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, provider: true },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found or token invalid" });
    }

    // 5️⃣ Attach user to request (matches your express.d.ts definition)
    req.user = user;

    // 6️⃣ Continue
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
