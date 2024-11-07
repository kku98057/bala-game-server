import express from "express";
import {
  createNotice,
  deleteNotice,
  getNoticeDetail,
  getNotices,
  updateNotice,
} from "../controllers/notice.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { superAdminMiddleware } from "../middleware/suerAdmin.middleware";

const router = express.Router();

// router.use(superAdminMiddleware);
// 공지사항 목록 조회 (모든 사용자)
router.get("/", getNotices);

// 공지사항 상세 조회 (모든 사용자)
router.get("/:id", getNoticeDetail);

// 아래 라우트들은 SUPER_ADMIN만 접근 가능

// 공지사항 생성
router.post("/", createNotice);

// 공지사항 수정
router.put("/:id", updateNotice);

// 공지사항 삭제
router.delete("/:id", deleteNotice);

export default router;
