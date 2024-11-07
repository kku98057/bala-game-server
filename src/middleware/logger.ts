import { Request, Response, NextFunction } from "express";
import morgan from "morgan";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("Request received:", {
  //   method: req.method,
  //   path: req.path,
  //   headers: req.headers,
  // });
  next();
};

export const morganLogger = morgan("dev");
