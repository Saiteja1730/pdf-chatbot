const mongoose = require("mongoose");

const documentSchema =
new mongoose.Schema({

    documentId: {

        type: String,

        required: true,

        unique: true

    },

    fileName: {

        type: String,

        required: true

    },

    uploadedBy: {

        type: String,

        default: "anonymous"

    },

    uploadedAt: {

        type: Date,

        default: Date.now

    },

    totalChunks: {

        type: Number,

        required: true

    },

    totalPages: {

        type: Number,

        default: 1

    },

    status: {

        type: String,

        enum: [

            "Processing",

            "Indexed",

            "Failed"

        ],

        default: "Indexed"

    }

}, {

    timestamps: true

});

module.exports =
mongoose.model(

    "Document",

    documentSchema

);