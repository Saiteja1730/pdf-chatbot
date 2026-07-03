let documents = [];

const saveDocuments = (docs) => {

    documents = docs;

};

const getDocuments = () => {

    return documents;

};

module.exports = {

    saveDocuments,

    getDocuments

};