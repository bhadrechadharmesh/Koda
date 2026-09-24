import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { protect } from "./middleware/protect.js";
import { getCurrUser } from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.use("/api/project",protect,proxyWithHeader(process.env.PROJECT_SERVICE));
app.use("/api/file",protect,proxyWithHeader(process.env.FILE_SERVICE));

app.get("/api/me",protect,getCurrUser)

app.get("/",(req,res)=>{
    res.json({msg:"hello from gateway"});
})

app.listen(port,()=>{
    console.log(`gateway server started at ${port}....`);
})