interface ApiErrorOptions {
  errors?: unknown[];
  stack?: string;
  data?: unknown;
}

class ApiError extends Error {
  public readonly statusCode: number;

  public readonly data: unknown;

  public readonly success = false;

  public readonly errors: unknown[];

  constructor(statusCode: number, message?: string, errors?: unknown[], stack?: string);

  constructor(statusCode: number, message: string, options?: ApiErrorOptions);

  constructor(
    statusCode: number,
  message = "Something went wrong",
  errorsOrOptions: unknown[] | ApiErrorOptions = [],
  stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;

    if (Array.isArray(errorsOrOptions)) {
      this.errors = errorsOrOptions;
      this.data = null;
      if (stack) {
        this.stack = stack;
      }
    } else {
      const { errors = [], stack: stackOverride = "", data = null } = errorsOrOptions;
      this.errors = errors;
      this.data = data;
      if (stackOverride) {
        this.stack = stackOverride;
      }
    }

    if (!this.stack) {
      Error.captureStackTrace?.(this, this.constructor);
    }
  }
}

export { ApiError };
