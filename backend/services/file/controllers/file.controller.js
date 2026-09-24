import File from "../models/file.model.js";
import { buildFileTree } from "../utils/buildTree.js";
export const createRootFolder = async(req,res)=>{
    try{
        const{name,projectId} = req.body;
        const userId = req.headers["x-user-id"];
        if(!userId){
            return res.status(401).json({message:"User not authenticated"});
        }
        
        if(!name || !projectId ){
            return res.status(400).json({message:"Bad request: name and projectId are required"});
        }

        const existingRootFolder = await File.findOne({projectId,parentId:null,isDeleted:false});
        if(existingRootFolder){
            return res.status(400).json({message:"Root folder already exists"});
        }

        const rootFolder = new File({
            name,
            projectId,
            owner:userId,
            type:"folder",
            parentId:null
        });
        await rootFolder.save();
        return res.status(201).json({message:"Root folder created successfully",rootFolder});
    }catch(err){
        return res.status(500).json({message:`Failed to create root folder: ${err.message}`});
    }
}

export const createFolder = async(req,res)=>{
    try{
        const{name,projectId,parentId} = req.body;
        const userId = req.headers["x-user-id"];
        if(!userId){
            return res.status(401).json({message:"User not authenticated"});
        }
        
        if(!name || !projectId || !parentId){
            return res.status(400).json({message:"Bad request: parentId, name and projectId are required"});
        }

        const existingFolder = await File.findOne({projectId,parentId,name,isDeleted:false});
        if(existingFolder){
            return res.status(400).json({message:"Folder with this name already exists"});
        }

        const folder = new File({
            name,
            projectId,
            owner:userId,
            type:"folder",
            parentId
        });
        await folder.save();
        return res.status(201).json({message:"Folder created successfully",folder});
    }catch(err){
        return res.status(500).json({message:`Failed to create folder: ${err.message}`});
    }
}

export const createFile = async(req,res)=>{
    try{
        const{name,projectId,parentId,content="",language="plaintext"} = req.body;
        const userId = req.headers["x-user-id"];
        if(!userId){
            return res.status(401).json({message:"User not authenticated"});
        }
        
        if(!name || !projectId || !parentId){
            return res.status(400).json({message:"Bad request: parentId, name and projectId are required"});
        }

        const existingFile = await File.findOne({projectId,parentId,name,isDeleted:false});
        if(existingFile){
            return res.status(400).json({message:"File with this name already exists"});
        }

        const extension = name.includes(".")?name.split(".").pop():"";

        const file = new File({
            name,
            projectId,
            owner:userId,
            type:"file",
            language,
            extension,
            content,
            size:content.length,
            parentId : parentId|| null
        });
        await file.save();
        return res.status(201).json({message:"File created successfully",file});
    }catch(err){
        return res.status(500).json({message:`Failed to create file: ${err.message}`});
    }
}

export const updateFile = async(req,res)=>{
 try{    
    const {name,content} = req.body;
    const userId = req.headers["x-user-id"];
    if(!userId){
        return res.status(401).json({message:"User not authenticated"});
    }

    const file = await File.findOne({
        _id : req.params.id,
        owner : userId,
        isDeleted :false
    })

    if(!file){
        return res.status(400).json({message : "file not found"})
    }

    const extension = name.includes(".") ? name.split(".").pop():"";
    
    if(name){
        file.name = name;
        file.extension = extension
    }

    if(content !== undefined){
        file.content = content;
        file.size = content.length
    }

    await file.save();
    
    return res.status(200).json({message:"file updated" , file});}

    catch(err){
        return res.status(500).json({message:`Failed to update file: ${err.message}`});
    }
}

export const DeleteFile = async(req,res)=>{
 try{
    const userId = req.headers["x-user-id"];

    const file = await File.findByIdAndUpdate(req.params.id,{isDeleted:true},{new: true})

    if(!file){
        return res.status(400).json({message : "file not found"})
    }

    return res.status(200).json({message:"file deleted successfully" , file});}

    catch(err){
        return res.status(500).json({message:`Failed to delete file: ${err.message}`});
    }
}

export const getFile = async(req,res)=>{
 try{
    const userId = req.headers["x-user-id"];
    if(!userId){
        return res.status(401).json({message:"User not authenticated"});
    }

    const file = await File.findOne({
        _id : req.params.id,
        owner : userId,
        isDeleted :false
    });
    if(!file){
        return res.status(400).json({message : "file not found"})
    }
    return res.status(200).json({message:"file found" , file});
    }
    catch(err){
        return res.status(500).json({message:`Failed to get file: ${err.message}`});
    }
}

export const getTree = async(req,res)=>{
    try{
        const userId = req.headers["x-user-id"];
        if(!userId){
            return res.status(401).json({message:"user not authenticated"})
        }

        const {projectId} = req.params;
        if(!projectId){
            return res.status(400).json({message:"project id is required"})
        }

        const files = await File.find({
            projectId,
            owner:userId,
            isDeleted:false
        }).sort({name:1,type:-1});

        if(!files){
            return res.status(400).json({message:"no files found"})
        }

        const tree = buildFileTree(files);
        return res.status(200).json({message:"tree found" , tree});
    }catch(err){
        return res.status(500).json({message:`Failed to get tree: ${err.message}`});
    }
}