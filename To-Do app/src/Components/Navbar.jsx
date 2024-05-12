
import { useNavigate} from "react-router-dom"


import {  useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loginStateAtom, todoStateAtom, userStateAtom } from "../atom";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import toast from "react-hot-toast";



 const NavBar =  ()=>{
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

         if(error.response.status===401 || error.response.status===401) {
         localStorage.removeItem('token');
       
          toast.error(error.response.data.message);
         }
         else{
          toast.error(error.response.data.message);
         }

       });
  
  },[])
 
        const navigate= useNavigate();
    const handleonclick= ()=>{
        navigate('/signup', {replace: true})
    }
  

    const handleLogoClick= ()=>{
        navigate('/')
    }
    const handleSignOut=()=>{
      setloginState(false);
        settodoState([])
        localStorage.removeItem('token')
        toast.success('successfully signed out')
    }
    return <div id="nav-bar">
        
    <h1 onClick={handleLogoClick}>To-Do App</h1>
    <ul id="nav-options">
    <li id="opt1" className="opt" onClick={handleLogoClick}>Home</li>
    {loginState? (
     <li id="opt2" className="opt" onClick={handleSignOut}>Sign out</li>)
     :<li id="opt3" className="opt" onClick={handleonclick}>Sign up</li>}
     {loginState?<li id="opt4">{user.toUpperCase()}</li> : null}

     </ul>
    </div>
   
         
    
}
   
export default NavBar;
