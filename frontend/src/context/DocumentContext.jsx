import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDocuments, deleteDocument } from '../api/api';
import toast from 'react-hot-toast';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(Array.isArray(data) ? data : (data.documents || data.data || []));
    } catch (err) {
      setError('Failed to fetch documents');
      toast.error('Network Error: Could not fetch documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const removeDocument = async (id) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.documentId !== id));
      setSelectedDocumentIds((prev) => prev.filter((docId) => docId !== id));
    } catch (err) {
      toast.error('Failed to delete the document.');
      throw err;
    }
  };

  const toggleDocumentSelection = (id) => {
    setSelectedDocumentIds((prev) => 
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocumentIds(documents.map(doc => doc.documentId));
  };

  const clearSelection = () => {
    setSelectedDocumentIds([]);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        selectedDocumentIds,
        setSelectedDocumentIds,
        toggleDocumentSelection,
        selectAllDocuments,
        clearSelection,
        fetchDocuments,
        removeDocument,
        loading,
        error
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
