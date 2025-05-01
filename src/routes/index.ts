import { Router } from "express";

import authRoute from "./auth.route";
import oauthRoute from "./oauth.route";
import mentoRoute from "./mento.route";
import queryRoomRoute from "./queryRoom.route";
import questionRoute from "./question.route";
const apiRoute = Router();

apiRoute.use("/auth", authRoute);
apiRoute.use("/oauth", oauthRoute);
apiRoute.use("/mento", mentoRoute);
apiRoute.use("/query-room", queryRoomRoute);
apiRoute.use("/question", questionRoute);
export default apiRoute;
