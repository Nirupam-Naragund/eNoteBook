// import jwt from 'jsonwebtoken';
// import 'dotenv/config';

// const fetchUser=async (req,res,next)=>{
//       const token=req.header('auth-token');
//       if(!token){
//         return res.status(400).send({error:'Token not found'})
//       }

//       try {
//        const {userId}=jwt.verify(userId,process.env.JWT_SECRET);
//        console.log("fetchuser",userId)
//         next(); 
//       } catch (error) {
//         console.log(error);
//         return res.status(400).send({error:'Please authenticate with a valid token'})
//       }
// }

// export default fetchUser

import 'dotenv/config';
import jwt from "jsonwebtoken";

const fetchUser = (req, res, next) => {
    //* Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        const { userId}   = jwt.verify(token,"" + ({}).JWT_SECRET);
        req.userId = userId
        console.log("fetchuser",userId)
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

export default fetchUser;