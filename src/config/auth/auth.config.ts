export default {
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "24h",
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:80/auth/google/callback",
  },
  kakao: {
    clientID: process.env.KAKAO_CLIENT_ID || "",
    callbackURL: "http://localhost:80/auth/kakao/callback",
  },
  naver: {
    clientID: process.env.NAVER_CLIENT_ID || "",
    clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    callbackURL: "http://localhost:80/auth/naver/callback",
  },
  pass: {
    clientId: process.env.PASS_CLIENT_ID || "",
    clientSecret: process.env.PASS_CLIENT_SECRET || "",
    txId: process.env.PASS_TX_ID || "",
  },
};
