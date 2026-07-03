import React, { useState } from 'react';
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { useConversations } from '../context/ConversationContext';
import { ConfirmDialog } from './ConfirmDialog';
import toast from 'react-hot-toast';

export const ConversationList = () => {
  const { conversations, activeConversation, setActiveConversation, removeConversation, loading } = useConversations();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await removeConversation(deleteId);
        localStorage.removeItem(`chat_${deleteId}`);
        toast.success('Conversation deleted');
      } catch (err) {
        toast.error('Failed to delete conversation');
      }
      setDeleteId(null);
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  if (loading && conversations.length === 0) {
    return <div className="text-xs text-gray-500 py-2 px-4">Loading history...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-4 mt-4">
        Recent Chats
      </h3>
      {conversations.length === 0 ? (
        <p className="text-xs text-gray-500 px-4 italic">No past conversations.</p>
      ) : (
        <ul className="space-y-1 px-2">
          {conversations.map((conv) => (
            <li
              key={conv.conversationId || conv._id || conv.id}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer group transition-all duration-200 ${
                (activeConversation?.conversationId || activeConversation?._id) === (conv.conversationId || conv._id)
                  ? 'bg-gray-800 text-white font-medium shadow-sm'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
              }`}
              onClick={() => setActiveConversation(conv)}
            >
              <div className="flex items-center space-x-3 truncate overflow-hidden">
                <FiMessageSquare className={`flex-shrink-0 text-lg ${(activeConversation?.conversationId || activeConversation?._id) === (conv.conversationId || conv._id) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                <div className="flex flex-col truncate">
                  <span className="text-[13px] truncate leading-tight">
                    {conv.title || 'Untitled Chat'}
                  </span>
                  {conv.createdAt && (
                    <span className="text-[10px] text-gray-500 leading-tight mt-0.5">
                      {formatRelativeTime(conv.createdAt)}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(conv.conversationId || conv._id || conv.id);
                }}
                title="Delete chat"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Conversation"
        message="Are you sure you want to delete this chat history? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
