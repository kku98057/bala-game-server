import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import {
  getBalanceGame,
  uploadGame,
} from "../controllers/balanceGame.controller";
import { upload } from "../config/s3.config";
const router = express.Router();

router.post("/create", upload.array("image"), uploadGame);
router.get("/:id", getBalanceGame);

export default router;
