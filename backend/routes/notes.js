import express from 'express'
const router=express.Router();
import fetchUser from '../middleware/fetchUser.js';
import Notes from '../models/Notes.js';

router.get('/fetchallnotes',fetchUser,async (req,res)=>{
    try {
        const notes=await Notes.find({user:req.userId});
        res.json(notes)
    } catch (error) {
        console.log(error);
        return res.status(500).send({error:'Internal server error'})
    }
})

router.post('/addnote',fetchUser,async (req,res)=>{

    try {
        const {title,tag,description}=req.body;

        if(!title || !tag || !description ){
            return res.status(400).send({error:'Enter all the feild'})
        }
        const notes = new Notes({ title, description, tag, user: req.userId });

        //* saving notes
        const savedNote = await notes.save();
        res.json(savedNote);


    
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
  

})

router.put('/updatenote/:id',fetchUser,async (req,res)=>{
    const {title,description,tag}=req.body;
    const {id}=req.params;
   try {
    const note=await Notes.findById({_id:id});
    if(!note){
        return res.status(401).send({error:'Not found'});
        console.log(error);
    }

    if(note.user.toString() !== req.userId){
        return res.status(401).send("Not Allowed");
    }
    
    console.log(note);
    
    const notes=await Notes.findByIdAndUpdate({_id:id},{
        $set:{title,description,tag}
    },{new:true})

    res.json({notes, success : "Notes Updated Successfully"})

   } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
   }

})

router.delete('/deletenote/:id',fetchUser,async (req,res)=>{
    try {
        let note=await Notes.findById(req.params.id);
    if(!note){
        return res.status(401).send({error:'Not found'})
    }

    if(note.user.toString() !== req.userId){
        return res.status(401).send({error:'Not allowed'})
    }

    note=await Notes.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted", note: note }); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

   
})

router.get('/notes/:id',fetchUser,async (req,res)=>{
    try {
       const {id}=req.params;
       const notes=await Notes.findById({_id:id});
       console.log(notes); 

       if(notes){
        res.status(201).json(notes)
       }else{
         res.status(404).json({success:"Not found"})
       }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:'Internal Server error'})
    }
})


export default router;