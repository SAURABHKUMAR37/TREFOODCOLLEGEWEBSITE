import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (!validator.isEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email",
    });
  }
  try {
const user = await userModel.findOne({
    email: email.trim().toLowerCase()
}).select("+password");    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//register user
const registerUser = async (req, res, next) => {
  const { name, password, email } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 2 characters",
    });
  }

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }
    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export { loginUser, registerUser };
