import { config } from "dotenv";
config();
// require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_KEY = "mentoql_ac_token";
export { JWT_SECRET, TOKEN_KEY };
