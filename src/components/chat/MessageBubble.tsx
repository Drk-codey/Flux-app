import { motion } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { Lock, AlertTriangle, Check, CheckCheck } from 'lucide-react';
import type { DecryptedMessage } from '../../store/chatStore';

interface Props {
  message: DecryptedMessage;
  isSentByMe: boolean;
  showTimestamp?: boolean;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return format(d, 'HH:mm');
}

function formatDateDivider(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, MMM d');
}

export function MessageBubble({ message, isSentByMe }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex mb-1.5 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'} w-full max-w-[90%] md:max-w-[85%] lg:max-w-[75%]`}>
        {message.decrypting ? (
          <div
            className="px-4 py-3 rounded-2xl flex items-center gap-2"
            style={{
              background: isSentByMe ? 'rgba(110,47,255,0.6)' : 'rgba(13,11,24,0.06)',
            }}
          >
            <Lock size={12} className="animate-pulse" style={{ color: isSentByMe ? 'rgba(255,255,255,0.7)' : 'rgba(13,11,24,0.3)' }} />
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full typing-dot"
                  style={{ background: isSentByMe ? 'rgba(255,255,255,0.5)' : 'rgba(13,11,24,0.3)' }}
                />
              ))}
            </div>
          </div>
        ) : message.decryptError ? (
          <div
            className="px-4 py-3 rounded-2xl flex items-center gap-2 text-sm"
            style={{
              background: 'rgba(255,45,85,0.08)',
              border: '1px solid rgba(255,45,85,0.15)',
              color: '#c80737',
            }}
          >
            <AlertTriangle size={13} />
            <span className="text-xs font-medium">Unable to decrypt message</span>
          </div>
        ) : (
          <>
            <div className={isSentByMe ? 'bubble-out' : 'bubble-in'}>
              {/* Encrypted message text */}
              <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">{message.text}</p>

              {/* Time + delivery status */}
              <div className={`flex items-center gap-1 mt-1.5 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isSentByMe ? 'rgba(255,255,255,0.55)' : 'rgba(13,11,24,0.35)' }}
                >
                  {formatTime(message.created_at)}
                </span>
                {isSentByMe && (
                  message.delivered
                    ? <CheckCheck size={11} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    : <Check size={11} style={{ color: 'rgba(255,255,255,0.4)' }} />
                )}
              </div>
            </div>

            {/* E2EE micro-indicator */}
            <div className={`flex items-center gap-1 mt-0.5 ${isSentByMe ? 'flex-row-reverse' : ''}`}>
              <Lock size={8} style={{ color: 'rgba(5,150,105,0.6)' }} />
              <span className="text-[9px] font-medium" style={{ color: 'rgba(5,150,105,0.6)' }}>
                encrypted
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function DateDivider({ dateStr }: { dateStr: string }) {
  return (
    <div className="flex items-center gap-3 my-4 px-2">
      <div className="flex-1 h-px" style={{ background: 'rgba(110,47,255,0.08)' }} />
      <span
        className="text-[10px] font-semibold uppercase tracking-widest flex-shrink-0 px-3 py-1 rounded-full"
        style={{ color: 'rgba(13,11,24,0.4)', background: 'rgba(110,47,255,0.05)' }}
      >
        {formatDateDivider(dateStr)}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(110,47,255,0.08)' }} />
    </div>
  );
}