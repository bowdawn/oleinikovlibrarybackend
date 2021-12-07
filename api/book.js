import { Router } from "express";
import Book from "../models/Book.js"
const router = Router();





 router.post("", async (req, res) =>
 {
   const {author, title, language, picture} = req.body
   console.log(req.body)
   try{
   const book = await Book.create({
     author,
     title,
     language,
     picture
   })
   res.status(200).json(book)}
   catch(e){
     console.log(e)
     res.status(400).json(e)
   }
 }
 )
export default router;