import dotenv from "dotenv";
import path from "path";

// 환경 변수 설정
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

// DATABASE_URL 구성
const DATABASE_URL = process.env.DATABASE_URL;

export const env = {
  DATABASE_URL,
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
};
