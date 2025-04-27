import { METNO_SEED_COLLECTION } from "../consts/collection";
import milvusClient from "../db_init";
import mongodb from "../mongodb_init";
import { AppController } from "../types";
const healthCheckController: AppController = async (req, res) => {
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

    return res.json({
      dbStatus: { milvusDBInstance, mongoDBStatus },
    });
  } catch (err) {
    console.error({ err });
    return res.json({ isError: true });
  }
};
export default healthCheckController;
