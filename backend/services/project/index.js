import express from "express";
import dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import router from "./routes/project.route.js"
dotenv.config();

const app = express();
const port = process.env.PORT || 8002;

app.use(express.json());
app.use("/",router)

app.get("/",(req,res)=>{
    res.json({msg:"hello from project service"});
})

app.listen(port,()=>{
    connectDB();
    console.log(`project service started at ${port}....`);
})