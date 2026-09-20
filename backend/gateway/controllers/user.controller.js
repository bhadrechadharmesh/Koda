export const getCurrUser = async (req,res)=>{
    try{
        return res.status(200).json(req.user)
    }catch(err){
        return res.status(500).json({message:`get current user error ${err}`});
    }
}