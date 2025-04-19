import { MetricType } from "@zilliz/milvus2-sdk-node";

const METNO_SEED_COLLECTION: {
  name: string;
  metric_type: MetricType;
  vector_field_name: string;
} = {
  name: "mento_seed",
  metric_type: MetricType.COSINE,
  vector_field_name: "mento_seed_vector",
};

export { METNO_SEED_COLLECTION };
