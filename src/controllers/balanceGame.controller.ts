import { NextFunction, Request, Response } from "express";
import { CreateBalanceGameDTO } from "../types/balanceGame";
import prisma from "../lib/prisma";

// 밸런스 게임 생성
export const createBalanceGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gameData: CreateBalanceGameDTO = req.body;

    if (!req.user) {
      res.status(401).json({
        message: "인증이 필요합니다.",
      });
      return;
    }
    // 1. 기본 데이터 유효성 검사
    if (!gameData.title || gameData.title.length > 20) {
      res.status(400).json({
        message: "게임 제목은 1~20자로 입력해주세요.",
      });
      return;
    }

    if (!gameData.username || gameData.username.length > 8) {
      res.status(400).json({
        message: "작성자명은 1~8자로 입력해주세요.",
      });
      return;
    }

    // 2. 질문 데이터 유효성 검사
    if (!gameData.questions || gameData.questions.length === 0) {
      res.status(400).json({
        message: "최소 1개 이상의 질문이 필요합니다.",
      });
      return;
    }

    if (gameData.questions.length > 10) {
      res.status(400).json({
        message: "최대 10개까지의 질문만 가능합니다.",
      });
      return;
    }

    // 3. 각 질문과 선택지 유효성 검사
    for (const question of gameData.questions) {
      // if (!question.title || question.title.length > 50) {
      //   res.status(400).json({
      //     message: "질문은 1~40자로 입력해주세요.",
      //   });
      //   return;
      // }

      if (
        !question.items ||
        question.items.length < 2 ||
        question.items.length > 5
      ) {
        res.status(400).json({
          message: "각 질문은 2~5개의 선택지가 필요합니다.",
        });
        return;
      }

      for (const item of question.items) {
        if (!item.name || item.name.length > 40) {
          res.status(400).json({
            message: "선택지는 1~40자로 입력해주세요.",
          });
          return;
        }
      }
    }

    // 4. 게임 생성
    const userId = req.user.id;
    const savedGame = await prisma.balanceGame.create({
      data: {
        title: gameData.title,
        username: gameData.username,
        userId,
        type: "BALANCE",
        questions: {
          create: gameData.questions.map((q) => ({
            title: q.title,
            items: {
              create: q.items.map((item) => ({
                name: item.name,
                selectCount: 0,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            items: true,
          },
        },
      },
    });

    // 5. 응답
    res.status(201).json({
      message: "밸런스 게임이 생성되었습니다.",
      data: savedGame,
    });
    return;
  } catch (error) {
    console.error("밸런스 게임 생성 실패:", error);
    next(error);
  }
};

// 밸런스 게임 목록 조회
export const getBalanceGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 게임 목록과 총 개수를 동시에 조회
    const [games, total] = await Promise.all([
      prisma.balanceGame.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc", // 최신순 정렬
        },
        select: {
          id: true,
          title: true,
          username: true,
          createdAt: true,
          _count: {
            select: {
              questions: true, // 질문 수
              comments: true, // 댓글 수
            },
          },
          questions: {
            select: {
              _count: {
                select: {
                  finalChoices: true, // 참여자 수 (각 질문별 선택 수)
                },
              },
            },
          },
        },
      }),
      prisma.balanceGame.count(),
    ]);

    // 응답 데이터 가공
    const formattedGames = games.map((game) => ({
      id: game.id,
      title: game.title,
      username: game.username,
      createdAt: game.createdAt,
      questionsCount: game._count.questions,
      commentsCount: game._count.comments,
      participantCount: Math.max(
        ...game.questions.map((q) => q._count.finalChoices),
        0
      ),
    }));

    res.status(200).json({
      message: "게임 목록 조회 성공",
      payload: {
        games: formattedGames,

        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
      },
    });
  } catch (error) {
    console.error("게임 목록 조회 실패:", error);
    next(error);
  }
};
// 밸런스 게임 상세 조회
export const getBalanceGameDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gameId = Number(req.params.gameId);

    const game = await prisma.balanceGame.findUnique({
      where: { id: gameId },
      include: {
        questions: {
          include: {
            items: {
              select: {
                id: true,
                name: true,
                selectCount: true,
              },
            },
          },
        },
      },
    });

    if (!game) {
      res.status(404).json({
        message: "게임을 찾을 수 없습니다.",
      });
      return;
    }
    // 해당 게임의 모든 질문의 participantCount 조회
    const questions = await prisma.balanceQuestion.findMany({
      where: { gameId: gameId },
      select: {
        participantCount: true,
      },
    });
    // 최대 참여자 수 계산
    const maxParticipantCount = Math.max(
      ...questions.map((q) => q.participantCount)
    );

    // 응답 데이터 가공
    const formattedGame = {
      id: game.id,
      title: game.title,
      username: game.username,
      createdAt: game.createdAt,
      participantCount: maxParticipantCount, // 전체 참여자 수 추가
      questions: game.questions.map((question) => ({
        id: question.id,
        title: question.title,
        items: question.items.map((item) => ({
          id: item.id,
          name: item.name,
          selectCount: item.selectCount,
        })),
        totalParticipants: question.participantCount,
      })),
    };

    res.status(200).json({
      message: "게임 상세 조회 성공",
      data: formattedGame,
    });
  } catch (error) {
    console.error("게임 상세 조회 실패:", error);
    next(error);
  }
};

