const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({

    documentId: {
        type: String,
        required: true
    },

    chunkId: {
        type: Number,
        required: true
    },

    page: Number,

    fileName: String,

    text: String,

    tokenCount: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Chunk", chunkSchema);