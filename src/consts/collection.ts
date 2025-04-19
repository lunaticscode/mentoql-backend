import { MetricType } from "@zilliz/milvus2-sdk-node";

const METNO_SEED_COLLECTION: {
  name: string;
  metric_type: MetricType;
} = {
  name: "mento_seed",
  metric_type: MetricType.COSINE,
};

export { METNO_SEED_COLLECTION };
