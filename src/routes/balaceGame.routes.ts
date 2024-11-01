import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import {
  getBalanceGame,
  getBalanceGames,
  getGameStatistics,
  incrementParticipants,
  recordFinalChoice,
  uploadGame,
} from "../controllers/balanceGame.controller";
import { upload } from "../config/s3.config";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/create", authMiddleware, upload.array("image"), uploadGame);
router.post("/participants", incrementParticipants);
router.get("/statistics/:id", getGameStatistics);

router.post("/final-choice", recordFinalChoice); // 새로운 엔드포인트
router.get("/:id", getBalanceGame);
router.get("/", getBalanceGames);
export default router;
