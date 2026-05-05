import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageCircle, ArrowRight } from 'lucide-react';
import { apiClient } from '../../lib/api/client';
import { useChatStore } from '../../store/chatStore';

interface UserSearchResult {
  id: string;
  username: string;
  display_name: string;
}

interface Props {
  onClose: () => void;
}

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

export function UserSearchModal({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const updateConversationList = useChatStore((state) => state.updateConversationList);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await apiClient.searchUsers(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: UserSearchResult) => {
    updateConversationList({
      user_id: user.id,
      username: user.username,
      display_name: user.display_name,
      last_message_at: new Date().toISOString(),
    });
    setActiveConversation(user.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(13,11,24,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'white', boxShadow: '0 40px 80px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid rgba(110,47,255,0.08)' }}
        >
          <div>
            <h3 className="text-lg font-black" style={{ color: '#0d0b18' }}>Find People</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(13,11,24,0.4)' }}>Start an encrypted conversation</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(13,11,24,0.06)' }}
          >
            <X size={16} style={{ color: '#0d0b18' }} />
          </button>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="p-5 pb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by username or name..."
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary flex-shrink-0" disabled={loading || !query.trim()}>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <Search size={16} />
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto px-3 pb-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 mb-1">
                    <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 w-28 rounded" />
                      <div className="skeleton h-2.5 w-20 rounded" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : !searched ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center"
              >
                <MessageCircle size={32} className="mx-auto mb-3" style={{ color: 'rgba(110,47,255,0.2)' }} />
                <p className="text-sm" style={{ color: 'rgba(13,11,24,0.4)' }}>Type a name and search</p>
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center"
              >
                <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(13,11,24,0.5)' }}>No users found</p>
                <p className="text-xs" style={{ color: 'rgba(13,11,24,0.3)' }}>Try a different search term</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                {results.map((user, i) => (
                  <motion.button
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSelectUser(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(110,47,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(110,47,255,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div
                      className="avatar avatar-md flex-shrink-0"
                      style={{ background: getAvatarGradient(user.id) }}
                    >
                      {getInitials(user.display_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#0d0b18' }}>
                        {user.display_name}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'rgba(13,11,24,0.45)' }}>
                        @{user.username}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-150"
                      style={{ color: '#6e2fff' }}
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}