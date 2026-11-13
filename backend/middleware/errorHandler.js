
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

const statusCode =
    err.name === "ValidationError" || err.name === "CastError"
        ? 400
        : err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

export default errorHandler;
