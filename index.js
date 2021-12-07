import  express  from "express";
import mongoose from 'mongoose'
import dotenv from "dotenv"
import book from "./api/book.js";
import user from "./api/user.js";
import auth from "./middleware/validate-token.js"

dotenv.config()
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// app.use("/", (req, res ) =>  {
//  try {
//   res.status(200).json(
//     "Oleinikov Library"
//   );
// } catch (error) {
//   console.error(error);
//   return res.status(500).send("Server error");
// }
// });

app.use("/api/user", user)
app.use("/api/book", auth, book)


async function startApp() {
  try {
      await mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true})
      app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
  } catch (e) {
      console.log(e)
  }
}

startApp()
