import type { EncryptedMessage } from '../crypto/types';

export interface RegisterRequest {
  username: string;
  display_name: string;
  password: string;
  public_key: string;
  wrapped_private_key: string;
  pbkdf2_salt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  public_key: string;
  wrapped_private_key: string;
  pbkdf2_salt: string;
  created_at: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  display_name: string;
}

export interface PublicKeyResponse {
  public_key: string;
}

export interface Conversation {
  user_id: string;
  display_name: string;
  username: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  payload: EncryptedMessage;
  delivered: boolean;
  created_at: string;
}

export interface SendMessageRequest {
  to: string;
  payload: EncryptedMessage;
}