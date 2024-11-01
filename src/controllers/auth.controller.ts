import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
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
) => {
  try {
    const { email, password } = req.body;

    // 기본 유효성 검사
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      });
      return;
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        provider: true,
      },
    });

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    // 비밀번호 확인
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    // JWT 토큰 생성
    const token = sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // 비밀번호 제외하고 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "로그인에 성공했습니다.",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("로그인 컨트롤러 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
