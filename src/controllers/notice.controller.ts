import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { UserRole } from "@prisma/client";
import { DecodedToken } from "../types/express";
import { verify } from "jsonwebtoken";
// 공지사항 생성
export const createNotice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, isVisible = true } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;
      req.user = decoded;
    }

    if (!title?.trim() || !content?.trim()) {
      res.status(400).json({
        message: "제목과 내용을 입력해주세요.",
      });
      return;
    }
    if (req.user?.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({
        message: "접근 권한이 없습니다.",
      });
      return;
    }

    const authorId = req.user!.id;
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        authorId,
        isVisible,
      },
    });

    res.status(201).json({
      message: "공지사항이 생성되었습니다.",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// 공지사항 목록 조회
export const getNotices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;
      req.user = decoded;
    }
    const where = {
      ...(req?.user?.role !== UserRole.SUPER_ADMIN && { isVisible: true }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
          {
            author: {
              nickname: { contains: search },
            },
          },
        ],
      }),
    };

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              nickname: true,
            },
          },
        },
      }),
      prisma.notice.count({ where }),
    ]);

    res.status(200).json({
      message: "공지사항 목록을 조회했습니다.",
      data: {
        notices,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 공지사항 상세 조회
export const getNoticeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;
      req.user = decoded;
    }

    const notice = await prisma.notice.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        author: {
          select: {
            nickname: true,
          },
        },
      },
    });
    if (!notice) {
      res.status(404).json({
        message: "공지사항을 찾을 수 없습니다.",
      });
      return;
    }

    if (!notice.isVisible && req?.user?.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({
        message: "접근 권한이 없습니다.",
      });
      return;
    }

    res.status(200).json({
      message: "공지사항을 조회했습니다.",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// 공지사항 수정
export const updateNotice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, content, isVisible } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;
      req.user = decoded;
    }
    if (req.user?.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({
        message: "접근 권한이 없습니다.",
      });
      return;
    }
    const notice = await prisma.notice.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        isVisible,
      },
    });

    res.status(200).json({
      message: "공지사항이 수정되었습니다.",
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// 공지사항 삭제
export const deleteNotice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verify(
        token,
        process.env.JWT_SECRET || ""
      ) as DecodedToken;
      req.user = decoded;
    }
    if (req.user?.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({
        message: "접근 권한이 없습니다.",
      });
      return;
    }
    await prisma.notice.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "공지사항이 삭제되었습니다.",
    });
  } catch (error) {
    next(error);
  }
};
