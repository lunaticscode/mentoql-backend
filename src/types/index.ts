import { Request, Response, NextFunction } from "express";

type AppMiddleware = (req: Request, res: Response, next: NextFunction) => void;
type AppController = (req: Request, res: Response, next: NextFunction) => void;
type ErrorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
type UserProfile = {
  email: string;
  picture: string;
  name: string;
};

export { AppController, AppMiddleware, ErrorMiddleware, UserProfile };
