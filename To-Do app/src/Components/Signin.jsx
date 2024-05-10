import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {  useSetRecoilState } from "recoil";
import { loginStateAtom,todoStateAtom,userStateAtom } from "../atom";
axios.defaults.withCredentials=true;



export default function SignIn(){
const navigate= useNavigate();
const setUser=useSetRecoilState(userStateAtom)
  const setloginState= useSetRecoilState(loginStateAtom);
  const settodoState= useSetRecoilState(todoStateAtom)
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");


   const handleSignIn= (e)=>{
      e.preventDefault();
      
     
      axios({
         method: 'post',
         url: 'https://to-do-app-server-fawn.vercel.app/signin',
         headers: { 'Content-Type': 'application/json' },
         data: {
           
           email: email.toString(),
           password: password.toString()
         }
       })
       .then(response => {
         console.log('Response:', response.data);
         if(response.data.status){
          toast.success(response.data.message);
          setloginState(true);
         const name= response.data.details.name
          setUser(name);
          settodoState(response.data.details.todos)
         navigate('/', {replace: true});
         
         }
         else {
          toast.error(response.data.message);
         }
        
         
       }).catch(error => {
        toast.error(error.response.data.message);
         console.error('Error:', error);
       });
   }
return <>
  <div className="formdata">
  <h2>Sign in</h2>
   <form onSubmit={handleSignIn}> 
   <div><label htmlFor="email">Email:</label> <br />
     <input type="email" name="email" id="email" value={email} onChange={ (event)=> {setEmail(event.target.value)}} required/></div> 
     <div><label htmlFor="pwd">Password: </label> <br />
     <input type="password" name="pwd" id="pwd" value={password} onChange={ (event)=> {setPassword(event.target.value)}} required/></div>
    <button type="submit">Submit</button>
    
   </form>
   </div>
</>
}