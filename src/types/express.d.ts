import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
interface DecodedToken {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
}
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken | null;
    }
  }
}
