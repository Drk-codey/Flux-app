// Shared type definitions across the application

export interface User {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
}

export interface ConversationPreview {
  user_id: string;
  display_name: string;
  username: string;
  last_message_at: string;
}

export interface WebSocketEvent {
  event: string;
  [key: string]: any;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed';