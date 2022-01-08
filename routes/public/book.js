import { Router } from "express";
import BookController from "../../controllers/book.js"

const router = Router();
router.get("/public", BookController.getAllPublic);
router.get("/public/languages", BookController.getLanguagesPublic);
router.get("/public/languages", BookController.getTagsPublic);
router.get("/public/:id", BookController.getOnePublic);
export default router;