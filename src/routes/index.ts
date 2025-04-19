import { Router } from "express";

import oauthRoute from "./oauth.route";
import mentoRoute from "./mento.route";

const apiRoute = Router();

apiRoute.use("/oauth", oauthRoute);
apiRoute.use("/mento", mentoRoute);

export default apiRoute;
