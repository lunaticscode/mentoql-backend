import { Router } from "express";

import {
  googleOauthCallback,
  googleOauthSignin,
} from "../controllers/oauth.controller";

const oauthRoute = Router();

oauthRoute.get("/google", googleOauthSignin);
oauthRoute.get("/google-callback", googleOauthCallback);

export default oauthRoute;
