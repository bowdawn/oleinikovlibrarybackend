import BookService from "../service/book.js"
import chunksStorage from "../database/storage.js";

class BookController {

    async create(req, res) {
        try {
            console.log(req.body)

            const book = await BookService.create(req.body);
            console.log("Book created:", book);
            res.status(200).json(book);  // Send the book data back as the response
        } catch (e) {
            console.error("Error in create route:", e);
            res.status(500).json({ error: e.message });  // Send the error message back in the response
        }
    }

    async list(req, res) {
        try {
            const list = await BookService.list(req.files.pictures)
            res.status(200).json(list)
        }
        catch (e) {
            console.log(e)
            res.status(500).json(e.toString())
        }
    }



    async getAll(req, res) {
        try {
            const { limit, page, sort, filter } = req.query;
            const books = await BookService.getAll(limit, page, sort, filter)
            return res.json(books)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getLanguages(req, res) {
        try {
            const languages = await BookService.getLanguages()
            return res.json(languages)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getTags(req, res) {
        try {
            const tags = await BookService.getTags()
            return res.json(tags)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params
            const book = await BookService.getOne(id);
            return res.json(book)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getAllPublic(req, res) {
        try {
            const { limit, page, sort, filter } = req.query;
            const books = await BookService.getAllPublic(limit, page, sort, filter);
            return res.json(books)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getLanguagesPublic(req, res) {
        try {
            const languages = await BookService.getLanguagesPublic()
            return res.json(languages)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getTagsPublic(req, res) {
        try {
            const tags = await BookService.getTagsPublic()
            return res.json(tags)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async getOnePublic(req, res) {
        try {
            const { id } = req.params
            const book = await BookService.getOnePublic(id);
            return res.json(book)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }


    async update(req, res) {
        try {
            console.log(req.body)
            const updatedBook = await BookService.update(req.body)
            return res.json(updatedBook)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }

    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const deletedBook = await BookService.delete(id)
            return res.json(deletedBook)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }
    }

    async upload(req, res) {
        try {
            const { chunkIndex, fileName } = req.body;
            const result = BookService.upload({
                chunkIndex,
                fileName,
                file: req.file,
            });
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.toString() });
        }
    }
    
    async finalize(req, res) {
        try {
            const { fileName, fileType, totalChunks } = req.body;
            const result = await BookService.finalize({
                fileName,
                fileType,
                totalChunks,
            });
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.toString() });
        }
    }
}

export default new BookController()