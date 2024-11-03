import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// 댓글 작성 (인증 필요)
router.post("/create", authMiddleware, createComment);

// 댓글 목록 조회 (인증 불필요)
router.get("/:gameId/:gameType", getComments);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);
export default router;
