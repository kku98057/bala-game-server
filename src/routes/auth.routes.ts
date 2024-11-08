import express from "express";
import {
  getUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
// 회원가입 라우트
router.post("/register", register);

// 로그인 라우트
router.post("/login", login);
router.post("/logout", logout);

// 유저정보 조회
router.get("/user", authMiddleware, getUser);
export default router;
