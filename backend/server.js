import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectCloudinary } from "./config/cloudinary.js";
dotenv.config();
const app = express();
const allowedOrigins = (
  process.env.CLIENT_URLS || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import errorHandler from "./middleware/errorHandler.js";

const port = process.env.PORT || 4002;
app.use(express.json());

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order/", orderRouter);
app.use("/api/admin", adminRouter);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server is working!");
});

const startServer = async () => {
  try {
      await connectCloudinary();
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
