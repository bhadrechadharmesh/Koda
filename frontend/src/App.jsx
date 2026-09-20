import React, { useEffect } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'

import {me} from "./features/me.js"
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice.js'

const App = () => {
  const dispatch = useDispatch()
  
  useEffect(()=>{
    const fetch = async()=>{
      const data = await me()
      dispatch(setUserData(data))
    }

    fetch()
  },[])

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Dashboard/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
