import { config } from "dotenv";
config();

const OPENROUTER_AI_BASEURL = "https://openrouter.ai";
const OPENROUTER_AI_KEY = process.env.OPENROUTER_AI_KEY;
const OEPNROUTER_LLM_MODEL = "meta-llama/llama-4-maverick:free";
export { OPENROUTER_AI_BASEURL, OPENROUTER_AI_KEY, OEPNROUTER_LLM_MODEL };
