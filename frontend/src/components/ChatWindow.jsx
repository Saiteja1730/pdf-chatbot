import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useDocuments } from '../context/DocumentContext';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { TypingAnimation } from './Loader';
import { Header } from './Header';
import { FiMessageSquare, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const ChatWindow = ({ onMenuClick }) => {
  const { messages, isTyping, sendMessage } = useChat();
  const { selectedDocumentIds, documents } = useDocuments();
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (documents.length === 0) {
      toast.error('Please upload a document first.');
      return;
    }
    sendMessage(text, selectedDocumentIds);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#212121] relative min-w-0">
      <Header onMenuClick={onMenuClick} />
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-8 md:px-8 custom-scrollbar relative"
      >
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-gray-500 mt-32"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center mb-6">
                <FiCpu className="text-3xl text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-3 text-center">How can I help you today?</h2>
              <p className="text-center max-w-sm text-sm text-gray-400">
                Upload PDFs from the sidebar, select one or more, and start asking questions. I'll analyze the selected documents (or all if none are selected) and provide accurate answers with citations.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6 pb-20">
              {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex w-full justify-start mb-6">
                  <div className="flex w-full max-w-[75%] flex-row">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 mr-3 flex items-center justify-center">
                      <FiCpu className="text-white text-sm" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-gray-800 border border-gray-700 rounded-tl-sm shadow-sm flex items-center">
                      <TypingAnimation />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>
      </div>
      
      <div className="shrink-0 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-6 pb-2 w-full relative z-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};
