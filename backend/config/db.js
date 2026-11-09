import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/food-del`);
        console.log("DB connected");
    } catch (error) {
        console.log("Database connection failed:", error);
    }
};