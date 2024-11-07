import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      nickname: string;
      role: UserRole;
    }
  }
}
