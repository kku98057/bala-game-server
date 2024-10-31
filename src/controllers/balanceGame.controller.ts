import { NextFunction, Request, Response } from "express";
import { CreateBalanceGameRequest } from "../types/balanceGame";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import exp from "constants";

export const uploadGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const balanceGameData: CreateBalanceGameRequest = req.body;
    const files = req.files as Express.MulterS3.File[]; // 타입 변경

    const savedGame = await prisma.balanceGame.create({
      data: {
        title: balanceGameData.title,
        username: balanceGameData.username,
        items: {
          create: balanceGameData.list.map((item, index) => ({
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
      message: "밸런스 게임 생성에 성공했습니다.",
      data: savedGame,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getBalanceGame = async (
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

    const game = await prisma.balanceGame.findUnique({
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
export const getBalanceGames = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      prisma.balanceGame.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: true,
        },
      }),
      prisma.balanceGame.count(),
    ]);

    res.json({
      payload: {
        games,
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
