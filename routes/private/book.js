import { Router } from "express";
import BookController from "../../controllers/book.js"

const router = Router();
router.post("", BookController.create )
router.put("", BookController.update)
router.delete("/:id", BookController.delete)

export default router;