import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import {
  getBalanceGame,
  getBalanceGames,
  incrementParticipants,
  uploadGame,
} from "../controllers/balanceGame.controller";
import { upload } from "../config/s3.config";
const router = express.Router();

router.post("/create", upload.array("image"), uploadGame);
router.post("/participants", incrementParticipants);
router.get("/:id", getBalanceGame);
router.get("/", getBalanceGames);
export default router;
