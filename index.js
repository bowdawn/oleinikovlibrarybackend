import  express  from "express";
import dotenv from "dotenv"
import publicBook from "./routes/public/book.js";
import privateBook from "./routes/private/book.js";
import user from "./routes/public/user.js";
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

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(fileUpload({}))

app.use("/api/user", user)
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
