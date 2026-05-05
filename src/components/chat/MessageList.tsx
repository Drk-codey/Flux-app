import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import type { DecryptedMessage } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';

interface Props {
  messages: DecryptedMessage[];
}

export function MessageList({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useAuthStore((state) => state.user?.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isSentByMe={message.from_user_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}