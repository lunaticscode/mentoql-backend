import { FieldType, MetricType, MilvusClient } from "@zilliz/milvus2-sdk-node";
import { metnoSeedSchema } from "./schemas";
import { METNO_SEED_COLLECTION } from "./consts/collection";
import { config } from "dotenv";
config();

const activeCollections: [
  { name: string; metric_type: MetricType; vector_field_name: string },
  FieldType[]
][] = [[METNO_SEED_COLLECTION, metnoSeedSchema]];

const milvusClient = new MilvusClient({
  address: process.env.MILVUS_URL || "http://localhost:19530",
  token: process.env.MILVUS_TOKEN || "root:Milvus",
});

(async () => {
  try {
    for (const [collection, schema] of activeCollections) {
      const hasCollection = await milvusClient.hasCollection({
        collection_name: collection.name,
      });
      if (!hasCollection.value) {
        console.log(`📄 Creating [${collection.name}] collection...`);
        await milvusClient.createCollection({
          collection_name: collection.name,
          fields: schema,
          metric_type: collection.metric_type,
        });
        console.log(`✅ Success to create [${collection.name}] collection~!`);
      }

      const hasIndexInfo = await milvusClient.describeIndex({
        collection_name: collection.name,
        field_name: collection.vector_field_name,
      });

      if (!hasIndexInfo.status.error_code) {
        console.log(`(!) ${collection.name} already created index.`);
      } else {
        console.log(`📌 Creating [${collection.name}] collection's index...`);
        await milvusClient.createIndex({
          collection_name: collection.name,
          field_name: collection.vector_field_name,
          index_type: "IVF_FLAT",
          metric_type: collection.metric_type,
          params: {
            nlist: 128,
          },
        });
        console.log(`✅ Success to create [${collection.name}] index~!`);
      }
    }
  } catch (err) {
    console.error(`❌ Occured error\n`, err);
  }
})();

export default milvusClient;
