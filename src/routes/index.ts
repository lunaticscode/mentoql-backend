import { Router } from "express";
import mentoRoute from "./mento.route";

const apiRoute = Router();

apiRoute.use("/mento", mentoRoute);

export default apiRoute;
