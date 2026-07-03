const pdfService = require("../services/pdfService");
const chunkService = require("../services/chunkService");
const embeddingService = require("../services/ebs");
const qdrantService = require("../services/qds");

const Document = require("../models/Document");

const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadPDF = async (req, res) => {

    try {

        // Duplicate check by filename
        const existingDoc = await Document.findOne({ fileName: req.file.originalname });
        if (existingDoc) {
            return res.status(409).json({
                success: false,
                message: "A document with this name has already been uploaded."
            });
        }

        const documentId = uuidv4();

        const text = await pdfService.extractText(req.file.path);

        const chunks = chunkService.chunkText(text);

        const documents = [];

        for (const chunk of chunks) {

            const embedding =
                await embeddingService.getEmbedding(chunk.text);

            documents.push({

                id: uuidv4(),

                documentId,

                fileName: path.basename(req.file.originalname),

                page: 1,

                chunkId: chunk.chunkId,

                tokenCount: chunk.tokenCount,

                startToken: chunk.startToken,

                endToken: chunk.endToken,

                text: chunk.text,

                embedding,

                createdAt: new Date().toISOString()

            });

        }

        await qdrantService.uploadVectors(documents);

        const Chunk = require("../models/Chunk");
 
    await Chunk.insertMany(

    documents.map(doc => ({

        documentId: doc.documentId,

        chunkId: doc.chunkId,

        page: doc.page,

        fileName: doc.fileName,

        text: doc.text,

        tokenCount: doc.tokenCount

    }))

);

        await Document.create({

            documentId,

            fileName: req.file.originalname,

            totalChunks: documents.length,

            totalPages: 1,

            status: "Indexed"

        });

        res.json({

            success: true,

            documentId,

            totalChunks: documents.length,

            message: "PDF indexed successfully."

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

    uploadPDF

};