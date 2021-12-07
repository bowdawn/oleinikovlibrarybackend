import mongoose from "mongoose"

const Book = new mongoose.Schema(
    {
        author: {type: String, required: true},
        title: {type: String, required: true},
        language: {type: String, required: true},
        picture: {type: String}
    }
)

export default mongoose.model("Book", Book )