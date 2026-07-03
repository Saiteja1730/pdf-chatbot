import React from 'react';
import { FiX, FiCpu } from 'react-icons/fi';
import { Upload } from './Upload';
import { DocumentList } from './DocumentList';
import { ConversationList } from './ConversationList';

export const Sidebar = ({ onCloseMobile }) => {
  return (
    <div className="w-72 md:w-80 bg-[#171717] flex flex-col h-screen text-gray-200">
      <div className="flex items-center justify-between p-4 mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <FiCpu className="text-[#171717] text-lg" />
          </div>
          <h1 className="text-lg font-semibold tracking-wide">PDF Assistant</h1>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={onCloseMobile}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          <FiX className="text-xl" />
        </button>
      </div>
      
      <div className="px-4 pb-4">
        <Upload />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        <DocumentList />
        <div className="my-4 border-t border-gray-800 mx-4" />
        <ConversationList />
      </div>
    </div>
  );
};
