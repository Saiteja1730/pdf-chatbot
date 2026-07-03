const Document = require("../models/Document");
const qdrantService = require("../services/qds");
const Chunk = require("../models/Chunk");
const getDocuments = async (req, res) => {

    try {

        const documents =
            await Document
                .find()
                .sort({ createdAt: -1 });

        res.json({

            success: true,

            count: documents.length,

            documents

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

const deleteDocument = async (req, res) => {

    try {

        const { documentId } = req.params;

        // Delete vectors from Qdrant
        await qdrantService.deleteDocument(documentId);

        // Delete document metadata
        await Document.deleteOne({
            documentId
        });

        // Delete all chunks of this document
        await Chunk.deleteMany({
            documentId
        });

        res.json({

            success: true,

            message: "Document deleted successfully."

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

    getDocuments,

    deleteDocument

};