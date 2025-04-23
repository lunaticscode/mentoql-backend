import { Router } from "express";

import authRoute from "./auth.route";
import oauthRoute from "./oauth.route";
import mentoRoute from "./mento.route";

const apiRoute = Router();

apiRoute.use("/auth", authRoute);
apiRoute.use("/oauth", oauthRoute);
apiRoute.use("/mento", mentoRoute);

export default apiRoute;
