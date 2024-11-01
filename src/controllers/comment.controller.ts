import { Request, Response } from "express";
import prisma from "../lib/prisma";

// 댓글 생성
export const createComment = async (req: Request, res: Response) => {
  try {
    const { gameId, content } = req.body;
    const userId = req.user?.id; // 미들웨어에서 설정한 user 정보

    // userId가 없는 경우 처리
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    if (!content?.trim()) {
      res.status(400).json({
        success: false,
        message: "댓글 내용을 입력해주세요.",
      });
      return;
    }
    // 댓글 길이 제한 (예: 300자)
    if (content.length > 300) {
      res.status(400).json({
        success: false,
        message: "댓글은 300자를 초과할 수 없습니다.",
      });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        gameId: Number(gameId),
        userId,
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "댓글이 작성되었습니다.",
      data: comment,
    });
  } catch (error) {
    console.error("댓글 작성 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// 댓글 목록 조회
export const getComments = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const totalComments = await prisma.comment.count({
      where: {
        gameId: Number(gameId),
      },
    });
    const comments = await prisma.comment.findMany({
      where: {
        gameId: Number(gameId),
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    res.status(200).json({
      success: true,
      data: {
        comments,
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
      },
    });
  } catch (error) {
    console.error("댓글 조회 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
