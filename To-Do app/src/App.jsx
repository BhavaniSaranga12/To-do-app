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
import { loginStateAtom, todoStateAtom, userStateAtom } from "../atom";
function NotFound() {
  return <h1 style={{textAlign: "center"}}>404 - Not Found</h1>;
}


function App() {
  // const loginState= useRecoilValue(loginStateAtom);
 
  const [user, setUser]=useRecoilState(userStateAtom)
  const settodoState= useSetRecoilState(todoStateAtom) 
 const [loginState,setloginState]= useRecoilState(loginStateAtom);
 

const config= {
  withCredentials:true,
}
  


  useEffect(()=>{

      axios({
        url:'https://to-do-app-backend-nu.vercel.app/api/',
        config,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
      }).then(response => {
        navigate('/')
        console.log('Response:', response.data);
        
         if(response.data.status){
          setUser(response.data.details.name);
          setloginState(true);
          settodoState(response.data.details.todos);
          
         }
         
         }).catch(error => {
         console.error('Error:', error);

         if(error.response.status===401) {
         localStorage.removeItem('token');
       
          toast.error(error.response.data.message);
         }
        

       });
  
  },[])
    
  return (
    <>
    
    <Toaster/>
    <img id='butterfly' src="https://i.pinimg.com/736x/2a/06/8d/2a068d525ebd09354fb78bdebc32a213.jpg" alt="" />
    <BrowserRouter>
   <NavBar /> 
    <Routes>
      <Route path='https://to-do-app-frontend-seven.vercel.app/signup' element={ loginState? <Navigate to="/" replace /> : <SignUp />} /> 
      <Route path='https://to-do-app-frontend-seven.vercel.app/signin' element={loginState? <Navigate to="/" replace /> : <SignIn/>} />
      <Route path='/' element={<Todo/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  
    </>
  )
}



export default App
