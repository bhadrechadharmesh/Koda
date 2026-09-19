import {api} from "../utils/axios.js"

export const login = async (token) =>{
    try{
        const {data} = await api.post("/api/auth/login",{token})

        return data
    }catch(err){
        console.log(err)
        return null
    }
}