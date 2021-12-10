import Book from "../models/Book.js"
import createAndUpload from "../googledriveapi/upload.js"

class BookService {
    async create(book, picture) {
        
        const response = await createAndUpload(picture)
   
        return await Book.create({
            author: book.author,
            title: book.title,
            language: book.language,
            picture: "hello"
        })
    }


    async getAll() {
        return await Book.find()
    }

    async getOne(id) {
        if (!id) throw new Error("Book Id not specified")
        return await Book.findById(id);
    }

    async update(book) {
        if (!book._id) throw new Error("Book Id not specified")
        const updatedUser = await Book.findByIdAndUpdate(book._id, book, { new: true })
        return updatedUser
    }


    async delete(id) {
            if (!id) throw new Error("Book Id not specified")
            return await Book.findByIdAndDelete(id)
    }

}

export default new BookService()
