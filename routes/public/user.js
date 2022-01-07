import { Router } from "express";
import UserController from "../../controllers/user.js"

const router = Router();

router.post("/", UserController.registration )
router.get("/token/:token", UserController.token )
router.post("/login", UserController.login);


export default router;