import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import proxy from "express-http-proxy";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

app.use(cookieParser);
app.use(morgan("dev"));

app.use("/auth",proxy(process.env.AUTH_SERVICE))

app.get("/",(req,res)=>{
    res.json({msg:"hello from gateway"});
})

app.listen(port,()=>{
    console.log(`gateway server started at ${port}....`);
})