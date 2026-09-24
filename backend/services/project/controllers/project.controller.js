import Project from "../models/project.model.js";
import redis from "../../../shared/redis.js"

export const createProject = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "userid is required" });
    }
    
    const key = `project-${userId}`

    await redis.del(key);

    const { name, description } = req.body;

    const project = await Project.create({
      owner: userId,
      name,
      description,
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ message: `create project error : ${err}` });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "userid is required" });
    }

    const key = `project-${userId}`
    const cachedProjects = await redis.get(key)
    if(cachedProjects){
      return res.status(200).json(JSON.parse(cachedProjects));
    }

    const projects = await Project.find({
      owner: userId,
    }).sort({ updatedAt: -1 });

    await redis.set(key,JSON.stringify(projects))

    return res.status(201).json(projects);
  } catch (err) {
    return res.status(500).json({ message: `get projects error : ${err}` });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if(!project){
        return res.status(404).json({message:"project not found"})
    }

    project.lastOpenedAt = new Date();

    await project.save();

    return res.status(201).json(project);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `get project by id error : ${err}` });
  }
};

export const getStarredProjects = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "userid is required" });
    }

    const key = `starred-project-${userId}`
    const cachedProjects = await redis.get(key)
    if(cachedProjects){
      return res.status(200).json(JSON.parse(cachedProjects));
    }

    const projects = await Project.find({
      owner: userId,
      starred: true,
    }).sort({ updatedAt: -1 });

    await redis.set(key,JSON.stringify(projects))

    return res.status(201).json(projects);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `get starred project error : ${err}` });
  }
};

export const toggleStar = async (req,res) => {
  try {

    const userId = req.headers["x-user-id"]
    if(!userId){
      return res.status(401).json({message:"userid is required"})
    }

    const {id} = req.params

    const project = await Project.findById(id)

    const key =  `starred-project-${userId}`
    await redis.del(key)

    const key2 =  `project-${userId}`
    await redis.del(key2)

    if(!project){
        return res.status(404).json({message:"project not found"})
    }

    project.starred = !project.starred
    await project.save()

    return res.status(201).json(project);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `toggle starred project error : ${err}` });
  }
};

export const deleteProject = async(req,res)=>{
    try{

        const userId = req.headers["x-user-id"]
        if(!userId){
            return res.status(401).json({message:"userid is required"})
        }

        const {id} = req.params

        const project = await Project.findByIdAndDelete(id);

        if(!project){
            return res.status(404).json({message:"project not found"});
        }

        const key =  `project-${userId}`
        await redis.del(key)

        const starredKey = `starred-project-${userId}`
        await redis.del(starredKey)

        return res.status(200).json(project)

    }catch(err){ 
        return res.status(500).json({message:`delete project error : ${err}`})
    }
}