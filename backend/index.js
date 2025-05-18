import express, { json } from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import  staticRoutes from "./routes/static.routes.js"
import userRoutes from "./routes/user.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();
//for parsing json objects
app.use(express.json())
//for parsing cookies
app.use(cookieParser())
//for cross origin connection
app.use(cors({
       origin: 'http://localhost:5173', // Your frontend URL (assuming you're using Vite)
       credentials: true  // This allows cookies to be sent and received
     }))
//all routes
app.use("/",staticRoutes)
app.use("/user",userRoutes)


mongoose.connect(process.env.MONGODB_URL)
       .then(()=>{
              console.log("Connection established successfully")
              app.listen(process.env.PORT,()=>{
                     console.log("server is running on 3000 PORT")
              });
       })
       .catch((error)=>{
              console.log(error)
       })
