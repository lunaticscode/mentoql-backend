import { AppController } from "../types";

const authMiddleware: AppController = (req, res, next) => {
  next();
};
export default authMiddleware;
