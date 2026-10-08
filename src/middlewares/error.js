import ClientError from "../exceptions/client-error.js";
import response from "../utils/response.js";

const ErrorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return response(
      res,
      400,
      err.details.map((detail) => detail.message).join(", "),
    );
  }

  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message);
  }

  console.error("Unhandled error:", err);

  return response(res, 500, "Internal server error");
};

export default ErrorHandler;
