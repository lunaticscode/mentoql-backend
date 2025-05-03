import express from "express";
import cookieParser from "cookie-parser";
import { APP_PORT } from "./consts/app";
import apiRoute from "./routes";
import healthCheckController from "./controllers/healtcheck.controller";
import errorMiddleware from "./middlewares/error.middleware";
import CustomError, { getErrorArgs } from "./consts/error";
import { AppController } from "./types";

const errorTestController: AppController = (req, res, next) => {
  return next(
    new CustomError(getErrorArgs("UKNOWN_ERROR"), "errorTestController")
  );
};

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/health-check", healthCheckController);
app.get("/error-test", errorTestController);
app.use("/api", apiRoute);

app.use(errorMiddleware);
app.listen(APP_PORT, () => {
  console.log(`Express Running on 8080`);
});
