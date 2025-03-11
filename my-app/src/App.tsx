import './App.css';
import React from 'react';
import Signup from './components/signup';
import Login from './components/login';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/home';
import Browse from './components/browse';
import MyProfile from './components/myprofile';
import CreateAuction from './components/createauction';
import UpdatePassword from './components/updatepassword';
import { Provider } from 'react-redux';
import SpecificAuction from './components/specificauction';
// import { useState } from 'react';
// import UserContext from './context/usernameContext';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element ={<Login/>}/>
        <Route path='/home/:name' element = {<Home/>}/>
        <Route path='/browse/:name' element = {<Browse/>}/>
        <Route path='/myprofile/:name' element = {<MyProfile/>}/>
        <Route path='/createauction/:name' element = {<CreateAuction/>}/>
        <Route path='/updatepassword/:name' element = {<UpdatePassword/>}/>
        <Route path='/specificauction/:name' element = {<SpecificAuction/>}/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
