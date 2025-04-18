import { Request, Response, NextFunction } from "express";
type AppController = (req: Request, res: Response, next: NextFunction) => void;

export { AppController };
