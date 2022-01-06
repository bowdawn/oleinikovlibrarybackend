import  express  from "express";
import dotenv from "dotenv"
import publicBook from "./routes/public/book.js";
import privateBook from "./routes/private/book.js";
import publicUser from "./routes/public/user.js";
import privateUser from "./routes/private/user.js";
import root from "./routes/public/root.js";
import auth from "./middleware/validate-token.js"
import connectToDatabase from "./database/mongodb.js"
import fileUpload from 'express-fileupload';
import cors from 'cors';

dotenv.config()
const PORT = process.env.PORT || 5000;

var allowedOrigins = ['http://localhost:3000',
                      'https://oleinikovlibrarybackend.vercel.app'];

const app = express();

app.use(cors({}));

app.use(express.json());
app.use(fileUpload({}))

app.use("/api/user", publicUser)
app.use("/api/user", auth, privateUser)
app.use("/api/book", publicBook)
app.use("/api/book", auth, privateBook)
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
