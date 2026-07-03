import React from 'react';
import { DocumentProvider } from './context/DocumentContext';
import { ConversationProvider } from './context/ConversationContext';
import { ChatProvider } from './context/ChatContext';
import { Home } from './pages/Home';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <DocumentProvider>
      <ConversationProvider>
        <ChatProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#374151',
                color: '#fff',
              },
            }}
          />
          <Home />
        </ChatProvider>
      </ConversationProvider>
    </DocumentProvider>
  );
}

export default App;
