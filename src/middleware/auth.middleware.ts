import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    const decoded = verify(token, process.env.JWT_SECRET || "");
    req.user = decoded; // 디코딩된 사용자 정보를 요청 객체에 추가

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
    return;
  }
};
