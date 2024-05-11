
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { loginStateAtom, todoStateAtom } from "../atom";
import { useRecoilState, useSetRecoilState } from "recoil";
import toast from 'react-hot-toast';

export default function Todo(){
  const setloginState = useSetRecoilState(loginStateAtom);
  const [todoState, settodoState]= useRecoilState(todoStateAtom)
  const [titleError, setTitleError]= useState('')
  const [desError, setDesError]= useState('');

    const [title, setTitle]=useState("");
    const [des, setDes]=useState('');
   
   
    const handleonchange= (event) => {
      setTitle(event.target.value); 
      setTitleError('');
      
     }


      function handleAdd () {

        axios({
          method: 'post',
          url: '/api/add-task',
          data: {
            title: title, 
            des: des,
            
          },
          withCredentials: true
        })
        .then(response => {
          console.log('Response:', response.data);
         if(response.data.status) {
          setTitle('')
          setDes('')
          settodoState(response.data.todos)
          console.log(response.data.todos)
          toast.success(response.data.message);
         }
         else {
          console.log(response)
          toast.error(response.data.message);
          settodoState([])
          setloginState(false);
          
         }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
           
            const validationErrors = error.response.data.error;

            if (validationErrors) {
              if(validationErrors.length==2){
                setTitleError(validationErrors[0].message);
                setDesError(validationErrors[1].message);
              }
              else if(validationErrors[0].path[0]=="title")
              setTitleError(validationErrors[0].message);
              else if(validationErrors[0].path[0]=="des"){
                setDesError(validationErrors[0].message);
              }
              
              console.log(validationErrors);
            }
            else {
              toast.error(error.response.data.message);
              settodoState([])
              setloginState(false);
                console.log('Error:', error);
            }
        } 
        
        else {
         
          toast.error("Internal server error");
            console.log('Error:', error);
        }
         
        });
        
      }



      function handleUpdate(id){
      axios({
        url: '/api/updatetask/'+id,
        method: 'get',
        withCredentials: true
      }).then(response => {
        console.log(response.data);
        if(response.data.status){
        const updatedTodos= response.data.todos;
         settodoState(updatedTodos)
         toast.success(response.data.message);
        }
        else {
          toast.error(response.data.message);
          settodoState([])
          setloginState(false);
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
          settodoState([])
          setloginState(false);
        }
        else
        console.error('Error:', error);
      });
      
      
      
      }

      function handleDelete(id){
      
        axios({
          url: '/api/deletetask/'+id,
          method: 'get',
          withCredentials: true
        }).then(response => {
          console.log(response.data);
          if(response.data.status){
          const updatedTodos= response.data.todos;
           settodoState(updatedTodos)
           toast.success(response.data.message)
          }
          else {
            toast.error(response.data.message)
            setloginState(false);
            settodoState([])
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
              settodoState([])
              setloginState(false);
            }
            else
            console.error('Error:', error);
        });
        
        }
  
  return <>
  <p id='quote'>"Embrace the day with purpose, for every task completed is a step toward fulfillment"</p>
    <div id='container'><div id='left'>
    <input type="text" id='title' value={title} onChange={handleonchange} placeholder='Title' />
    { titleError? <span className='err-txt'>{titleError}</span> : null}
      <textarea type="text" rows={2} cols={25}  id='des' value={des} onChange={(event) => {
        setDes(event.target.value); 
      
      setDesError('')  
        
        }} placeholder='Description' style={{resize: 'none'}}/>
       {desError? <span className='err-txt'>{desError}</span>: null}
      <button  onClick={handleAdd}>add</button></div>
      <div id="right">
        <h2 id='heading'>Your todo list</h2>
        {todoState && todoState.length >0 ? ( <ul>
        {todoState.map((todo) => (
          <li key={todo._id}>
           
            <input type="checkbox" checked={todo.completed} onChange={()=> handleUpdate(todo._id)} />
            <div className='innertxt'><h3>{todo.title}</h3>
            <p>{todo.description}</p></div>
            <lord-icon
            src="https://cdn.lordicon.com/hjbrplwk.json"
            trigger="hover"
            onClick={()=> handleDelete(todo._id) }
            style={{width:"30px", height:"30px",}}>
            </lord-icon>
          </li>
        ))}
      </ul>): <ul>
      <li className='innertxt'>
      <h1>Oopsss no todos</h1>
    </li>
          {/* <div className='innertxt'><h1>Oopsss no todos </h1>
           </div> */}
      </ul>}
       </div>
      </div> 
      </>
  
  }
  