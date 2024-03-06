import React, { useState } from 'react'
import MyContext from './myContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';



function MyState(props) {

  const [loading , setLoading]=useState(false)
  const [allNotes , setAllNotes]=useState([]);

  

  const getAllNotes=async()=>{

    setLoading(true);
    try {
      const res=await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/fetchallnotes`,{
        method:'GET',
        headers:{
          'Content-type':'application/json',
          'auth-token':localStorage.getItem('token')
        }
      })
    const notesData=await res.json();
    setAllNotes(notesData);
    setLoading(false)

    } catch (error) {
      console.log(error);
      setLoading(false)
      res.status(500).json({error:'Problem in fetching the notes'})
    }
  }
  
  const [title,setTitle]=useState('')
  const [tag ,setTag]=useState('');
  const [description,setDescription]=useState('');

  const addNote=async ()=>{
    
    const res=await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/addnote`,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'auth-token':localStorage.getItem('token')
      },
      body:JSON.stringify({title,description,tag})
    })

    const noteData=await res.json();

    getAllNotes();

    if(noteData.error){
      toast.error(noteData.error)
        // console.log(noteData.error)
      } else {
        toast.success(noteData.success);
        // console.log(noteData.success)
      }
      setTitle("");
      setDescription("");
      setTag("");

  
    }

  const deleteNote=async(id)=>{
  const res=await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/deletenote/${id}`,{
    method:'DELETE',
    headers:{
      'Content-type':'application/json',
      'auth-token':localStorage.getItem('token')
    },
  });

  const noteData=await res.json();
  getAllNotes();

  toast.success(noteData.success)
  }  


  

  return (
    <MyContext.Provider value={{allNotes,getAllNotes,loading,title, setTitle, description, 
      setDescription, tag, setTag,
      addNote , deleteNote}} >
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState