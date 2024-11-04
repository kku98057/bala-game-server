import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { GameType } from "@prisma/client";

// 댓글 생성
export const createComment = async (req: Request, res: Response) => {
  try {
    const { gameId, content, gameType } = req.body;
    const userId = req.user?.id; // 미들웨어에서 설정한 user 정보
    // gameType 검증 및 변환

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
    if (!["BALANCE", "TOURNAMENT"].includes(gameType)) {
      res.status(400).json({
        success: false,
        message: "잘못된 게임 타입입니다.",
      });
      return;
    }
    // 게임 존재 여부 확인
    const game =
      gameType === "BALANCE"
        ? await prisma.balanceGame.findUnique({ where: { id: Number(gameId) } })
        : await prisma.tournamentGame.findUnique({
            where: { id: Number(gameId) },
          });

    if (!game) {
      res.status(404).json({
        success: false,
        message: "게임을 찾을 수 없습니다.",
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
        userId,
        gameType: gameType as GameType,
        ...(gameType === "BALANCE"
          ? {
              balanceGameId: Number(gameId),
              tournamentGameId: null,
            }
          : {
              tournamentGameId: Number(gameId),
              balanceGameId: null,
            }),
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        ...(gameType === "BALANCE" ? { balanceGame: true } : { game: true }),
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
    const { gameId, gameType } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const whereCondition =
      gameType === "BALANCE"
        ? {
            balanceGameId: Number(gameId),
            gameType: GameType.BALANCE,
            isDeleted: false, // 추가: 삭제되지 않은 댓글만 조회
          }
        : {
            tournamentGameId: Number(gameId),
            gameType: GameType.TOURNAMENT,
            isDeleted: false, // 추가: 삭제되지 않은 댓글만 조회
          };
    // 게임 타입 검증 부분도 수정
    if (
      ![GameType.BALANCE, GameType.TOURNAMENT].includes(gameType as GameType)
    ) {
      res.status(400).json({
        success: false,
        message: "잘못된 게임 타입입니다.",
      });
      return;
    }
    const [totalComments, comments] = await Promise.all([
      prisma.comment.count({
        where: whereCondition,
      }),
      prisma.comment.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
          ...(gameType === GameType.BALANCE
            ? { balanceGame: true }
            : { game: true }), // 스키마에 정의된 대로 'game' 사용
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

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
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    // 댓글 존재 여부 및 작성자 확인
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
      return;
    }

    if (comment.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "댓글 삭제 권한이 없습니다.",
      });
      return;
    }

    // 소프트 삭제 실행
    await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "댓글이 삭제되었습니다.",
    });
    return;
  } catch (error) {
    console.error("댓글 삭제 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
    return;
  }
};
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

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

    // 댓글 길이 제한 (300자)
    if (content.length > 300) {
      res.status(400).json({
        success: false,
        message: "댓글은 300자를 초과할 수 없습니다.",
      });
      return;
    }

    // 댓글 존재 여부 및 작성자 확인
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
      return;
    }

    if (comment.userId !== userId) {
      res.status(403).json({
        success: false,
        message: "댓글 수정 권한이 없습니다.",
      });
      return;
    }

    // 이미 삭제된 댓글인지 확인
    if (comment.isDeleted) {
      res.status(400).json({
        success: false,
        message: "이미 삭제된 댓글입니다.",
      });
      return;
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "댓글이 수정되었습니다.",
      data: updatedComment,
    });
    return;
  } catch (error) {
    console.error("댓글 수정 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
    return;
  }
};
