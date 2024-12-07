import express from "express";
import {
  getBalanceGameRanking,
  getTournamentGameRanking,
} from "../controllers/ranking.controller";

const router = express.Router();

// 밸런스게임 랭킹 조회 (모든 사용자)
router.get("/balanceGame", getBalanceGameRanking);

// 이상형월드컵게임 랭킹 조회 (모든 사용자)
router.get("/tournamentGame", getTournamentGameRanking);

export default router;
