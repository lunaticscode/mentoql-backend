import { Router } from "express";
import { createQuestionController } from "../controllers/question.controller";

const questionRoute = Router();
// queryRoomRoute.post("/", refererValidator("strict"), createQueryRoomController);
questionRoute.post("/", createQuestionController);
// questionRoute.get("/:questinId");
export default questionRoute;
