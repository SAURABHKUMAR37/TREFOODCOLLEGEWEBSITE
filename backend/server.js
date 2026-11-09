import express from "express"
import dotenv from "dotenv";
dotenv.config();

import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"

const app=express()
const port=4002
 
app.use(express.json())
app.use(cors())

app.use('/api/food',foodRouter)
app.use("/images",express.static('uploads'))

connectDB();



app.get('/',(req,res)=>{
    console.log("server start")
    res.send("Server is working!");
})

app.listen(port,()=>{
    console.log(`server running on port no http://localhost:4002`)
})