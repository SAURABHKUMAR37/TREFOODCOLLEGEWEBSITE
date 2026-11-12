import express from "express"
import dotenv from "dotenv";
dotenv.config();

import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app=express()
const port=4002
 
app.use(express.json())
app.use(cors())

app.use('/api/food',foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order/",orderRouter)

connectDB();



app.get('/',(req,res)=>{
    console.log("server start")
    res.send("Server is working!");
})

app.listen(port,()=>{
    console.log(`server running on port no http://localhost:4002`)
})