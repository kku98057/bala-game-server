import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRole } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { DecodedToken } from "../types/express";

export const superAdminMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // GET 요청은 토큰이 없어도 통과 (공개 게시물 조회용)
    if (req.method === "GET") {
      if (!token) {
        req.user = null;
        return next();
      }

      const decoded = verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;
      req.user = decoded;
      return next();
    }

    // GET 이외의 요청은 토큰 필수 및 SUPER_ADMIN 체크
    if (!token) {
      res.status(401).json({
        message: "인증이 필요합니다.",
      });
      return;
    }

    const decoded = verify(token, process.env.JWT_SECRET || "") as DecodedToken;
    req.user = decoded;

    if (req.user?.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({
        message: "접근 권한이 없습니다.",
      });
      return;
    }

    next();
  } catch (error) {
    req.user;
    next();
  }
};
