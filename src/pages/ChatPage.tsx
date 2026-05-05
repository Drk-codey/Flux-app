import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { useEncryption } from '../hooks/useEncryption';
import { apiClient } from '../lib/api/client';
import { MessageCircle, Lock, Zap } from 'lucide-react';

export function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const activeConversation = useChatStore((state) => state.activeConversation);
  const addMessage = useChatStore((state) => state.addMessage);
  const conversationList = useChatStore((state) => state.conversationList);
  const setConversationList = useChatStore((state) => state.setConversationList);
  const updateConversationList = useChatStore((state) => state.updateConversationList);
  const { decrypt } = useEncryption();

  const handleWebSocketMessage = useCallback(
    async (event: any) => {
      if (event.event === 'message.receive') {
        try {
          const text = await decrypt(event.payload, event.from_user_id);
          addMessage(event.from_user_id, {
            id: event.id,
            from_user_id: event.from_user_id,
            to_user_id: event.to_user_id,
            text,
            delivered: true,
            created_at: event.created_at,
          });
          const exists = conversationList.find((c) => c.user_id === event.from_user_id);
          if (exists) {
            updateConversationList({ ...exists, last_message_at: event.created_at });
          } else {
            apiClient.getConversations().then(setConversationList).catch(console.error);
          }
        } catch (err) {
          console.error('Failed to decrypt incoming message:', err);
          addMessage(event.from_user_id, {
            id: event.id,
            from_user_id: event.from_user_id,
            to_user_id: event.to_user_id,
            text: '',
            delivered: true,
            created_at: event.created_at,
            decryptError: 'Failed to decrypt',
          });
        }
      }
    },
    [decrypt, addMessage, conversationList, updateConversationList, setConversationList]
  );

  useWebSocket(handleWebSocketMessage);

  const activeUser = activeConversation
    ? conversationList.find((c) => c.user_id === activeConversation)
    : null;
  const recipientName = activeUser?.display_name || 'User';

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#f4f4f8' }}
    >
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeConversation ? (
            <ErrorBoundary>
              <ChatWindow
                recipientId={activeConversation}
                recipientName={recipientName}
              />
            </ErrorBoundary>
          ) : (
            <WelcomeScreen username={user?.display_name} />
          )}
        </main>
      </div>
    </div>
  );
}

function WelcomeScreen({ username }: { username?: string }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
      style={{ background: '#f4f4f8' }}
    >
      {/* Animated logo */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-8"
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #6e2fff, #5a18f0)',
            boxShadow: '0 20px 60px rgba(110,47,255,0.35)',
          }}
        >
          <Zap size={40} className="text-white" fill="white" />
        </div>
        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{ transformOrigin: '50% 50%' }}
        >
          <div
            className="absolute w-4 h-4 rounded-full -top-1.5 left-1/2 -translate-x-1/2"
            style={{
              background: 'linear-gradient(135deg, #ff2d55, #ff97a8)',
              boxShadow: '0 0 10px rgba(255,45,85,0.5)',
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-black mb-2" style={{ color: '#0d0b18' }}>
          {username ? `Welcome, ${username}` : 'Welcome to Flux'}
        </h2>
        <p className="text-base mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: 'rgba(13,11,24,0.5)' }}>
          Select a conversation from the sidebar, or start a new encrypted chat
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          {[
            { icon: Lock, label: 'End-to-End Encrypted', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
            { icon: MessageCircle, label: 'Zero-knowledge backend', color: '#6e2fff', bg: 'rgba(110,47,255,0.08)' },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: bg, border: `1px solid ${color}22` }}
            >
              <Icon size={14} style={{ color }} />
              <span className="text-xs font-semibold" style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute w-96 h-96 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, rgba(110,47,255,0.06) 0%, transparent 70%)', top: '20%', right: '10%' }} />
        <div className="absolute w-72 h-72 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.05) 0%, transparent 70%)', bottom: '20%', left: '10%' }} />
      </div>
    </div>
  );
}