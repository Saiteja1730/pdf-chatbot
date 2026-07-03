const nlp = require("compromise");

const MAX_WORDS = 250;
const OVERLAP = 40;

const chunkText = (text) => {

    const paragraphs = text
        .split(/\n\s*\n/)
        .filter(p => p.trim().length > 0);

    const chunks = [];

    let chunkId = 1;

    paragraphs.forEach(paragraph => {

        const sentences = nlp(paragraph)
            .sentences()
            .out("array");

        let current = "";

        let words = [];

        sentences.forEach(sentence => {

            const sentenceWords = sentence.split(/\s+/);

            if (
                words.length + sentenceWords.length >
                MAX_WORDS
            ) {

                chunks.push({

                    chunkId,

                    text: current.trim(),

                    tokenCount: words.length,

                    startToken: 0,

                    endToken: words.length

                });

                chunkId++;

                words = words
                    .slice(-OVERLAP);

                current = words.join(" ");

            }

            current += " " + sentence;

            words.push(...sentenceWords);

        });

        if (current.trim()) {

            chunks.push({

                chunkId,

                text: current.trim(),

                tokenCount: words.length,

                startToken: 0,

                endToken: words.length

            });

            chunkId++;

        }

    });

    return chunks;

};

module.exports = {

    chunkText

};