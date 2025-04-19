import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../consts/app";

const getSignedToken = (payload = {}) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  } catch (err) {
    console.error({ "getSignedToken - error": err });
    return null;
  }
};

const getDecodedToken = (signedToken = "") => {
  if (!signedToken || !signedToken.trim()) return null;
  try {
    const decoded = jwt.decode(signedToken);
    return decoded;
  } catch (err) {
    console.error({ "getDecodedToken - err": err });
    return null;
  }
};

export { getSignedToken, getDecodedToken };
