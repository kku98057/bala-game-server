import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { hash } from "bcryptjs";
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, nickname } = req.body;

    // 기본 유효성 검사
    if (!email || !password || !nickname) {
      res.status(400).json({
        success: false,
        message: "모든 필드를 입력해주세요.",
      });
      return;
    }

    // 이메일 중복 체크
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      res.status(400).json({
        success: false,
        message: "이미 사용 중인 이메일입니다.",
      });
      return;
    }

    // 닉네임 중복 체크
    const existingUserByNickname = await prisma.user.findUnique({
      where: { nickname },
    });

    if (existingUserByNickname) {
      res.status(400).json({
        success: false,
        message: "이미 사용 중인 닉네임입니다.",
      });
      return;
    }

    // 비밀번호 해시화
    const hashedPassword = await hash(password, 12);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        provider: "EMAIL",
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        provider: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: user,
    });
  } catch (error) {
    console.error("회원가입 컨트롤러 에러:", error);

    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
