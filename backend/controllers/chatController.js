const { v4: uuidv4 } = require("uuid");

const embeddingService = require("../services/ebs");
const qdrantService = require("../services/qds");
const chatService = require("../services/chatService");
const rerankerService =
require("../services/rerankerService");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const chat = async (req, res) => {
    try {
        let {
            question,
            documentId,
            documentIds,
            conversationId
        } = req.body;

        // Backward compatibility
        if (!documentIds && documentId) {
            documentIds = [documentId];
        }

        if (!conversationId) {
            conversationId = uuidv4();
            await Conversation.create({
                conversationId,
                documentId: documentId || null,
                documentIds: documentIds || [],
                title: question.substring(0, 40)
            });
        }

        const history = await Message.find({ conversationId }).sort({ createdAt: 1 });
        const previousMessages = history.map(msg => `${msg.role}: ${msg.content}`).join("\n");

        const questionEmbedding = await embeddingService.getEmbedding(question);
        
        // Use documentIds array
        const topChunks = await qdrantService.searchVectors(questionEmbedding, documentIds);
        const rerankedChunks = await rerankerService.rerank(question, topChunks);

        const context = rerankedChunks
            .map(chunk => `Document: ${chunk.payload.fileName}\nText: ${chunk.payload.text}`)
            .join("\n\n");

        const finalPrompt = `
You are answering using information from multiple documents.
Compare them if needed. Mention which document contains each fact.
If documents disagree, say so. Never invent information.

Previous Conversation:
${previousMessages}

Document Context:
${context}

User Question:
${question}

Answer only from the context.
`;

        // Fix early return and use generateAnswer instead of streamAnswer
        const answer = await chatService.generateAnswer(finalPrompt);

        const sources = rerankedChunks.map(chunk => ({
            score: chunk.score,
            documentId: chunk.payload.documentId,
            fileName: chunk.payload.fileName,
            page: chunk.payload.page,
            chunkId: chunk.payload.chunkId
        }));

        await Message.create({
            conversationId,
            role: "user",
            content: question
        });

        await Message.create({
            conversationId,
            role: "assistant",
            content: answer,
            sources: sources
        });

        res.json({
            success: true,
            conversationId,
            answer,
            sources
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

    chat

};