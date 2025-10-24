import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    // Ensure req.user resolves to a type with id and email
    interface User extends Pick<PrismaUser, "id" | "email"> {}

    // Make Request.user use the augmented Express.User
    interface Request {
      user?: User;
    }
  }
}
