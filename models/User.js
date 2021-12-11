import mongoose from "mongoose"
import validator from "validator"
const {isEmail} = validator
const User = new mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true,unique: true ,validate: [isEmail, "please enter a valid email"]},
        password: {type: String, required: true},
        role: {type: String, required: true, default: "USER"},  
        date: {type: Date, required: true}
    }
)

export default mongoose.model("User", User )