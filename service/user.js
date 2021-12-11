import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()
class UserService {
    async registration(user) {
        const { firstname, lastname, email, role } = user
        const date = new Date()
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(user.password, salt);
        return await User.create({
            firstname,
            lastname,
            email,
            password,
            role,
            date
        })
    }

    async login(email, password) {

        if (!email) throw new Error("Email not specified")
        const user = await User.findOne({ email: email });
        if (!user) throw new Error("User with specified email does not exist")
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Password or Email is not correct")
        // create token
        const token = jwt.sign(
            // payload data
            {
                role: user.role,
                id: user._id,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "72h" }
        );
        return (
            {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                id: user._id,
                token
            })
    }

    async token(token) {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        if(!decodedToken) throw new Error("Empty Token")   
        if(!decodedToken.id) throw new Error("Invalid Token")     
        const user = await User.findOne({ id: decodedToken.id })
        if(!user) throw new Error("User not found")
        return (
            {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                id: user._id,
                token
            })   
    }

    async getAll() {
        return await User.find()
    }

    async getOne(id) {
        if (!id) throw new Error("User Id not specified")
        return await User.findById(id);
    }

    async update(user) {
        if (!user._id) throw new Error("User Id not specified")
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(user.password, salt);
        user.password = password
        const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true })
        return updatedUser
    }


    async delete(id) {
        if (!id) throw new Error("User Id not specified")
        return await User.findByIdAndDelete(id)
    }

}

export default new UserService()
