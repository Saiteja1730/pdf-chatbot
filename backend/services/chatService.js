const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({

    model: "gemini-2.5-flash"

});

const generateAnswer = async (prompt) => {

    const result = await model.generateContent(prompt);

    return result.response.text();

};

const streamAnswer = async (prompt, res) => {

    const result = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of result.stream) {

        const text = chunk.text();

        res.write(text);

    }

    res.end();

};

module.exports = {

    generateAnswer,

    streamAnswer

};