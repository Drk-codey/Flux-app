import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle, Search } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { apiClient } from '../../lib/api/client';
import { UserSearchModal } from './UserSearchModal';
import { formatDistanceToNow } from 'date-fns';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Deterministic gradient from string
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

export function Sidebar() {
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const { activeConversation, setActiveConversation, conversationList, setConversationList } = useChatStore();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getConversations();
        setConversationList(data);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = localSearch
    ? conversationList.filter(
        (c) =>
          c.display_name.toLowerCase().includes(localSearch.toLowerCase()) ||
          c.username.toLowerCase().includes(localSearch.toLowerCase())
      )
    : conversationList;

  return (
    <>
      <aside
        className="w-72 xl:w-80 flex flex-col flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(110,47,255,0.08)',
        }}
      >
        {/* Sidebar Header */}
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black" style={{ color: '#0d0b18' }}>Messages</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(true)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'linear-gradient(135deg, #6e2fff, #5a18f0)' }}
              title="New conversation"
            >
              <Plus size={16} className="text-white" />
            </motion.button>
          </div>

          {/* Search within conversations */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl outline-none transition-all"
              style={{
                background: 'rgba(110,47,255,0.06)',
                border: '1px solid rgba(110,47,255,0.1)',
                color: '#0d0b18',
              }}
            />
          </div>
        </div>

        <div className="divider-gradient mx-4" />

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            // Skeleton
            <div className="px-4 space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-24 rounded" />
                    <div className="skeleton h-2.5 w-36 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onNew={() => setShowSearch(true)} hasSearch={!!localSearch} />
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((conv, i) => (
                <motion.button
                  key={conv.user_id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setActiveConversation(conv.user_id)}
                  className={`conv-item w-full text-left ${activeConversation === conv.user_id ? 'active' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className="avatar avatar-md flex-shrink-0"
                    style={{ background: getAvatarGradient(conv.user_id) }}
                  >
                    {getInitials(conv.display_name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate" style={{ color: '#0d0b18' }}>
                        {conv.display_name}
                      </p>
                      <span className="text-xs ml-2 flex-shrink-0" style={{ color: 'rgba(13,11,24,0.35)' }}>
                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false })}
                      </span>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(13,11,24,0.45)' }}>
                      @{conv.username}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="trust-bar flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-lock-pulse" />
          All conversations end-to-end encrypted
        </div>
      </aside>

      <AnimatePresence>
        {showSearch && <UserSearchModal onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </>
  );
}

function EmptyState({ onNew, hasSearch }: { onNew: () => void; hasSearch: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <Search size={32} style={{ color: 'rgba(110,47,255,0.2)' }} className="mb-3" />
        <p className="text-sm font-semibold" style={{ color: 'rgba(13,11,24,0.5)' }}>No matches found</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(13,11,24,0.3)' }}>Try a different name</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(110,47,255,0.08)' }}
      >
        <MessageCircle size={28} style={{ color: 'rgba(110,47,255,0.4)' }} />
      </motion.div>
      <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(13,11,24,0.6)' }}>No conversations yet</p>
      <p className="text-xs mb-5" style={{ color: 'rgba(13,11,24,0.35)' }}>Find someone to start a secure chat</p>
      <button onClick={onNew} className="btn-primary text-xs px-4 py-2">
        <Plus size={14} />
        New conversation
      </button>
    </div>
  );
}