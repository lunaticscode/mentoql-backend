import { config } from "dotenv";
config();

const APP_PORT = process.env.APP_PORT;
const OPENROUTER_AI_KEY = process.env.OPENROUTER_AI_KEY;
export { APP_PORT, OPENROUTER_AI_KEY };
