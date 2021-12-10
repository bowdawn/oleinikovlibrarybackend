import  express  from "express";
import dotenv from "dotenv"
import book from "./routes/book.js";
import user from "./routes/user.js";
import root from "./routes/root.js";
//import auth from "./middleware/validate-token.js"
import connectToDatabase from "./database/mongodb.js"
import fileUpload from 'express-fileupload';


dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(fileUpload({}))

app.use("/api/user", user)
app.use("/api/book", book)
//app.use("/api/book", auth, book)
app.use("/api", root);
app.use("/", root);

async function startApp() {
  try {
      connectToDatabase()
      app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
  } catch (e) {
      console.log(e)
  }
}

startApp()
