class ApiResponse<T = unknown> {
  public readonly statusCode: number;

  public readonly data: T;

  public readonly message: string;

  public readonly status: boolean;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.status = statusCode < 400;
  }
}

export { ApiResponse };
