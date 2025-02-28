const errorHandling = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "internal_server_error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message || "Something went wrong",
  });
};

export default errorHandling;
