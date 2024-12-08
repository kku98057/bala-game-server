import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.config";
import { morganLogger, requestLogger } from "./middleware/logger";
import compression from "compression";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import tournamentGameRoutes from "./routes/tournamentGame.routes";
import commentRoutes from "./routes/comment.routes";
import balanceGameRoutes from "./routes/balanceGame.routes";
import noticeRoutes from "./routes/notice.routes";
import rankingRoutes from "./routes/ranking.routes";
import profileRoutes from "./routes/profile.routes";
const app: Express = express();
const port = process.env.PORT || 3001;

// 1. 보안 미들웨어
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// 2. CORS 설정
app.use(cors(corsOptions));

// 3. 로깅 미들웨어
app.use(requestLogger);
app.use(morganLogger);
// 응답 압축 미들웨어
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // 압축 레벨 (1-9, 기본값: 6)
  })
);

// 5. 본문 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/tournamentGame", tournamentGameRoutes);
app.use("/api/balanceGame", balanceGameRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/user", profileRoutes);
// 서버 시작
app.listen(port, async () => {
  console.log(process.env.NODE_ENV);
  console.log(`서버가 포트 ${port}번에서 실행 중입니다.`);
});
