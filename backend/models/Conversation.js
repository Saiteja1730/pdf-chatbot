const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({

    conversationId: {

        type: String,

        unique: true,

        required: true

    },

    documentId: {
        type: String,
        default: null
    },
    documentIds: {
        type: [String],
        default: []
    },

    title: {

        type: String,

        default: "New Chat"

    },

    createdAt: {

        type: Date,

        default: Date.now

    }

});

module.exports =
mongoose.model(

    "Conversation",

    conversationSchema

);