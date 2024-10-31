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
