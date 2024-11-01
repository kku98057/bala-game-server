import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";

const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
if (!AWS_S3_BUCKET) {
  console.error("AWS_S3_BUCKET is missing");
  process.exit(1); // 또는 기본값 설정
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// S3 스토리지 설정을 함수로 분리
const s3Storage = multerS3({
  s3: s3,
  bucket: AWS_S3_BUCKET,
  key: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `balance-game/${uniqueSuffix}-${file.originalname}`);
  },
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

export const upload = multer({
  storage: s3Storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 32,
  },
});
