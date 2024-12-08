import express from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  getUserGames,
  getUserProfile,
} from "../controllers/userProfile.controller";

const router = express.Router();

// 공지사항 목록 조회 (모든 사용자)
router.get("/profile", authMiddleware, getUserProfile);
router.get("/games", authMiddleware, getUserGames);

export default router;
