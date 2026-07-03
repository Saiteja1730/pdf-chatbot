import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { Loader } from './Loader';

export const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-800">
      <div className="max-w-3xl mx-auto relative flex items-end bg-gray-800 rounded-2xl border border-gray-700 shadow-sm focus-within:border-blue-500 transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "AI is generating response..." : "Ask a question about the document..."}
          disabled={disabled}
          className="w-full max-h-[200px] bg-transparent text-gray-100 placeholder-gray-500 p-4 rounded-2xl resize-none focus:outline-none focus:ring-0 custom-scrollbar disabled:opacity-50"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="m-2 p-2 rounded-xl bg-blue-600 text-white disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-700 transition-colors flex-shrink-0 flex items-center justify-center h-10 w-10"
        >
          {disabled ? <Loader size="small" /> : <FiSend />}
        </button>
      </div>
      <div className="text-center mt-3">
        <span className="text-[11px] text-gray-500">AI can make mistakes. Consider verifying important information.</span>
      </div>
    </div>
  );
};
