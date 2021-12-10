import { Router } from "express";
import BookController from "../controllers/book.js"

const router = Router();
router.post("", BookController.create )
router.get("", BookController.getAll);
router.get("/:id", BookController.getOne);
router.put("", BookController.update)
router.delete("/:id", BookController.delete)
export default router;