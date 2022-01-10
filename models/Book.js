import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate"


const opts = { toJSON: { virtuals: true } };

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
        isComplete: {
            type: Boolean
        },
        pdf: {type: String},
        
    } , opts
)

Book.virtual('isPdf')
  .get(function() {
    return this.pdf ? true : false;
  });

function toSet(a) {
    return [...new Set(a)];
}

Book.plugin(mongoosePaginate)

export default mongoose.model("Book", Book)


