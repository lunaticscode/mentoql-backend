import { IncomingMessage } from "http";
import { TOKEN_KEY } from "../consts/app";
import { AppMiddleware } from "../types";
import { getDecodedToken, getSignedToken } from "../utils/token";

const authMiddleware: AppMiddleware = (req, res, next) => {
  const { cookies } = req;
  const token = cookies[TOKEN_KEY] || null;
  if (!token || !token.trim()) {
    return res
      .status(400)
      .json({ isError: true, message: "(!) Cannot read access token." });
  }
  const decodedToken = getDecodedToken(token);
  if (!decodedToken) {
    return res
      .status(401)
      .json({ isError: true, message: "(!) Invalid access token." });
  }
  const { email, picture, name } = decodedToken;
  const resignedToken = getSignedToken({ email, picture, name });
  req = Object.assign(req, { profile: { email, picture, name } });

  res.cookie(TOKEN_KEY, resignedToken, { path: "/", httpOnly: true });
  next();
};
export default authMiddleware;
