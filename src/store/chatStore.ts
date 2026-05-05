import { create } from 'zustand';
import type { Message, Conversation } from '../lib/api/types';

export interface DecryptedMessage extends Omit<Message, 'payload'> {
  text: string;
  decrypting?: boolean;
  decryptError?: string;
}

interface ChatState {
  conversations: Map<string, DecryptedMessage[]>;
  activeConversation: string | null;
  conversationList: Conversation[];
  
  setActiveConversation: (userId: string) => void;
  setConversationList: (list: Conversation[]) => void;
  updateConversationList: (conv: Conversation) => void;
  addMessage: (userId: string, message: DecryptedMessage) => void;
  setMessages: (userId: string, messages: DecryptedMessage[]) => void;
  updateMessageDecryption: (
    userId: string,
    messageId: string,
    text: string
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: new Map(),
  activeConversation: null,
  conversationList: [],

  setActiveConversation: (userId) =>
    set({ activeConversation: userId }),

  setConversationList: (list) =>
    set({ conversationList: list }),

  updateConversationList: (conv) =>
    set((state) => {
      const exists = state.conversationList.find(c => c.user_id === conv.user_id);
      if (exists) {
        return {
          conversationList: state.conversationList.map(c => 
            c.user_id === conv.user_id ? { ...c, ...conv } : c
          )
        };
      }
      return { conversationList: [conv, ...state.conversationList] };
    }),

  addMessage: (userId, message) =>
    set((state) => {
      const newConversations = new Map(state.conversations);
      const messages = newConversations.get(userId) || [];
      newConversations.set(userId, [...messages, message]);
      return { conversations: newConversations };
    }),

  setMessages: (userId, messages) =>
    set((state) => {
      const newConversations = new Map(state.conversations);
      newConversations.set(userId, messages);
      return { conversations: newConversations };
    }),

  updateMessageDecryption: (userId, messageId, text) =>
    set((state) => {
      const newConversations = new Map(state.conversations);
      const messages = newConversations.get(userId) || [];
      const updated = messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, text, decrypting: false }
          : msg
      );
      newConversations.set(userId, updated);
      return { conversations: newConversations };
    }),
}));