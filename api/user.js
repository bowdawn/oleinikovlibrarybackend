import { Router } from "express";
import User from "../models/User.js"
import bcrypt from"bcryptjs"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()
const router = Router();


 router.post("/registration", async (req, res) =>
 {
   const {firstname, lastname, email, role} = req.body
   const date = new Date()
   // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  
   try{
   const user = await User.create({
     firstname,
     lastname,
     email,
     password,
     role,
     date
   })
   res.status(200).json(user) }
   catch (e) {
       console.log(e)
       res.status(400).json(e)
   }
 }
 )



router.post("/login", async (req, res) => {
    if (!req.body.email) return res.status(400).json({ error: "Email not specified!" });
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User with specified email does not exist!" });
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
    return res.status(400).json({ error: "Password is not correct" });
    
  // create token
    const token = jwt.sign(
    // payload data
    {
      role: user.role,
      id: user._id,
    },
    process.env.TOKEN_SECRET,
    {expiresIn: "72h"}
  );
  res.header("auth-token", token).json({
   
  
      token
   
    });
  });


export default router;