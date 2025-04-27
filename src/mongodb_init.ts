import { config } from "dotenv";
config();
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL || "")
  .then(() => console.log("Mongodb Connected"))
  .catch((err) => {
    console.log("(!) Fail to connect Mongodb");
    console.log(err);
  });

export default mongoose;
