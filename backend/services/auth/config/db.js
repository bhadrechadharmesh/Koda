import mongoose from "mongoose"

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("auth db connected");
    }catch(err){
        console.log(err);
    }
}