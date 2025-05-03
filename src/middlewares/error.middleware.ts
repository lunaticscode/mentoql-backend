import CustomError from "../consts/error";
import { ErrorMiddleware } from "../types";

const errorMiddleware: ErrorMiddleware = (err, _req, res, next) => {
  console.log("errorMiddleware", err);
  if (err instanceof CustomError) {
    console.error("❌", err.message);
    console.error("From :: ", err.from);
    console.error(err.stack);
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({
    message: "UNKOWN_SERVER_ERROR",
  });
};
export default errorMiddleware;
