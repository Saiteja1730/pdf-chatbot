import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMessages, postChat } from '../api/api';
import { useConversations } from './ConversationContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { activeConversation, setActiveConversation, fetchConversations } = useConversations();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = useCallback(async (conversationId) => {
    setLoading(true);
    try {
      const data = await getMessages(conversationId);
      
      let fetchedMessages = [];
      const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
          if (obj.messages && Array.isArray(obj.messages)) return obj.messages;
          if (obj.history && Array.isArray(obj.history)) return obj.history;
          for (const key in obj) {
            if (Array.isArray(obj[key])) return obj[key];
            if (obj[key] && typeof obj[key] === 'object') {
              const res = findArray(obj[key]);
              if (res.length > 0) return res;
            }
          }
        }
        return [];
      };

      fetchedMessages = findArray(data);

      if (fetchedMessages.length === 0) {
        // Fallback to localStorage due to backend bug not saving messages
        const localMessages = localStorage.getItem(`chat_${conversationId}`);
        if (localMessages) {
          fetchedMessages = JSON.parse(localMessages);
        }
      }

      setMessages(fetchedMessages);
    } catch (err) {
      toast.error('Failed to load messages for this conversation.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.conversationId || activeConversation._id || activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation, fetchMessages]);

  const sendMessage = async (question, documentIds) => {
    const tempUserMsg = { id: Date.now().toString(), role: 'user', content: question };
    let currentConversationId = activeConversation?.conversationId || activeConversation?._id || activeConversation?.id;
    
    // Optimistically update UI
    setMessages((prev) => {
      const updated = [...prev, tempUserMsg];
      if (currentConversationId) {
        localStorage.setItem(`chat_${currentConversationId}`, JSON.stringify(updated));
      }
      return updated;
    });
    setIsTyping(true);

    try {
      // documentIds should be an array
      const response = await postChat(question, documentIds, currentConversationId || null);
      
      let answerContent = '';
      let responseConvId = null;
      let sources = [];
      
      if (typeof response === 'string') {
        answerContent = response;
      } else if (response.answer) {
        answerContent = response.answer;
        responseConvId = response.conversationId;
        sources = response.sources;
      } else if (response.success === false) {
        const errMsg = response.error || response.message || 'Unknown error occurred.';
        toast.error(`Backend Error: ${errMsg}`);
        answerContent = `**Error**: ${errMsg}`;
      } else {
        answerContent = `**Debug**: Unexpected response format\n\`\`\`json\n${JSON.stringify(response, null, 2)}\n\`\`\``;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answerContent,
        sources: sources
      };
      
      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        if (currentConversationId) {
          localStorage.setItem(`chat_${currentConversationId}`, JSON.stringify(updated));
        }
        return updated;
      });
      
      // If no active conversation, it means one was just created on the backend
      if (!activeConversation) {
        const newConvs = await fetchConversations();
        if (newConvs && newConvs.length > 0) {
          // Find the newest conversation
          // Sort descending by createdAt
          const sortedConvs = [...newConvs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const newestConv = sortedConvs[0];
          
          if (newestConv) {
            // Set it as active
            setActiveConversation(newestConv);
            
            // Save the messages we just created to this new conversation's localStorage
            const newConvId = newestConv.conversationId || newestConv._id || newestConv.id;
            localStorage.setItem(`chat_${newConvId}`, JSON.stringify([tempUserMsg, aiMsg]));
          }
        }
      }
    } catch (err) {
      toast.error(err.message || 'Network error occurred while sending message.');
      const errorMsg = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `**Network Error**: ${err.message || 'Failed to connect to the server.'}`
      };
      setMessages((prev) => {
        const updated = [...prev, errorMsg];
        if (currentConversationId) {
          localStorage.setItem(`chat_${currentConversationId}`, JSON.stringify(updated));
        }
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        isTyping,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

