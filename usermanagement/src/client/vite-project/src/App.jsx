import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/component/Login'
import Adminhome from './pages/Admin/Adminhome'
import Navbar from './pages/component/Navbar'
import Register from './pages/Admin/Register'
import Lawyer from './pages/lawyer/lawyer';
import Clienthome from './pages/client/Clienthome'
//import Addclient from './pages/client/Addclient';
import Clientprofile from './pages/client/clientprofile';
import Editprofile from './pages/client/Editprofile'
import Viewprofile from "./pages/client/Viewprofile";
//import Caseinitiation from './pages/client/Caseinitiation'
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
       
        <Route path="/clientprofile" element={<Clientprofile/>}/>
        <Route path="/edit-profile" element={<Editprofile/>}/>
        <Route path="/view-profile/:clientId" element={<Viewprofile />} />
   



      </Routes>
    </div>
  )
}

export default App
