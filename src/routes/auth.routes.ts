import express from "express";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();
// 회원가입 라우트
router.post("/register", register);

// 로그인 라우트
router.post("/login", login);
export default router;
