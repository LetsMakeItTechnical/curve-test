class AppError extends Error {
  statusCode: number;

  status: string;

  isOperational: boolean;

  failureLine: number;

  constructor(
    message: string | undefined,
    statusCode: number,
    failureLine = 0
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.failureLine = failureLine;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
