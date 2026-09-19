import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import {auth , googleProvider} from "../firebase.js"
import {login} from "./features/login.js"

const App = () => {
  const handleLogin = async ()=>{
    const data = await signInWithPopup(auth,googleProvider);
    // console.log(data)
    const token =  await data.user.getIdToken()
    console.log(token)

    const d = await login(token)

    console.log(d)
  }
  return (
    <div>
      <button onClick={handleLogin} >Continue with Google</button>
    </div>
  )
}

export default App
