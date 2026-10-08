import response from "../utils/response.js";
import jwt from "jsonwebtoken";
import AuthenticationError from "../exceptions/authentication-error.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.indexOf("Bearer ") !== -1) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return response(res, 401, error.message, null);
    }
  } else {
    return next(new AuthenticationError("Unauthorized"));
  }
};

export default authenticate;
