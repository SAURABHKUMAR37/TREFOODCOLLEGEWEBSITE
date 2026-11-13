import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Please login again."
        });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(token_decode.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists"
            });
        }

        req.body = req.body || {};
        req.body.userId = token_decode.id;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export default authMiddleware;