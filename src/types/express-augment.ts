declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      provider: "EMAIL" | "GOOGLE";
    }
  }
}

export {};