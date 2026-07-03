import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiUser, FiCpu, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Group sources by fileName and collect unique pages
const groupSources = (sources) => {
  const map = {};
  sources.forEach((src) => {
    const name = src.fileName || src.filename || 'Unknown';
    if (!map[name]) {
      map[name] = { fileName: name, pages: new Set() };
    }
    if (src.page) map[name].pages.add(src.page);
  });
  return Object.values(map).map(g => ({ ...g, pages: Array.from(g.pages).sort((a, b) => a - b) }));
};

export const Message = memo(({ message }) => {
  const isUser = message.role === 'user';
  const groupedSources = !isUser && message.sources && message.sources.length > 0
    ? groupSources(message.sources)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex w-full max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div 
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-600 ml-3' : 'bg-gray-700 mr-3'
          }`}
        >
          {isUser ? <FiUser className="text-white text-sm" /> : <FiCpu className="text-white text-sm" />}
        </div>
        
        <div 
          className={`px-5 py-4 rounded-2xl ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-sm' 
              : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm'
          } shadow-sm overflow-hidden text-[15px] leading-relaxed`}
        >
          <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-p:my-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="my-4 rounded-lg overflow-hidden border border-gray-700">
                      <div className="bg-gray-900 px-4 py-1 text-xs text-gray-400 font-mono flex justify-between items-center">
                        {match[1]}
                      </div>
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, background: '#1e1e1e', padding: '1rem' }}
                      />
                    </div>
                  ) : (
                    <code {...props} className="bg-gray-900 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[13px]">
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content || message.text || message.answer || '*(No content)*'}
            </ReactMarkdown>
          </div>
          
          {groupedSources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Sources</p>
              <div className="flex flex-wrap gap-2">
                {groupedSources.map((src, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-700/60 transition-colors cursor-default">
                    <FiFileText className="text-blue-400 text-sm flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-200 font-medium truncate max-w-[160px]">📄 {src.fileName}</span>
                      {src.pages.length > 0 && (
                        <span className="text-[10px] text-gray-500">
                          Page{src.pages.length > 1 ? 's' : ''} {src.pages.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

