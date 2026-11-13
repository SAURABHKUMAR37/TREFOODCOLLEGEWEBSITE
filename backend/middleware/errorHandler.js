const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode =
        err.name === "ValidationError" ||
        err.name === "CastError" ||
        err.name === "MulterError"
            ? 400
            : err.statusCode || 500;

    let message = err.message || "Internal Server Error";
    if (err.code === "LIMIT_FILE_SIZE") {
        message = "Image must be 2MB or smaller";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler;