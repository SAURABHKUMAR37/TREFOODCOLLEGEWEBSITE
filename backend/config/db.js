import mongoose from "mongoose"
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

 export const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://saurabh37:saurabhsaurabh@cluster0.ylxi6oq.mongodb.net/food-del");
    console.log("db connected")
}

