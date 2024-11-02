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
    const files = req.files as Express.MulterS3.File[]; // 타입 변경
    // 입력값 검증 추가
    if (tournamentGameData.title.length > 20) {
      res
        .status(400)
        .json({ message: "게임 제목은 20자 이하로 입력해주세요." });
      return;
    }
    if (tournamentGameData.username.length > 8) {
      res.status(400).json({ message: "작성자명은 8자 이하로 입력해주세요." });
      return;
    }
    // 각 아이템 이름 길이 검증 추가
    const invalidItems = tournamentGameData.list.find(
      (item) => item.name.length > 20
    );
    if (invalidItems) {
      res
        .status(400)
        .json({ message: "선택지 이름은 20자 이하로 입력해주세요." });
      return;
    }

    const savedGame = await prisma.tournamentGame.create({
      data: {
        title: tournamentGameData.title,
        username: tournamentGameData.username,
        items: {
          create: tournamentGameData.list.map((item, index) => ({
            name: item.name,
            imageUrl: files[index].location,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      message: "토너먼트 게임 생성에 성공했습니다.",
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
            select: { items: true },
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
        totalCount,
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

    // 유효성 검사
    if (!tournamentId || !selectedItemId) {
      res.status(400).json({
        message: "필수 데이터가 누락되었습니다.",
      });
      return;
    }

    // 최종 선택 기록
    const finalChoice = await prisma.finalChoice.create({
      data: {
        tournamentId: parseInt(tournamentId),
        selectedItemId: parseInt(selectedItemId),
      },
    });

    res.status(201).json({
      message: "최종 선택이 기록되었습니다.",
      data: finalChoice,
    });
  } catch (error) {
    console.error("최종 선택 기록 실패:", error);
    next(error);
  }
};
