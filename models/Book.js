import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate"

const Book = new mongoose.Schema(
    {
        author: { type: String, required: true },
        title: { type: String, required: true },
        language: { type: String, required: true },
        picture: { type: String },
        tags: {
            type: [String],
            set: toSet
        },
        isDeleted: {
            type: Boolean
        },
        isPublic: {
            type: Boolean
        }, 
        pdf: {type: String}
    }
)

function toSet(a) {
    return [...new Set(a)];
}

Book.plugin(mongoosePaginate)

export default mongoose.model("Book", Book)


