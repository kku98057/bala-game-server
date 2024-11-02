import express from "express";

import {
  getTournamentGame,
  getTournamentGames,
  getTournamentStatistics,
  incrementParticipants,
  recordFinalChoice,
  uploadGame,
} from "../controllers/tournamentGame.controller";
import { upload } from "../config/s3.config";
import { authMiddleware } from "../middleware/auth.middleware";
import commentRouter from "./comment.routes";
const router = express.Router();

router.post("/create", authMiddleware, upload.array("image"), uploadGame);
router.post("/participants", incrementParticipants);
router.get("/statistics/:id", getTournamentStatistics);

router.post("/final-choice", recordFinalChoice); // 새로운 엔드포인트
router.get("/:id", getTournamentGame);
router.get("/", getTournamentGames);
router.use("/comments", commentRouter);
export default router;
