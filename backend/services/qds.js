const { QdrantClient } = require("@qdrant/js-client-rest");

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

const COLLECTION = "ragproject";

const createPayloadIndexes = async () => {

    try {

        await client.createPayloadIndex(

            COLLECTION,

            {

                field_name: "documentId",

                field_schema: "keyword"

            }

        );

        console.log("✓ documentId payload index created");

    }

    catch (err) {

        console.log("Payload index already exists.");

    }

};
async function uploadVectors(documents) {

    const points = documents.map(doc => ({

        id: doc.id,

        vector: {

            embedding: doc.embedding

        },

        payload: {

            documentId: doc.documentId,

            text: doc.text,

            fileName: doc.fileName,

            chunkId: doc.chunkId,

            page: doc.page,

            tokenCount: doc.tokenCount,

            startToken: doc.startToken,

            endToken: doc.endToken,

            createdAt: doc.createdAt

        }

    }));

    await client.upsert(COLLECTION, {

        wait: true,

        points

    });

}

async function searchVectors(embedding, documentIds = null) {
    const options = {
        vector: {
            name: "embedding",
            vector: embedding
        },
        limit: 20,
        with_payload: true,
        with_vector: false
    };

    if (documentIds) {
        // Normalize to array
        const ids = Array.isArray(documentIds) ? documentIds : [documentIds];
        
        if (ids.length > 0) {
            options.filter = {
                must: [
                    {
                        key: "documentId",
                        match: {
                            any: ids
                        }
                    }
                ]
            };
        }
    }

    return await client.search(COLLECTION, options);
}

async function deleteDocument(documentId) {

    await client.delete(COLLECTION, {

        wait: true,

        filter: {

            must: [

                {

                    key: "documentId",

                    match: {

                        value: documentId

                    }

                }

            ]

        }

    });

}

module.exports = {

    uploadVectors,

    searchVectors,

    deleteDocument,

    createPayloadIndexes

};