import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useConversations } from '../context/ConversationContext';
import { FiFile, FiMenu, FiMessageSquare } from 'react-icons/fi';

export const Header = ({ onMenuClick }) => {
  const { documents, selectedDocumentIds } = useDocuments();
  const { activeConversation } = useConversations();

  const selectedDocs = documents.filter(doc => selectedDocumentIds.includes(doc.documentId));
  let headerText = 'No document selected';
  
  if (selectedDocs.length > 0) {
    if (selectedDocs.length <= 2) {
      headerText = selectedDocs.map(d => d.fileName).join(', ');
    } else {
      headerText = `${selectedDocs[0].fileName}, ${selectedDocs[1].fileName}, and ${selectedDocs.length - 2} more`;
    }
  }

  return (
    <div className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10 w-full">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>

        {selectedDocs.length > 0 ? (
          <div className="flex items-center space-x-2 text-gray-200 px-3 py-1.5 rounded-full">
            <FiFile className="text-blue-400 text-sm" />
            <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{headerText}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 font-medium ml-2 md:ml-0">All documents (Global Search)</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {activeConversation && (
          <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 border border-gray-800 px-2 py-1 rounded">
            <FiMessageSquare />
            <span className="truncate max-w-[150px]">{activeConversation.title || 'Chat'}</span>
          </div>
        )}
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-xs text-gray-400 font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
};
