export const handleCastErrorDB = (err: Record<string, any>) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return {
    error_type: `Invalid ${err.path}`,
    errors: [{ message }],
  };
};

export const handleDuplicateFieldsDB = (err: Record<string, any>) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate value: ${value}, Please use another value!`;

  return {
    error_type: "Duplicate value",
    errors: [{ message }],
  };
};

export const handleValidationErrorDB = (err: Record<string, any>) => {
  const errors = Object.values(err.errors).map((el: any) => ({
    message: el.message,
  }));

  return {
    error_type: "Invalid input data",
    errors,
  };
};

export const sendError = (error: Record<string, any>) => {
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  return error;
};
