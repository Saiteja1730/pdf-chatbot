import React, { useState } from 'react';
import { FiFileText, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useDocuments } from '../context/DocumentContext';
import { useConversations } from '../context/ConversationContext';
import { ConfirmDialog } from './ConfirmDialog';
import toast from 'react-hot-toast';

export const DocumentList = () => {
  const { 
    documents, 
    selectedDocumentIds, 
    toggleDocumentSelection, 
    selectAllDocuments, 
    clearSelection,
    removeDocument, 
    loading 
  } = useDocuments();
  const { setActiveConversation } = useConversations();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await removeDocument(deleteId);
        toast.success('Document deleted successfully');
      } catch (err) {
        toast.error('Failed to delete document');
      }
      setDeleteId(null);
    }
  };

  const handleDocumentClick = (doc) => {
    toggleDocumentSelection(doc.documentId);
    // Reset conversation so old chat history doesn't bleed into the new selection
    setActiveConversation(null);
  };

  if (loading && documents.length === 0) {
    return <div className="text-xs text-gray-500 py-2 px-4">Loading documents...</div>;
  }

  const allSelected = documents.length > 0 && selectedDocumentIds.length === documents.length;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-4 mt-4 mb-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Files
        </h3>
        {documents.length > 0 && (
          <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
            {selectedDocumentIds.length} selected
          </span>
        )}
      </div>

      {documents.length > 0 && (
        <div className="flex items-center justify-between px-4 mb-2 text-xs">
          <button 
            onClick={() => {
              allSelected ? clearSelection() : selectAllDocuments();
              setActiveConversation(null);
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          >
            {allSelected ? 'Clear Selection' : 'Select All'}
          </button>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-xs text-gray-500 px-4 italic">No documents uploaded.</p>
      ) : (
        <ul className="space-y-1 px-2">
          {documents.map((doc) => {
            const isSelected = selectedDocumentIds.includes(doc.documentId);
            return (
              <li
                key={doc.documentId}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer group transition-all duration-200 ${
                  isSelected
                    ? 'bg-gray-800 text-white font-medium shadow-sm'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                }`}
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className={`flex-shrink-0 text-lg ${isSelected ? 'text-blue-400' : 'text-gray-500'}`}>
                    {isSelected ? <FiCheckSquare /> : <FiSquare />}
                  </div>
                  <FiFileText className={`flex-shrink-0 text-lg ${isSelected ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  <span className="text-[13px] truncate">{doc.fileName}</span>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(doc.documentId);
                  }}
                  title="Delete file"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Document"
        message="Are you sure you want to delete this document? This will remove all associated data."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
