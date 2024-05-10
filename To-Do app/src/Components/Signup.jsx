
import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loginStateAtom , userStateAtom} from "../atom";
axios.defaults.withCredentials=true;



export default function SignUp(){
  const setUser=useSetRecoilState(userStateAtom)
  const setloginState= useSetRecoilState(loginStateAtom);
   const navigate= useNavigate();
   const [name, setName]=useState("");
   const [email, setEmail]=useState("");
   const [password, setPassword]=useState("");

   

   const handleSignUp= (e)=>{
      e.preventDefault();
     
      axios({
         method: 'post',
         url: 'https://to-do-app-backend-nu.vercel.app/signup',
         headers: { 'Content-Type': 'application/json' },
         data: {
           name: name.toString(), 
           email: email.toString(),
           password: password.toString()
         }
       })
       .then(response => {
        console.log('Response:', response.data);
         if(response.data.status){
          toast.success(response.data.message);
          const name= response.data.details.name
          setUser(name);
          setloginState(true);
         
         navigate('/', {replace: true});
         }
         
  
       }).catch(error => {
        if (error.response && error.response.status === 409) {
          toast.error(error.response.data.message);
        }
        else
        toast.error("Error! Please try again");
         console.error('Error:', error);
       });
   }
return <div className="formdata">
    <h2>Sign up</h2>
   <form onSubmit={handleSignUp}> 
     <div><label htmlFor="name">Name:</label> <br />
     <input type="text" name="name" id="name" value={name} onChange={ (event)=> {setName(event.target.value)}} required/> </div>
     <div><label htmlFor="email">Email:</label> <br />
     <input type="email" name="email" id="email" value={email} onChange={ (event)=> {setEmail(event.target.value)}} required/> </div>
     <div><label htmlFor="pwd">Password: </label><br />
     <input type="password" name="pwd" id="pwd" value={password} onChange={ (event)=> {setPassword(event.target.value)}} required /></div>
    <button type="submit">Submit</button>
    <p>Already have an account? <span><Link to='/signin' id="link">Sign in</Link></span></p>
   </form>

</div>
}