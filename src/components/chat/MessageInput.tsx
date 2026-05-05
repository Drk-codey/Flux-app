import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !disabled) {
        onSend(text.trim());
        setText('');
      }
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div
      className="flex-shrink-0 px-4 py-3"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(110,47,255,0.08)',
      }}
    >
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div
          className="flex-1 rounded-2xl overflow-hidden transition-all"
          style={{
            background: 'rgba(110,47,255,0.05)',
            border: '1.5px solid rgba(110,47,255,0.12)',
            boxShadow: text ? '0 0 0 3px rgba(110,47,255,0.06)' : 'none',
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 text-sm outline-none resize-none bg-transparent"
            style={{
              color: '#0d0b18',
              maxHeight: '140px',
              lineHeight: '1.5',
            }}
          />

          {/* Encryption hint */}
          {text && (
            <div className="flex items-center gap-1.5 px-4 pb-2">
              <Lock size={9} style={{ color: 'rgba(5,150,105,0.6)' }} />
              <span className="text-[9px] font-medium" style={{ color: 'rgba(5,150,105,0.6)' }}>
                Will be encrypted before sending
              </span>
            </div>
          )}
        </div>

        {/* Send button */}
        <motion.button
          type="submit"
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.05 } : {}}
          whileTap={canSend ? { scale: 0.95 } : {}}
          animate={{
            background: canSend
              ? 'linear-gradient(135deg, #6e2fff 0%, #5a18f0 100%)'
              : 'rgba(13,11,24,0.08)',
          }}
          transition={{ duration: 0.2 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-shadow disabled:cursor-not-allowed"
          style={{ boxShadow: canSend ? '0 4px 15px rgba(110,47,255,0.35)' : 'none' }}
        >
          <Send
            size={16}
            style={{ color: canSend ? 'white' : 'rgba(13,11,24,0.3)' }}
          />
        </motion.button>
      </form>

      {/* Keyboard hint */}
      <p className="text-center text-[10px] mt-2" style={{ color: 'rgba(13,11,24,0.25)' }}>
        ⏎ Send &nbsp;·&nbsp; ⇧⏎ New line
      </p>
    </div>
  );
}