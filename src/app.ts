import express from "express";

import db from "./db_init";
import { AppController } from "./types";
import { APP_PORT } from "./consts/app";
import apiRoute from "./routes";

const healthCheckController: AppController = async (req, res) => {
  try {
    const dbInstance = await db.describeDatabase({
      db_name: "humanwater_test",
    });
    return res.json({ data: dbInstance });
  } catch (err) {
    console.error({ err });
    return res.json({ isError: true });
  }
};

const app = express();

app.get("/health-check", healthCheckController);
app.use(express.json());
app.use("/api", apiRoute);

app.listen(APP_PORT, () => {
  console.log(`Express Running on 8080`);
});
