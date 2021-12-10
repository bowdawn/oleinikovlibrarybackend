
import BookService from "../service/book.js"

class BookController {
    async create(req, res) {
        try {
            //console.log(req)
            console.log(req.body)
            console.log(req.files)
            const book = await BookService.create(req.body, req.files.picture)
            res.status(200).json(book)
        }
        catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    

    async getAll(req, res) {
        try { 
            const books = await BookService.getAll()
            return res.json(books)
        }
        catch (e) {
            res.status(500).json(e)
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params
            const book = await BookService.getOne(id);
            return res.json(book)
         }
        catch (e) {
            res.status(500).json(e)
        }
    }

    async update(req, res) {
        try { 
            const updatedBook = await BookService.update(req.body)
            return res.json(updatedBook)
        }
        catch (e) {
            res.status(500).json(e)
        }

    }
    async delete(req, res) {
        try { 
            const {id} = req.params
            const deletedBook = await BookService.delete(id)
            return res.json(deletedBook)
        }
        catch (e) {
            res.status(500).json(e)
        }

    }
}

export default new BookController()