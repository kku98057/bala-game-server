import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createBalanceGame,
  getBalanceGameDetail,
  getBalanceGames,
  getBalanceGameStats,
  incrementParticipants,
  recordBalanceChoice,
} from "../controllers/balanceGame.controller";

const router = express.Router();

router.post("/create", authMiddleware, createBalanceGame);
router.get("/", getBalanceGames);
router.get("/:gameId", getBalanceGameDetail);
router.post("/choice", recordBalanceChoice);
router.post("/participants", incrementParticipants);
router.get("/statistics/:gameId", getBalanceGameStats);
export default router;
