import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="text-red-500 text-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-100 mb-1">{title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none shadow-sm shadow-red-900/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
