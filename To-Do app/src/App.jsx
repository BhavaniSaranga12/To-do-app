import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css'

import SignUp from './Components/Signup';
import SignIn from './Components/Signin';
import { Toaster} from 'react-hot-toast';
import Todo from './Components/ToDo';
import { RecoilRoot, useRecoilValue } from 'recoil';
import NavBar from './Components/Navbar';
import { loginStateAtom } from './atom';




function App() {
  const loginState= useRecoilValue(loginStateAtom);
 
    
  return (
    <>
    
    <Toaster/>
    <img id='butterfly' src="https://i.pinimg.com/736x/2a/06/8d/2a068d525ebd09354fb78bdebc32a213.jpg" alt="" />
    <BrowserRouter>
   <NavBar /> 
    <Routes>
      {!loginState  && <Route path='/signup' element={<SignUp/>} /> }
      {!loginState  && <Route path='/signin' element={<SignIn/>} />}
      <Route path='/' element={<Todo/>} />
    </Routes>
    </BrowserRouter>
  
    </>
  )
}



export default App
