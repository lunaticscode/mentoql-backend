import { CLIENT_URL } from "../consts/app";
import { AppController } from "../types";

const STRCIT_ALLOWED_REFERERS = [CLIENT_URL];
const NOT_BOT_ALLOWER_REFERERS = [CLIENT_URL];
type RefererValidatorModes = "strict" | "not-bot";
const refererValidator: (mode: RefererValidatorModes) => AppController =
  (mode) => (req, res, next) => {
    const referer = req.headers.referer || "";

    const allowedStandard =
      mode === "strict" ? STRCIT_ALLOWED_REFERERS : NOT_BOT_ALLOWER_REFERERS;

    const isAllowed = allowedStandard.some((allowedRefer) =>
      referer.startsWith(allowedRefer)
    );
    if (!isAllowed) {
      return res.status(403).json({
        isError: true,
        message: "INVALID_REFERER",
      });
    }

    next();
  };

export { refererValidator };
