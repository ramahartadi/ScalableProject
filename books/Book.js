const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    author: {
        type: String,
        require: false,
    },
    id: {
        type: Number,
        require: false,
    },
    price: {
        type: Number,
        require: false,
    },
    title: {
        type: String,
        require: false,
    },
    url: {
        type: String,
        require: false,
    },
    detail: {
        type: String,
        require: false,
    },
    date: {
        type: String,
        require: false,
    },
    rating: {
        type: Number,
        require: false,
    },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
