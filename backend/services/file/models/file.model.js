import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"File",
        default:null
    },
    type:{
        type:String,
        enum : ["file","folder"],
        required:true
    },
    extension:{
        type:String,
        default : "",
    },language:{
        type:String,
        default:"plaintext",
    },
    size:{
        type:Number,
        default:0,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    
    
},{
    timestamps:true
})

export default mongoose.model("File",fileSchema);
