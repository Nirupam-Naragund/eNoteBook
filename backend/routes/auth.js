import express from 'express'
import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const router=express.Router();
import 'dotenv/config';
import fetchUser from '../middleware/fetchUser.js';

router.post('/signup',async (req,res)=>{
    const {name,email,password}=req.body;
    try {

    if(!name || !email || !password ){
        return res.status(400).send("Enter all the feilds");
    }
    

    if(!email.includes('@')){
        return res.status(400).send("Enter a valid email");
    }

    const user=await User.findOne({email});

    if(user){
        res.status(400).send("User already Exists")
    }

    const salt=await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser=await User({
        email,name,
        password:hashedPassword
    })

    await newUser.save();
    console.log(newUser);
    res.status(201).json({success: "Signup Successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).send("Signup failed");
      
    }
    
})

router.post('/login', async(req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email || !password){
            return res.status(400).json({error:'Enter all the feilds'});
        }

        if(!email.includes('@')){
            return res.status(400).json({error:'Enter a valid email'})
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({error:'User not found'});
        }

        const doMatch=await bcrypt.compare(password,user.password);
        console.log(doMatch);
        
        if(doMatch)
        {
            const token=jwt.sign({ userId: user.id }, "" + ({}).JWT_SECRET, {
                expiresIn: '7d'
            })
  
            res.status(201).json({ token })
        }
        else {
            res.status(404).json({ error: 'Email And Password Not Found' })
        }
        


    } catch (error) {
        res.status(500).json({error:'Internal Server error'})
        console.log(error);
    }
})

router.get('/getuser',fetchUser,async(req,res)=>{

    try {
        const userId=req.userId;
        console.log(userId);
        const user = await User.findById(userId).select('-password')
        res.send(user)
        console.log(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send({error:'Internal server error'});
    }

})


export default router