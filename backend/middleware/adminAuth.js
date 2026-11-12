import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // 1. read the token from the request headers
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // 2. verify the signature and expiry using JWT_SECRET
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // 3. check that this token really belongs to the admin
    if (
      token_decode.role !== "admin" ||
      token_decode.email !== process.env.ADMIN_EMAIL
    ) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // 4. all good, go to the next step (the real function)
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;