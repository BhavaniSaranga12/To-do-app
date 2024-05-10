
import { useNavigate} from "react-router-dom"


import {  useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { loginStateAtom, todoStateAtom, userStateAtom } from "../atom";
import React, { useEffect, useState } from 'react';
import axios from "axios";



 const NavBar =  ()=>{
  const [user, setUser]=useRecoilState(userStateAtom)
  const settodoState= useSetRecoilState(todoStateAtom) 
 const [loginState,setloginState]= useRecoilState(loginStateAtom);
  useEffect(()=>{
      axios({
        method:'get',
        url:'/',
        withCredentials: true
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
       axios({
        method:'get',
        url:'/signout',
        withCredentials: true
       }).then((response)=>{
        
        console.log(response.data)
        setloginState(false);
        settodoState([])
       }).catch(error=> {
       console.log(error)
       })
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
