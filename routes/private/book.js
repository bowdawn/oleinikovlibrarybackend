import { Router } from "express";
import BookController from "../../controllers/book.js"

const router = Router();
router.get("", BookController.getAll);
router.get("/languages", BookController.getLanguages);
router.get("/tags", BookController.getTags);
router.get("/:id", BookController.getOne);
router.post("", BookController.create )
router.post("/list", BookController.list)
router.put("", BookController.update)
router.delete("/:id", BookController.delete)

export default router;