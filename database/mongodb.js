import mongoose from 'mongoose'
import dotenv from "dotenv"
dotenv.config()
const uri = process.env.MONGODB_URI;

export default function connectToDatabase() {
    try {
        mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true})
    } catch (e) {
        console.log(e)
    }
} 



