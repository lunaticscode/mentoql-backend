import { MilvusClient } from "@zilliz/milvus2-sdk-node";

const milvusClient = new MilvusClient({
  address: "http://localhost:19530",
  token: "root:Milvus",
});

milvusClient
  .createDatabase({ db_name: "humanwater_test" })
  .then((res) => {
    console.log("Milvus running");
  })
  .catch((err) => {
    console.log(err);
    return null;
  });

export default milvusClient;
