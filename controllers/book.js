import BookService from "../service/book.js"

class BookController {
    async create(req, res) {
        try {
            const book = await BookService.create(req.body, req.files.picture)
            res.status(200).json(book)
        }
        catch (e) {
            console.log(e)
            res.status(500).json(e.toString())
        }
    }

    async list(req, res) {
        try {
            console.log(req.body)
            console.log(req.files)
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
            console.log(req.query.sort)
            const pagination = await BookService.getAll(parseInt(req.query.limit), parseInt(req.query.page), req.query.sort)
            return res.json(pagination)
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

    async update(req, res) {
        try { 
            const updatedBook = await BookService.update(req.body)
            return res.json(updatedBook)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }

    }
    async delete(req, res) {
        try { 
            const {id} = req.params
            const deletedBook = await BookService.delete(id)
            return res.json(deletedBook)
        }
        catch (e) {
            res.status(500).json(e.toString())
        }

    }
}

export default new BookController()