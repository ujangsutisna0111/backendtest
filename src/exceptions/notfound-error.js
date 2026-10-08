import ClientError from "./client-error.js";

class NotFoundError extends ClientError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
