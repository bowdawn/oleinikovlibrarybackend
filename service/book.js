import Book from "../models/Book.js"
import createAndUpload from "../googledriveapi/upload.js"

class BookService {
    async create(book, picture) {

        const response = await createAndUpload(picture)

        return await Book.create({
            author: book.author,
            title: book.title,
            language: book.language,
            picture: "https://drive.google.com/uc?export=view&id=" + response.data.id
        })
    }

    async list(pictures) {
        const result = []
        await Promise.all(pictures.map(async (picture) => {
            const response = await createAndUpload(picture)
            let emptyBook = await Book.create({
                author: "default",
                title: "default",
                language: "default",
                picture: "https://drive.google.com/uc?export=view&id=" + response.data.id
            })
            result.push(emptyBook)
        }
        ))
        return result
    }


    async getAll(limit = 12, page = 1, sort = "", filter = { title: "", author: "", language: "" }) {
        sort.split(",").join(" ")
        let query =  {
            title:{'$regex' : filter.title ? filter.title : "(.)*" , '$options' : 'i'},
            author:{'$regex' : filter.author ? filter.author : "(.)*" , '$options' : 'i'},
            ...(filter.language && {language: filter.language})
        }
        const result = await Book.paginate(
            query,
            { sort: sort.split(",").join(" "), page: page, limit: limit })
        return result
    }

    async getLanguages() {
        const result = await Book.find().distinct("language")
        return result
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
