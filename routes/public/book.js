import { Router } from "express";
import BookController from "../../controllers/book.js"

const router = Router();
router.get("", BookController.getAll);
router.get("/languages", BookController.getLanguages);
router.get("/:id", BookController.getOne);
export default router;