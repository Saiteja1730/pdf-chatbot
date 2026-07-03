import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';

export const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - responsive */}
      <div className={`fixed md:relative z-30 h-full transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
};
