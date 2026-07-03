const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getConversations = async (req, res) => {

    try {

        const conversations = await Conversation
            .find()
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            count: conversations.length,

            conversations

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const getMessages = async (req, res) => {

    try {

        const { conversationId } = req.params;

        const messages = await Message
            .find({ conversationId })
            .sort({ createdAt: 1 });

        res.json({

            success: true,

            count: messages.length,

            messages

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

const deleteConversation = async (req, res) => {

    try {

        const { conversationId } = req.params;

        await Message.deleteMany({

            conversationId

        });

        await Conversation.deleteOne({

            conversationId

        });

        res.json({

            success: true,

            message: "Conversation deleted."

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    getConversations,

    getMessages,

    deleteConversation

};