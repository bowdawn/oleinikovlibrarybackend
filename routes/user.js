import { Router } from "express";
import UserController from "../controllers/user.js"

const router = Router();

router.post("/registration", UserController.registration )
router.post("/login", UserController.login);
router.get("", UserController.getAll);
router.get("/:id", UserController.getOne);
router.put("", UserController.update)
router.delete("/:id", UserController.delete)

export default router;