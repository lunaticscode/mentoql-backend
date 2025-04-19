import { FieldType, MetricType, MilvusClient } from "@zilliz/milvus2-sdk-node";
import { metnoSeedSchema } from "./schemas";
import { METNO_SEED_COLLECTION } from "./consts/collection";

const activeCollections: [
  { name: string; metric_type: MetricType; vector_field_name: string },
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
        const hasCollection = await milvusClient.hasCollection({
          collection_name: collection.name,
        });

        if (!hasCollection.value) {
          console.log(`milvusClient createCollection ${collection.name}`);
          await milvusClient.createCollection({
            collection_name: collection.name,
            fields: schema,
            metric_type: collection.metric_type,
          });
        }

        const hasIndexInfo = await milvusClient.describeIndex({
          collection_name: collection.name,
          field_name: collection.vector_field_name,
        });

        if (!hasIndexInfo.status.error_code) {
          console.log(`(!) ${collection.name} already created index.`);
        } else {
          console.log(`milvusClient createIndex ${collection.name}`);
          await milvusClient.createIndex({
            collection_name: collection.name,
            field_name: collection.vector_field_name, // ← 벡터 필드 이름
            index_type: "IVF_FLAT", // 가장 기본적인 인덱스
            metric_type: collection.metric_type, // 임베딩에 적합
            params: {
              nlist: 128, // IVF_FLAT을 위한 파라미터
            },
          });
        }
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
