import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import todoRoutes from "./routes/todoRoutes"
import authRoutes from "./routes/authRoutes";
import db from "./config/db";
import passportConfig from "./middleware/passport";

const database = db;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passportConfig.initialize())

app.use("/todo",todoRoutes);
app.use("/auth",authRoutes);
app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use((err:any, _req:Request, res:Response, _next:NextFunction) => {
    console.error(err); 
    res.status(500).json({ error: "An error occurred" });
});

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

