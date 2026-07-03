import React from 'react';
import { motion } from 'framer-motion';

export const Loader = ({ fullScreen = false, size = 'default' }) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50' 
    : 'flex items-center justify-center p-4';

  const spinnerClass = size === 'small' 
    ? 'w-4 h-4 border-2' 
    : 'w-8 h-8 border-4';

  return (
    <div className={containerClass}>
      <motion.div
        className={`${spinnerClass} border-blue-500 rounded-full border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-1.5 h-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};
