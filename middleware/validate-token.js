import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const verifyToken = (req, res, next) => {
    try {
        const token = req.header("auth").split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "User is not authorized"})
        }
        const decodedData = jwt.verify(token,process.env.TOKEN_SECRET)
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "User is not authorized"})
    }
};
export default verifyToken;