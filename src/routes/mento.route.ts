import { Router } from "express";
import {
  createMentoQueryRoom,
  getMentoQueryRoom,
  getMentoSeed,
  insertMetnoSeed,
} from "../controllers/mento.controller";
import { refererValidator } from "../middlewares/referer.middleware";

const mentoRoute = Router();
mentoRoute.post("/create-qr", refererValidator("strict"), createMentoQueryRoom);
mentoRoute.post("/get-answer", getMentoSeed);
mentoRoute.get("/qr/:roomId", refererValidator("not-bot"), getMentoQueryRoom);
mentoRoute.post("/seed", insertMetnoSeed);
export default mentoRoute;
