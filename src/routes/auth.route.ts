import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

const authRoute = Router();

authRoute.get("/", authMiddleware, (req, res) => {
  res.json({
    isError: false,
    profile: (req as unknown as Request & { profile: { email: string } })
      .profile,
  });
});
export default authRoute;
