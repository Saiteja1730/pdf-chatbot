const axios = require("axios");

const rerank = async (query, chunks) => {

    if (chunks.length <= 5)
        return chunks;

    const response = await axios.post(

        "https://api.jina.ai/v1/rerank",

        {

            model: "jina-reranker-v2-base-multilingual",

            query,

            documents: chunks.map(

                c => c.payload.text

            ),

            top_n: 5

        },

        {

            headers: {

                Authorization: `Bearer ${process.env.JINA_API_KEY}`,

                "Content-Type": "application/json"

            }

        }

    );

    const reranked = response.data.results.map(

        result => chunks[result.index]

    );

    return reranked;

};

module.exports = {

    rerank

};