import { DataType, FieldType } from "@zilliz/milvus2-sdk-node";
import milvusClient from "../db_init";

const fields: FieldType[] = [
  {
    name: "test_c_id",
    data_type: DataType.Int64,
    is_primary_key: true,
    autoID: false,
  },
  {
    name: "test_c_vector",
    data_type: DataType.FloatVector,
    dim: 5,
  },
  {
    name: "test_c_varchar",
    data_type: DataType.VarChar,
    max_length: 512,
  },
];

milvusClient
  .createCollection({ collection_name: "test_collection_1", fields: fields })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
