import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

const authRoute = Router();

authRoute.get("/", authMiddleware, (req, res) => {});
export default authRoute;
