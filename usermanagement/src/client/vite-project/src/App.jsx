import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/component/Login'
import Adminhome from './pages/Admin/Adminhome'
import Navbar from './pages/component/Navbar'
import Register from './pages/component/Register'
import Lawyer from './pages/lawyer/lawyer';
import Clienthome from './pages/client/Clienthome'
import Addclient from './pages/client/Addclient'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/adminhome' element={<Adminhome/>}/>
        <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/lawyer" element={<Lawyer/>}/>
        <Route path="/clienthome" element={<Clienthome/>}/>
        <Route path="/addclient" element={<Addclient/>}/>

      </Routes>
    </div>
  )
}

export default App
