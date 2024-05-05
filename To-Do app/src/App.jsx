import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes,Route , Navigate} from 'react-router-dom';
import './App.css'

import SignUp from './Components/Signup';
import SignIn from './Components/Signin';
import { Toaster} from 'react-hot-toast';
import Todo from './Components/ToDo';
import {  useRecoilValue } from 'recoil';
import NavBar from './Components/Navbar';
import { loginStateAtom } from './atom';

function NotFound() {
  return <h1 style={{textAlign: "center"}}>404 - Not Found</h1>;
}


function App() {
  const loginState= useRecoilValue(loginStateAtom);
 
    
  return (
    <>
    
    <Toaster/>
    <img id='butterfly' src="https://i.pinimg.com/736x/2a/06/8d/2a068d525ebd09354fb78bdebc32a213.jpg" alt="" />
    <BrowserRouter>
   <NavBar /> 
    <Routes>
      <Route path='/signup' element={ loginState? <Navigate to="/" replace /> : <SignUp />} /> 
      <Route path='/signin' element={loginState? <Navigate to="/" replace /> : <SignIn/>} />
      <Route path='/' element={<Todo/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  
    </>
  )
}



export default App
