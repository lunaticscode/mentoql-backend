import { SUCCESS_STATUS_CODE } from "../consts/api";
import { METNO_SEED_COLLECTION } from "../consts/collection";
import CustomError, { getErrorArgs } from "../consts/error";
import milvusClient from "../db_init";
import mongodb from "../mongodb_init";
import { AppController } from "../types";
const healthCheckController: AppController = async (req, res, next) => {
  try {
    const milvusDBInstance = await milvusClient
      .describeCollection({
        collection_name: METNO_SEED_COLLECTION.name,
      })
      .then((res) =>
        res.status.error_code === "Success" ? "connected" : "(!) disconnected"
      );
    const mongoDBStatus =
      mongodb.connection.readyState === 1 ? "connected" : "(!) disconnected";

    return res.status(SUCCESS_STATUS_CODE.GET).json({
      dbStatus: { milvusDBInstance, mongoDBStatus },
    });
  } catch (err) {
    return next(
      new CustomError(
        getErrorArgs("FAIL_TO_CONNECT_DB"),
        "healthCheckController"
      )
    );
  }
};
export default healthCheckController;
