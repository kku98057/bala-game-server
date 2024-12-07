import { Request, Response } from "express";
import prisma from "../lib/prisma";

// 유저 프로필 조회
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // JWT 미들웨어에서 설정한 user 정보 사용
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        profileImageUrl: true,
        createdAt: true,
        role: true,
        pointHistory: {
          select: {
            amount: true,
          },
        },
        _count: {
          select: {
            balanceGames: {
              where: { status: "ACTIVE" },
            },
            tournamentGames: {
              where: { status: "ACTIVE" },
            },
            comments: {
              where: { isDeleted: false },
            },
          },
        },
      },
    });

    if (!userProfile) {
      res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
      return;
    }

    const totalPoints = userProfile.pointHistory.reduce(
      (sum, record) => sum + record.amount,
      0
    );

    const response = {
      success: true,
      payload: {
        id: userProfile.id,
        nickname: userProfile.nickname,
        email: userProfile.email,
        profileImageUrl: userProfile.profileImageUrl,
        createdAt: userProfile.createdAt,
        role: userProfile.role,
        stats: {
          totalPoints,
          totalGames:
            userProfile._count.balanceGames +
            userProfile._count.tournamentGames,
          totalComments: userProfile._count.comments,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("유저 프로필 조회 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};

// 유저가 만든 게임 목록 조회
export const getUserGames = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const gameType = req.query.type as "BALANCE" | "TOURNAMENT";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    if (gameType === "BALANCE") {
      const games = await prisma.balanceGame.findMany({
        where: {
          userId,
          status: "ACTIVE",
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          status: true,
          _count: {
            select: {
              questions: true,
              comments: {
                where: { isDeleted: false },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      const totalCount = await prisma.balanceGame.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      res.status(200).json({
        success: true,
        payload: {
          games,
          pagination: {
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
      });
    } else {
      const games = await prisma.tournamentGame.findMany({
        where: {
          userId,
          status: "ACTIVE",
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          status: true,
          participantCount: true,
          _count: {
            select: {
              items: true,
              comments: {
                where: { isDeleted: false },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      const totalCount = await prisma.tournamentGame.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      });

      res.status(200).json({
        success: true,
        payload: {
          games,
          pagination: {
            total: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
      });
    }
  } catch (error) {
    console.error("유저 게임 목록 조회 에러:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다.",
    });
  }
};
