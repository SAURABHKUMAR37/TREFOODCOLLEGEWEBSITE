
import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from "multer";

const foodRouter = express.Router();

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Only JPG, PNG or WEBP images are allowed");
      error.statusCode = 400;
      cb(error);
    }
  },
});

foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", adminAuth, removeFood);
foodRouter.post("/update", adminAuth, upload.single("image"), updateFood);

export default foodRouter;
