import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

// 밸런스 게임 랭킹 (1-10등)
export const getBalanceGameRanking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 유저별 밸런스 게임의 총 참여자 수 집계
    const balanceRanking = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        balanceGames: {
          select: {
            questions: {
              select: {
                _count: {
                  select: {
                    finalChoices: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        balanceGames: {
          some: {},
        },
      },
    });

    // 참여자 수 계산 및 정렬
    const rankingWithTotal = balanceRanking
      .map((user) => ({
        userId: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
        totalParticipants: user.balanceGames.reduce((gameSum, game) => {
          // 각 게임의 참여자 수는 questions의 finalChoices 중 최대값
          const gameParticipants = Math.max(
            ...game.questions.map((q) => q._count.finalChoices),
            0
          );
          return gameSum + gameParticipants;
        }, 0),
      }))
      .sort((a, b) => b.totalParticipants - a.totalParticipants)
      .slice(0, 10)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    res.status(200).json({
      message: "밸런스 게임 랭킹 조회 성공",
      payload: {
        ranking: rankingWithTotal,
      },
    });
  } catch (error) {
    console.error("밸런스 게임 랭킹 조회 실패:", error);
    next(error);
  }
};

// 이상형월드컵 랭킹 (1-10등)
export const getTournamentGameRanking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 유저별 이상형월드컵 총 참여자 수 집계
    const tournamentRanking = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        tournamentGames: {
          select: {
            participantCount: true,
          },
        },
      },
      where: {
        tournamentGames: {
          some: {}, // 게임을 하나라도 만든 유저
        },
      },
    });

    // 참여자 수 계산 및 정렬
    const rankingWithTotal = tournamentRanking
      .map((user) => ({
        userId: user.id,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
        totalParticipants: user.tournamentGames.reduce(
          (sum, game) => sum + game.participantCount,
          0
        ),
      }))
      .sort((a, b) => b.totalParticipants - a.totalParticipants)
      .slice(0, 10) // 상위 10개만
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    res.status(200).json({
      message: "이상형월드컵 랭킹 조회 성공",
      payload: {
        ranking: rankingWithTotal,
      },
    });
  } catch (error) {
    console.error("이상형월드컵 랭킹 조회 실패:", error);
    next(error);
  }
};
