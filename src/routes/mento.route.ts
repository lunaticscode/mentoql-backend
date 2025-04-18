import { Router } from "express";
import { getMentoSeed, insertMetnoSeed } from "../controllers/mento.controller";

const mentoRoute = Router();

mentoRoute.get("/", getMentoSeed);
mentoRoute.post("/", insertMetnoSeed);
export default mentoRoute;
