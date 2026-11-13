import jwt from "jsonwebtoken";

// admin login
const adminLogin = async (req, res,next) => {
  try {
    const { email, password } = req.body;

    // 1. check that both fields were sent
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    // 2. compare with the values saved in .env
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // 3. create a token that says "this is the admin", valid for 1 day
            const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.json({ success: true, token });
    }

    // 4. wrong email or password
    return res.json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    next(error)
  }
};

export { adminLogin };