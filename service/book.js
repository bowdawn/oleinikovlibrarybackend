import Book from "../models/Book.js"
import uploadPicture from "../googledriveapi/uploadPicture.js"
import deleteFile from "../googledriveapi/deleteFile.js"

class BookService {
    async create(book, picture) {

        const response = await uploadPicture(picture)

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
            const response = await uploadPicture(picture)
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

    async update(book, pdf) {
        console.log("update")
        if (!book._id) throw new Error("Book Id not specified")
        let pdfDownload = book.pdf
        const current = await Book.findById(book._id)
        if (pdf){
            console.log("pdf")
            if(current.pdf){
                console.log("book-pdf")
                const fileId = current.pdf.substring(0, current.pdf.length - 16).substring(31)
                console.log(fileId)
                await deleteFile(fileId)
            }
            
            const response = await uploadPicture(pdf)
            pdfDownload = "https://drive.google.com/uc?id=" + response.data.id + "&export=download"
        } 
        
        const tags = book.tags.split(",").filter(tag => tag !== "")
        const updatedBook = await Book.findByIdAndUpdate(book._id,{...book, pdf: pdfDownload, tags:  tags  }, { new: true })
      
        return updatedBook
    }


    async delete(id) {
        if (!id) throw new Error("Book Id not specified")
        return await Book.findByIdAndDelete(id)
    }

}

export default new BookService()
