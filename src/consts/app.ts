import { config } from "dotenv";
config();

const APP_PORT = process.env.APP_PORT ?? 8080;
const OPENROUTER_AI_KEY = process.env.OPENROUTER_AI_KEY ?? "";
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const TOKEN_KEY = "mentoql-ac-token";
export { APP_PORT, OPENROUTER_AI_KEY, CLIENT_URL, JWT_SECRET, TOKEN_KEY };
