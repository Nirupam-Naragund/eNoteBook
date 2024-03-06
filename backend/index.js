import connectToMongo from "./database/db.js";
import express from "express";
import cors from 'cors'
import auth from './routes/auth.js'
import notes from './routes/notes.js'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
// import 'dotenv/config.js'



connectToMongo();
const app=express();
const port=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
dotenv.config();

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.use('/api/auth',auth);
app.use('/api/notes',notes);

app.listen(port,()=>{
    console.log(`Server listening at port:${port}`);
})

