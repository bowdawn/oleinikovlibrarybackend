import jwt from "jsonwebtoken"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import UserService from "../service/post.js"

class UserController {
    async registration(req, res) {
        try {
            const user = await UserService.registration(req.body)
            res.status(200).json(user)
        }
        catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async login(req, res) {
        try {
            const token = await UserService.login(req.body.email, req.body.password) 
            res.header("auth-token", token).json({ token });
        }
        catch (e) {
            res.status(500).json(e)
        }
    }

    async getAll(req, res) {
        try { 
            const users = await UserService.getAll()
            return res.json(users)
        }
        catch (e) {
            res.status(500).json(e)
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params
            const user = await UserService.getOne(id);
            return res.json(user)
         }
        catch (e) {
            res.status(500).json(e)
        }
    }

    async update(req, res) {
        try { 
            const updatedUser = await UserService.update(req.body)
            return res.json(updatedUser)
        }
        catch (e) {
            res.status(500).json(e)
        }

    }
    async delete(req, res) {
        try { 
            const {id} = req.params
            const deletedUser = await UserService.delete(id)
            return res.json(deletedUser)
        }
        catch (e) {
            res.status(500).json(e)
        }

    }
}

export default new UserController()