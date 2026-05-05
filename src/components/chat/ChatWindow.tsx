import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble, DateDivider } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useEncryption } from '../../hooks/useEncryption';
import { wsClient } from '../../lib/websocket/client';
import { apiClient } from '../../lib/api/client';
import { Lock, Phone, Video, MoreVertical, ArrowDown } from 'lucide-react';
import type { DecryptedMessage } from '../../store/chatStore';
import { useState } from 'react';
import { format } from 'date-fns';

interface Props {
  recipientId: string;
  recipientName: string;
}

const EMPTY_MESSAGES: DecryptedMessage[] = [];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarGradient(str: string) {
  const gradients = [
    'linear-gradient(135deg, #6e2fff, #ff2d55)',
    'linear-gradient(135deg, #ff2d55, #f97316)',
    'linear-gradient(135deg, #0ea5e9, #6e2fff)',
    'linear-gradient(135deg, #059669, #0ea5e9)',
    'linear-gradient(135deg, #f59e0b, #ff2d55)',
    'linear-gradient(135deg, #6e2fff, #059669)',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash + str.charCodeAt(i)) % gradients.length;
  return gradients[hash];
}

export function ChatWindow({ recipientId, recipientName }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const currentUserId = useAuthStore((state) => state.user?.id);
  const messages = useChatStore((state) =>
    state.conversations.get(recipientId) || EMPTY_MESSAGES
  );
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);
  const { encrypt, decrypt } = useEncryption();

  // Load message history
  useEffect(() => {
    setIsLoadingHistory(true);
    const load = async () => {
      try {
        const history = await apiClient.getMessages(recipientId, 50);
        const decrypted = await Promise.all(
          history.map(async (msg) => {
            try {
              const text = await decrypt(msg.payload, msg.from_user_id);
              return { ...msg, text };
            } catch {
              return { ...msg, text: '', decryptError: 'Failed to decrypt' };
            }
          })
        );
        setMessages(recipientId, decrypted.reverse());
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    load();
  }, [recipientId]);

  // Auto-scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll detection
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (text: string) => {
    try {
      const payload = await encrypt(text, recipientId);
      wsClient.sendMessage(recipientId, payload);
      addMessage(recipientId, {
        id: crypto.randomUUID(),
        from_user_id: currentUserId!,
        to_user_id: recipientId,
        text,
        delivered: false,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message — check your connection.');
    }
  };

  // Group messages by date for dividers
  const grouped: { type: 'divider' | 'message'; value: any }[] = [];
  let lastDate: string | null = null;
  for (const msg of messages) {
    const d = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (d !== lastDate) {
      grouped.push({ type: 'divider', value: msg.created_at });
      lastDate = d;
    }
    grouped.push({ type: 'message', value: msg });
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(110,47,255,0.08)',
        }}
      >
        <div
          className="avatar avatar-md"
          style={{ background: getAvatarGradient(recipientId) }}
        >
          {getInitials(recipientName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate" style={{ color: '#0d0b18' }}>{recipientName}</p>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Lock size={9} style={{ color: '#059669' }} />
            <span className="text-[10px] font-medium" style={{ color: '#059669' }}>End-to-end encrypted</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {[
            { icon: Phone, label: 'Call' },
            { icon: Video, label: 'Video' },
            { icon: MoreVertical, label: 'More' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ color: 'rgba(13,11,24,0.4)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(110,47,255,0.08)';
                e.currentTarget.style.color = '#6e2fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(13,11,24,0.4)';
              }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ background: '#f4f4f8' }}
      >
        {isLoadingHistory ? (
          <div className="space-y-4 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className="skeleton rounded-2xl" style={{ width: `${130 + i * 20}px`, height: '48px' }} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(110,47,255,0.08)' }}
            >
              <div
                className="avatar avatar-xl"
                style={{ background: getAvatarGradient(recipientId) }}
              >
                {getInitials(recipientName)}
              </div>
            </motion.div>

            <h3 className="text-lg font-black mb-2" style={{ color: '#0d0b18' }}>{recipientName}</h3>
            <div className="e2ee-badge mb-4">
              <span className="lock-dot" />
              <Lock size={9} />
              End-to-End Encrypted
            </div>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'rgba(13,11,24,0.45)' }}>
              This is the beginning of your encrypted conversation. Only you and {recipientName} can read these messages.
            </p>
          </motion.div>
        ) : (
          <>
            {grouped.map((item, idx) =>
              item.type === 'divider' ? (
                <DateDivider key={`divider-${idx}`} dateStr={item.value} />
              ) : (
                <MessageBubble
                  key={item.value.id}
                  message={item.value}
                  isSentByMe={item.value.from_user_id === currentUserId}
                />
              )
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-5 w-9 h-9 rounded-full flex items-center justify-center shadow-elevated"
            style={{ background: 'linear-gradient(135deg, #6e2fff, #5a18f0)', zIndex: 20 }}
          >
            <ArrowDown size={16} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Message input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}