import CustomError from "../consts/error";
import { ErrorMiddleware } from "../types";

const errorMiddleware: ErrorMiddleware = (err, _req, res, _next) => {
  if (err instanceof CustomError) {
    console.error("❌", err.message);
    console.error("From :: ", err.from);
    console.error(err.stack);
    const statusCode = err.statusCode;
    if (err.redirectUrl) {
      return res.status(statusCode).redirect(err.redirectUrl);
    }
    return res.status(statusCode).json({ message: err.message });
  }
  console.error("❌ Unknown Error...!");
  console.error(err);
  return res.status(500).json({
    message: "UNKOWN_SERVER_ERROR",
  });
};
export default errorMiddleware;
