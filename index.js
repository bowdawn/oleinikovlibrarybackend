import  express  from "express";
import mongoose from 'mongoose'

import Book from "./Book.js"

import dotenv from "dotenv"

dotenv.config()
const uri = process.env.MONGODB_URI;

const app = express();

app.use(express.json({ extended: false }));



app.post("/", (req, res) =>
{
  const {author, title, language, picture} = req.body
  console.log(req.body)
  const book = Book.create({
    author,
    title,
    language,
    picture
  })
  res.status(200).json(book)
}
)
app.use("/", (req, res ) =>  {

 try {
  res.status(200).json(
    "Oleinikov Library"
  );
} catch (error) {
  console.error(error);
  return res.status(500).send("Server error");
}
});

const PORT = process.env.PORT || 5000;
async function startApp() {
  try {
      await mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true})
      app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
  } catch (e) {
      console.log(e)
  }
}

startApp()
