import { HttpStatusCode } from "axios";

type Methods = "GET" | "POST";
const SUCCESS_STATUS_CODE: { [method in Methods]: number } = {
  GET: HttpStatusCode.Ok,
  POST: HttpStatusCode.Created,
};

export { SUCCESS_STATUS_CODE };
