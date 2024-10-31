import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
