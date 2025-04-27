import { DataType, FieldType } from "@zilliz/milvus2-sdk-node";

const mentoSeedSchema: FieldType[] = [
  {
    name: "mento_seed_id",
    data_type: DataType.Int64,
    is_primary_key: true,
    autoID: true,
  },
  {
    name: "mento_id",
    data_type: DataType.VarChar,
    max_length: 100,
  },
  {
    name: "mento_seed_vector",
    data_type: DataType.FloatVector,
    dim: 384,
  },
  {
    name: "mento_seed_question",
    data_type: DataType.VarChar,
    max_length: 300,
  },
  {
    name: "mento_seed_answer",
    data_type: DataType.VarChar,
    max_length: 2000,
  },
];
export default mentoSeedSchema;
