import express from "express";
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import router from "./routes/file.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8003;

app.use(express.json());

app.use("/",router);

app.get("/",(req,res)=>{
    res.json({msg:"hello from file service"});
})

app.listen(port,()=>{
    connectDB();
    console.log(`file service started at ${port}....`);
})