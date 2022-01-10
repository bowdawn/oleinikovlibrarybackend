import { Router } from "express";
import BookController from "../../controllers/book.js"

const router = Router();
router.get("", BookController.getAllPublic);
router.get("/languages", BookController.getLanguagesPublic);
router.get("/tags", BookController.getTagsPublic);
router.get("/:id", BookController.getOnePublic);
export default router;