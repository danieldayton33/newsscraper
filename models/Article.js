const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageSrc: {
        type: String
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
    }],
    isSaved: {
        type:Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;