import { NextFunction, Request, Response } from "express";
import { CreateTournamentGameRequest } from "../types/tournamentGame";
import prisma from "../lib/prisma";

// 게임 생성
export const uploadGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tournamentGameData: CreateTournamentGameRequest = req.body;
    const files = req.files as Express.MulterS3.File[];
    const userId = req.user?.id; // 로그인한 사용자의 ID

    // userId가 없는 경우 처리
    if (!userId) {
      res.status(401).json({ message: "로그인이 필요합니다." });
      return;
    }

    // 입력값 검증...

    const savedGame = await prisma.tournamentGame.create({
      data: {
        title: tournamentGameData.title,
        username: tournamentGameData.username,
        userId: userId, // 사용자 ID 추가
        items: {
          create: tournamentGameData.list.map((item, index) => ({
            name: item.name,
            imageUrl: files[index].location,
          })),
        },
      },
      include: {
        items: true,
        user: true, // 필요한 경우 user 정보도 포함
      },
    });

    res.status(201).json({
      message: "월드컵 게임 생성에 성공했습니다.",
      data: savedGame,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 게임 상세
export const getTournamentGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
      res.status(400).json({ message: "유효하지 않은 게임 ID입니다." });
      return;
    }

    const game = await prisma.tournamentGame.findUnique({
      where: { id: gameId },
      include: {
        items: true, // 관련된 아이템들도 함께 조회
      },
    });

    if (!game) {
      res.status(404).json({ message: "게임을 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({
      message: "게임 조회에 성공했습니다.",
      data: game,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 게임 리스트 조회
export const getTournamentGames = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      prisma.tournamentGame.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            take: 3,
            orderBy: {
              id: "asc",
            },
          },
          _count: {
            select: { items: true, comments: true },
          },
        },
      }),
      prisma.tournamentGame.count(),
    ]);
    // 응답 데이터에 itemsCount 추가
    const gamesWithCount = games.map((game) => ({
      ...game,
      itemsCount: game._count.items,
      _count: undefined,
      commentsCount: game._count.comments,
    }));
    res.json({
      payload: {
        games: gamesWithCount,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        list: limit,
      },
    });
  } catch (error) {
    console.error("게임 목록 조회 실패:", error);
    res.status(500).json({ error: "게임 목록을 불러오는데 실패했습니다." });
  }
};

// 참가자 수 증가
export const incrementParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
      res.status(400).json({ message: "유효하지 않은 게임 ID입니다." });
      return;
    }

    const updatedGame = await prisma.tournamentGame.update({
      where: { id: gameId },
      data: {
        participantCount: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      message: "참여자 수가 증가되었습니다.",
      participantCount: updatedGame.participantCount,
    });
  } catch (error) {
    console.error("참여자 수 증가 실패:", error);
    next(error);
  }
};

// 게임 통계
export const getTournamentStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const gameId = parseInt(id);
    // gameId가 유효한 숫자가 아닌 경우
    if (isNaN(gameId)) {
      res.status(400).json({
        success: false,
        message: "유효하지 않은 게임 ID입니다.",
      });
      return;
    }
    // 게임이 존재하는지 먼저 확인
    const game = await prisma.tournamentGame.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      res.status(404).json({
        success: false,
        message: "존재하지 않는 게임입니다.",
      });
      return;
    }
    // 게임의 모든 선택지와 각각의 선택 수를 조회
    const itemsWithStats = await prisma.tournamentItem.findMany({
      where: {
        tournamentId: gameId,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        _count: {
          select: {
            finalChoices: true,
          },
        },
      },
    });

    // 전체 선택 수 계산
    const totalCount = itemsWithStats.reduce(
      (sum, item) => sum + item._count.finalChoices,
      0
    );

    // 응답 데이터 구조화
    const statistics = itemsWithStats
      .map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        count: item._count.finalChoices,
        percentage:
          totalCount > 0
            ? Math.round((item._count.finalChoices / totalCount) * 100)
            : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    res.status(200).json({
      message: "통계 조회 성공",
      data: {
        id: game.id,
        title: game.title,
        totalCount,
        createdAt: game.createdAt,
        username: game.username,
        items: statistics,
      },
    });
  } catch (error) {
    console.error("통계 조회 실패:", error);
    next(error);
  }
};

// 결승 선택 기록
export const recordFinalChoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tournamentId, selectedItemId } = req.body;
    const userId = req.user?.id; // 로그인한 경우에만 존재

    // 유효성 검사
    if (!tournamentId || !selectedItemId) {
      res.status(400).json({
        message: "필수 데이터가 누락되었습니다.",
      });
      return;
    }
    // 트랜잭션으로 최종 선택 기록과 참가자 수 증가를 함께 처리
    const [finalChoice, updatedGame] = await prisma.$transaction([
      // 최종 선택 기록
      prisma.finalChoice.create({
        data: {
          tournamentId: parseInt(tournamentId),
          selectedItemId: parseInt(selectedItemId),
          ...(userId && { userId }), // 로그인한 경우에만 userId 추가
        },
      }),
      // 참가자 수 증가
      prisma.tournamentGame.update({
        where: { id: parseInt(tournamentId) },
        data: {
          participantCount: {
            increment: 1,
          },
        },
      }),
    ]);

    res.status(201).json({
      message: "최종 선택이 기록되었습니다.",
      data: {
        finalChoice,
        participantCount: updatedGame.participantCount,
      },
    });
  } catch (error) {
    console.error("최종 선택 기록 실패:", error);
    next(error);
  }
};

// 게임 삭제
export const deleteTournamentGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gameId = Number(req.params.gameId);
    const userId = req.user?.id;

    // 유효성 검사
    if (isNaN(gameId)) {
      res.status(400).json({ message: "유효하지 않은 게임 ID입니다." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "인증이 필요합니다." });
      return;
    }

    // 게임 존재 여부와 작성자 확인
    const game = await prisma.tournamentGame.findUnique({
      where: { id: gameId },
      select: { userId: true },
    });

    if (!game) {
      res.status(404).json({ message: "게임을 찾을 수 없습니다." });
      return;
    }

    if (game.userId !== userId && req.user?.role !== "SUPER_ADMIN") {
      res.status(403).json({ message: "게임을 삭제할 권한이 없습니다." });
      return;
    }

    // 게임 삭제 (연관된 데이터는 CASCADE로 자동 삭제)
    await prisma.tournamentGame.delete({
      where: { id: gameId },
    });

    res.status(200).json({ message: "게임이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("게임 삭제 실패:", error);
    next(error);
  }
};
