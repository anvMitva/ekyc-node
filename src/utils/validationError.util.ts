// @ts-nocheck
import { ApiError } from "../utils/ApiError.js";

class ValidationError extends ApiError {
  constructor(message, errors = []) {
    super(400, message, errors);
  }
}

export { ValidationError };
