import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate"

const Book = new mongoose.Schema(
    {
        author: {type: String, required: true},
        title: {type: String, required: true},
        language: {type: String, required: true},
        picture: {type: String}
    }
)

Book.plugin(mongoosePaginate)

export default mongoose.model("Book", Book )