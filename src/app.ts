import dotenv from "dotenv";
dotenv.config();

import balanceGameRoutes from "./routes/balaceGame.routes";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.config";
import { morganLogger, requestLogger } from "../middleware/logger";
const app: Express = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정

app.use(requestLogger);
app.use(morganLogger);
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/api/balanceGame", balanceGameRoutes);

// 기본 라우트

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "밸런스 게임 서버에 오신 것을 환영합니다!" });
});

// 서버 시작
app.listen(port, async () => {
  console.log(`서버가 포트 ${port}번에서 실행 중입니다.`);
});
