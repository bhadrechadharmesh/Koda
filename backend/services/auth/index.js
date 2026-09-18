import express from "express";
import dotenv from "dotenv"
// import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
// app.use(cookieParser);

app.get("/",(req,res)=>{
    res.json({msg:"hello from auth service"});
})

app.listen(port,()=>{
    console.log(`auth service started at ${port}....`);
})