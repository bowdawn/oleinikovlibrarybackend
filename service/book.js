import Book from "../models/Book.js"
import uploadFile from "../googledriveapi/uploadFile.js"
import deleteFile from "../googledriveapi/deleteFile.js"
import { getThumbnailUrl } from "../utils.js"

class BookService {
    async create(book) {
        try {
            let pdfDownload = ""
            if (book.pdf) {
                pdfDownload = `https://drive.google.com/uc?id=${book.pdf}&export=download`;
            }
            const tags = book.tags.split(",").filter(tag => tag.trim() !== "");
            console.log("Creating book...");
            return await Book.create({
                picture: book.picture,
                title: book.title,
                author: book.author,
                language: book.language,
                isDeleted: book.isDeleted,
                isPublic: book.isPublic,
                isComplete: book.isComplete,
                tags: tags,
                pdf: pdfDownload
            });
        } catch (error) {
            console.error("Error creating book:", error.message);
            throw new Error(error.message || "An error occurred while creating the book.");
        }
    }
    async update(book) {
        const current = await Book.findById(book._id)
        if (!book._id) throw new Error("Book Id not specified")
        if (current.isComplete) {
            const updatedBook = await Book.findByIdAndUpdate(
                book._id,
                { isComplete: book.isComplete },
                { new: true }
            )
            return updatedBook
        } else {
            let pdfDownload = ""
            if (book.pdf.length > 0) {
                pdfDownload = "https://drive.google.com/uc?id=" + book.pdf + "&export=download"
                if (current.pdf !== pdfDownload) {
                    const fileId = current.pdf.substring(0, current.pdf.length - 16).substring(31)
                    await deleteFile(fileId)
                }
            }
            else if (current.pdf && book.pdf === "") {
                const fileId = current.pdf.substring(0, current.pdf.length - 16).substring(31)
                await deleteFile(fileId)
            }
            const tags = book.tags.split(",").filter(tag => tag !== "")
            const updatedBook = await Book.findByIdAndUpdate(
                book._id,
                {
                    ...book,
                    picture: current.picture,
                    pdf: pdfDownload,
                    tags: tags
                },
                { new: true }
            )
            return updatedBook
        }
    }


    async list(pictures) {
        const result = []
        await Promise.all(pictures.map(async (picture) => {
            const response = await uploadFile(picture)
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


    async getAll(limit = 12, page = 1, sort = "", filter = { title: "", author: "", language: "", deleted: "", public: "", complete: "", tags: "", pdf: "" },) {
        sort.split(",").join(" ")
        let query = {
            title: { '$regex': filter.title ? filter.title : "(.)*", '$options': 'i' },
            author: { '$regex': filter.author ? filter.author : "(.)*", '$options': 'i' },
            ...(filter.language && { language: filter.language }),
            ...(filter.deleted !== "all" && (filter.deleted === "only" || filter.deleted === "") && { isDeleted: filter.deleted === "only" ? true : { $in: [null, false] } }),
            ...(filter.public && (filter.public === "public" || filter.public === "private") && { isPublic: filter.public == "public" ? true : { $in: [null, false] } }),
            ...(filter.complete && (filter.complete === "complete" || filter.complete === "incomplete") && { isComplete: filter.complete == "complete" ? true : { $in: [null, false] } }),
            ...(filter.tags && { tags: { $in: filter.tags.split(",") } }),
            ...(filter.pdf && (filter.pdf === "exist" || filter.pdf === "dne") && { pdf: filter.pdf === "exist" ? { '$regex': "drive.google.com" } : { $in: [null, "", undefined, "undefined"] } }),
        }

        const result = await Book.paginate(
            query,
            {
                sort: sort.split(",").join(" "),
                page: parseInt(page),
                limit: parseInt(limit),
            })

        result.docs = result.docs.map((book) => {
            book.picture = getThumbnailUrl(book.picture); // Modify picture URL
            book.isPdf = book.pdf ? true : false; // Determine if PDF exists

            return book;
        });
        return result
    }

    async getAllPublic(limit = 12, page = 1, sort = "", filter = { title: "", author: "", language: "", deleted: "", public: "", complete: "", tags: "", pdf: "" }) {
        // Process sort parameter
        const sortQuery = sort.split(",").join(" ");

        // Construct query object
        let query = {
            title: { '$regex': filter.title ? filter.title : "(.)*", '$options': 'i' },
            author: { '$regex': filter.author ? filter.author : "(.)*", '$options': 'i' },
            ...(filter.language && { language: filter.language }),
            ...(filter.deleted !== "all" && (filter.deleted === "only" || filter.deleted === "") && { isDeleted: filter.deleted === "only" ? true : { $in: [null, false] } }),
            ...(true && { isPublic: true }),
            ...(filter.tags && { tags: { $in: filter.tags.split(",") } }),
            ...(filter.pdf && (filter.pdf === "exist" || filter.pdf === "dne") && { pdf: filter.pdf === "exist" ? { '$regex': "drive.google.com" } : { $in: [null, "", undefined, "undefined"] } }),
        };
        // Fetch results from Book.paginate
        const result = await Book.paginate(
            query,
            {
                sort: sortQuery, // Apply sorting
                page: parseInt(page),
                limit: parseInt(limit),
                select: "author title language picture tags pdf", // Fields to select
                lean: true // Return plain JavaScript objects
            }
        );

        // Process the results
        result.docs = result.docs.map((book) => {
            book.picture = getThumbnailUrl(book.picture); // Modify picture URL
            book.isPdf = book.pdf ? true : false; // Determine if PDF exists
            book.pdf = ""; // Clear PDF field
            return book;
        });
        // Return the processed result
        return result;
    }

    async getLanguages() {
        const result = await Book.find({ isDeleted: { $in: [null, false] } }).distinct("language")
        return result
    }

    async getTags() {
        const result = await Book.find({ isDeleted: { $in: [null, false] } }).distinct("tags")
        return result
    }


    async getOne(id) {
        if (!id) throw new Error("Book Id not specified")
        const book = await Book.findById(id)
        book.picture = getThumbnailUrl(book.picture)
        return book;
    }

    async getLanguagesPublic() {
        const result = await Book.find({ isPublic: true, isDeleted: { $in: [null, false] } }).distinct("language")
        return result
    }

    async getTagsPublic() {
        const result = await Book.find({ isPublic: true, isDeleted: { $in: [null, false] } }).distinct("tags")
        return result
    }


    async getOnePublic(id) {
        if (!id) throw new Error("Book Id not specified")
        const publicBook = await Book.findById(id)
        if (!publicBook.isPublic) throw new Error("Book is not public")
        publicBook.picture = getThumbnailUrl(publicBook.picture)
        return publicBook
    }


    


    async delete(id) {
        if (!id) throw new Error("Book Id not specified")
        return await Book.findByIdAndDelete(id)
    }

}


export default new BookService()
