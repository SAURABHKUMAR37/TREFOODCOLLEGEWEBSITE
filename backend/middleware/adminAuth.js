
import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login again"
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (
            token_decode.role !== "admin" ||
            token_decode.email !== process.env.ADMIN_EMAIL
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default adminAuth;
