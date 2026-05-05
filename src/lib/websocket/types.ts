import type { EncryptedMessage } from '../crypto/types';

// Client to Server Events
export interface MessageSendEvent {
  event: 'message.send';
  to: string;
  payload: EncryptedMessage;
}

// Server to Client Events
export interface MessageReceiveEvent {
  event: 'message.receive';
  id: string;
  from_user_id: string;
  to_user_id: string;
  payload: EncryptedMessage;
  created_at: string;
}

export interface UserOnlineEvent {
  event: 'user.online';
  user_id: string;
}

export interface UserOfflineEvent {
  event: 'user.offline';
  user_id: string;
}

export interface ErrorEvent {
  event: 'error';
  detail: string;
}

export type WebSocketServerEvent =
  | MessageReceiveEvent
  | UserOnlineEvent
  | UserOfflineEvent
  | ErrorEvent;

export type WebSocketClientEvent = MessageSendEvent;