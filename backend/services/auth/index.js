import express from "express";
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import router from "./routes/auth.route.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8001;


app.use(express.json());


app.use("/",router)

app.get("/",(req,res)=>{
    res.json({msg:"hello from auth service"});
})

app.listen(port,()=>{
    connectDB();
    console.log(`auth service started at ${port}....`);
})