// 밸런스 게임 선택 기록
export const recordBalanceChoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questionId, selectedItemId } = req.body;
    const userId = req.user?.id;

    // 트랜잭션으로 선택 기록 및 카운트 증가
    const [choice, updatedItem] = await prisma.$transaction([
      // 선택 기록 생성
      prisma.balanceFinalChoice.create({
        data: {
          questionId,
          selectedItemId,
          userId,
        },
      }),
      // 선택된 항목의 카운트 증가
      prisma.balanceItem.update({
        where: { id: selectedItemId },
        data: {
          selectCount: {
            increment: 1,
          },
        },
        include: {
          question: {
            include: {
              items: true,
            },
          },
        },
      }),
    ]);

    // 선택 결과 계산
    const totalCount = updatedItem.question.items.reduce(
      (sum, item) => sum + item.selectCount,
      0
    );

    const results = updatedItem.question.items.map((item) => ({
      id: item.id,
      name: item.name,
      selectCount: item.selectCount,
      percentage: Math.round((item.selectCount / totalCount) * 100),
    }));

    res.status(201).json({
      message: "선택이 기록되었습니다.",
      data: {
        results,
        totalParticipants: totalCount,
      },
    });
  } catch (error) {
    console.error("선택 기록 실패:", error);
    next(error);
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

    // 모든 질문의 participantCount를 1씩 증가
    await prisma.balanceQuestion.updateMany({
      where: {
        gameId: gameId,
      },
      data: {
        participantCount: {
          increment: 1,
        },
      },
    });

    // 업데이트된 참여자 수 조회
    const questions = await prisma.balanceQuestion.findMany({
      where: { gameId: gameId },
      select: {
        participantCount: true,
      },
    });

    const maxParticipantCount = Math.max(
      ...questions.map((q) => q.participantCount)
    );

    res.status(200).json({
      message: "참여자 수가 증가되었습니다.",
      participantCount: maxParticipantCount,
    });
  } catch (error) {
    console.error("참여자 수 증가 실패:", error);
    next(error);
  }
};
export const getBalanceGameStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gameId = Number(req.params.gameId);

    if (isNaN(gameId)) {
      res.status(400).json({ message: "유효하지 않은 게임 ID입니다." });
      return;
    }

    // 특정 게임의 통계 조회
    const game = await prisma.balanceGame.findUnique({
      where: {
        id: gameId,
      },
      select: {
        id: true,
        title: true,
        username: true,
        createdAt: true,
        questions: {
          select: {
            id: true,
            title: true,
            participantCount: true,
            items: {
              select: {
                id: true,
                name: true,
                selectCount: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!game) {
      res.status(404).json({ message: "게임을 찾을 수 없습니다." });
      return;
    }

    // 응답 데이터 가공
    const formattedStats = {
      id: game.id,
      title: game.title,
      username: game.username,
      createdAt: game.createdAt,
      commentsCount: game._count.comments,
      questions: game.questions.map((question) => {
        const totalSelections = question.items.reduce(
          (sum, item) => sum + item.selectCount,
          0
        );

        return {
          id: question.id,
          title: question.title,
          participantCount: question.participantCount,
          totalSelections,
          items: question.items.map((item) => ({
            id: item.id,
            name: item.name,
            selectCount: item.selectCount,
            percentage:
              totalSelections > 0
                ? Math.round((item.selectCount / totalSelections) * 100)
                : 0,
          })),
        };
      }),
    };

    res.status(200).json({
      message: "통계 조회 성공",
      data: formattedStats,
    });
  } catch (error) {
    console.error("통계 조회 실패:", error);
    next(error);
  }
};