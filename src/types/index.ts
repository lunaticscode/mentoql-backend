import { Request, Response, NextFunction } from "express";
type AppController = (req: Request, res: Response, next: NextFunction) => void;
type UserProfile = {
  email: string;
  picture: string;
  name: string;
};
export { AppController, UserProfile };
