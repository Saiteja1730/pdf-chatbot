import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getConversations, deleteConversation } from '../api/api';
import { useDocuments } from './DocumentContext';
import toast from 'react-hot-toast';

const ConversationContext = createContext();

export const useConversations = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }) => {
  const { documents, setSelectedDocumentIds } = useDocuments();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversationState] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      const convs = Array.isArray(data) ? data : (data.conversations || data.data || []);
      setConversations(convs);
      return convs;
    } catch (err) {
      toast.error('Failed to load conversation history.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const setActiveConversation = useCallback((conv) => {
    setActiveConversationState(conv);
    if (conv) {
      // Restore the documentIds that belong to this conversation
      let idsToSelect = [];
      if (conv.documentIds && conv.documentIds.length > 0) {
        idsToSelect = conv.documentIds;
      } else if (conv.documentId) {
        idsToSelect = [conv.documentId];
      }
      if (idsToSelect.length > 0) {
        setSelectedDocumentIds(idsToSelect);
      }
    }
    // NOTE: Do NOT clear selectedDocumentIds when conv is null —
    // that would wipe checkbox state whenever the user clicks a document.
  }, [setSelectedDocumentIds]);

  const removeConversation = async (id) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((conv) => conv.conversationId !== id));
      if (activeConversation?.conversationId === id) {
        setActiveConversation(null);
      }
    } catch (err) {
      toast.error('Could not delete conversation.');
      throw err;
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation,
        fetchConversations,
        removeConversation,
        loading,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
