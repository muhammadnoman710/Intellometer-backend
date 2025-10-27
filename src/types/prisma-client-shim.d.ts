// Minimal Prisma Client type shim used only for TypeScript type checking.
// Runtime will still use node_modules/@prisma/client. This avoids parsing
// node_modules .d.ts if it contains incompatible declarations.

declare module "@prisma/client" {
  export namespace $Enums {
    export type AuthProvider = "EMAIL" | "GOOGLE";
  }

  export type AuthProvider = $Enums.AuthProvider;
  export const AuthProvider: { EMAIL: "EMAIL"; GOOGLE: "GOOGLE" };

  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    // Model delegates typed loosely to keep compilation simple
    user: any;
    project: any;
    zone: any;
    diffuser: any;
    diffuserMove: any;
    session: any;
    reading: any;
    refreshToken: any;
  }

  export type User = {
    id: number;
    email: string;
    provider: $Enums.AuthProvider;
    password?: string | null;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}