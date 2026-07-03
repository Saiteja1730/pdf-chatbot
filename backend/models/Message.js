const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    conversationId: {

        type: String,

        required: true

    },

    role: {

        type: String,

        enum: [

            "user",

            "assistant"

        ],

        required: true

    },

    content: {
        type: String,
        required: true
    },
    sources: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
mongoose.model(

    "Message",

    messageSchema

);