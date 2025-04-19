import { FieldType, MetricType, MilvusClient } from "@zilliz/milvus2-sdk-node";
import { metnoSeedSchema } from "./schemas";
import { METNO_SEED_COLLECTION } from "./consts/collection";

const activeCollections: [
  { name: string; metric_type: MetricType },
  FieldType[]
][] = [[METNO_SEED_COLLECTION, metnoSeedSchema]];

const milvusClient = new MilvusClient({
  address: "http://localhost:19530",
  token: "root:Milvus",
});

milvusClient
  .createDatabase({ db_name: "humanwater_test" })
  .then(async (res) => {
    console.log("Milvus running");
    for (const [collection, schema] of activeCollections) {
      try {
        await milvusClient.createCollection({
          collection_name: collection.name,
          fields: schema,
          metric_type: collection.metric_type,
        });
      } catch (err) {
        console.error(
          `(!) Occured error during create ${collection.name} collection\n`,
          err
        );
      }
    }
  })

  .catch((err) => {
    console.error(err);
    return null;
  });

export default milvusClient;
