import { Router } from "express";
import {
  createQueryRoomController,
  getQueryRoomController,
} from "../controllers/queryRoom.controller";
import { refererValidator } from "../middlewares/referer.middleware";

const queryRoomRoute = Router();
// queryRoomRoute.post("/", refererValidator("strict"), createQueryRoomController);
queryRoomRoute.post("/", createQueryRoomController);
queryRoomRoute.get(
  "/:roomId",
  // refererValidator("not-bot"),
  getQueryRoomController
);
export default queryRoomRoute;
