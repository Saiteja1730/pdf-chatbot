const axios = require("axios");

const API_KEY = process.env.GOOGLE_API_KEY;

const getEmbedding = async (text) => {
    try {
        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${API_KEY}`;

        const response = await axios.post(url, {
            model: "models/gemini-embedding-001",
            content: {
                parts: [
                    {
                        text: text
                    }
                ]
            }
        });
        console.log("Embedding Dimension:", response.data.embedding.values.length);

        return response.data.embedding.values;

    } catch (err) {

        console.error("Embedding Error:");

        if (err.response) {
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }

        throw err;
    }
};

module.exports = {
    getEmbedding
};