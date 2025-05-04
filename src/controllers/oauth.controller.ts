import { CLIENT_URL, TOKEN_KEY } from "../consts/app";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from "../consts/oauth";
import { AppController } from "../types";
import axios from "axios";
import { getSignedToken } from "../utils/token";
import CustomError, { getErrorArgs } from "../consts/error";
import { SUCCESS_STATUS_CODE } from "../consts/api";

const googleOauthSignin: AppController = (_req, res, next) => {
  const baseEntryUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  if (
    [GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI].some(
      (v) => !v
    )
  ) {
    return next(
      new CustomError(
        getErrorArgs("INVALID_REQUEST_INPUT"),
        "googleOauthSignin > Invalid oauth request value."
      )
    );
  }
  const resultUrl = `${baseEntryUrl}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
  return res.redirect(resultUrl);
};

const googleOauthCallback: AppController = async (req, res, next) => {
  const { code } = req.query;

  const baseEntryTokenUrl = "https://oauth2.googleapis.com/token";
  try {
    const tokenRequest = await axios.post(baseEntryTokenUrl, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    if (!tokenRequest.data) {
      return next(
        new CustomError(
          getErrorArgs("INVALID_REQUEST_INPUT"),
          "googleOauthCallback > Invalid tokenRequest.data",
          `${CLIENT_URL}/signin-error?type=INVALID_CODE`
        )
      );
    }

    const { access_token } = tokenRequest.data;

    const baseEntryProfileUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
    const profileRequest = await axios.get(baseEntryProfileUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!profileRequest.data) {
      return next(
        new CustomError(
          getErrorArgs("INVALID_REQUEST_INPUT"),
          "googleOauthCallback > Invalid profileRequest.data",
          `${CLIENT_URL}/signin-error?type=INVALID_TOKEN`
        )
      );
    }

    const { email, picture, name } = profileRequest.data;

    const signedToken = getSignedToken({ email, picture, name });
    res.cookie(TOKEN_KEY, signedToken, { path: "/", httpOnly: true });
    return res
      .status(SUCCESS_STATUS_CODE.GET)
      .redirect(`${CLIENT_URL}/signin-success`);
  } catch (err) {
    return next(
      new CustomError(
        getErrorArgs("UKNOWN_ERROR"),
        "googleOauthCallback",
        `${CLIENT_URL}/signin-error?type=SERVER_ERROR`
      )
    );
  }
};

export { googleOauthSignin, googleOauthCallback };
