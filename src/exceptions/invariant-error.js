import ClientError from "./client-error.js";

class InvariantError extends ClientError {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "InvariantError";
  }
}

export default InvariantError;
