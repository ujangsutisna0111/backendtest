import ClientError from "./client-error.js";

class ForbiddenError extends ClientError {
  constructor(message = "Anda tidak memiliki akses") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export default ForbiddenError;
