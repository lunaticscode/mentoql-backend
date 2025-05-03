import express from "express";
import cookieParser from "cookie-parser";
import { APP_PORT } from "./consts/app";
import apiRoute from "./routes";
import healthCheckController from "./controllers/healtcheck.controller";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.get("/health-check", healthCheckController);
app.use(cookieParser());
app.use(express.json());

app.use("/api", apiRoute);
app.use(errorMiddleware);
app.listen(APP_PORT, () => {
  console.log(`Express Running on 8080`);
});
