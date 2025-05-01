import { Router } from "express";
import { getMentoSeed, insertMetnoSeed } from "../controllers/mento.controller";

const mentoRoute = Router();
mentoRoute.post("/get-answer", getMentoSeed);
mentoRoute.post("/seed", insertMetnoSeed);
export default mentoRoute;
