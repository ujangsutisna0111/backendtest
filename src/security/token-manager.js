import jwt from "jsonwebtoken";
import InvariantError from "../exceptions/invariant-error.js";

const TokenManager = {
  generateAccessToken: (payload) => {
    if (!process.env.APP_SECRET_KEY) {
      throw new Error("APP_SECRET_KEY is not configured");
    }

    return jwt.sign(payload, process.env.APP_SECRET_KEY, {
      expiresIn: "3h",
    });
  },

  verify: (accessToken) => {
    try {
      const result = jwt.verify(accessToken, process.env.APP_SECRET_KEY);
      return result;
    } catch (e) {
      throw new InvariantError("Access token tidak valid");
    }
  },
};

export default TokenManager;
