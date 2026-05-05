import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from './constants';

export function validateUsername(username: string): string | null {
  if (!username) {
    return 'Username is required';
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return `Username must be at most ${USERNAME_MAX_LENGTH} characters`;
  }

  // Only allow alphanumeric, underscore, and dash
  if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and dashes';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`;
  }

  return null;
}

export function validateDisplayName(displayName: string): string | null {
  if (!displayName) {
    return 'Display name is required';
  }

  if (displayName.length < 1) {
    return 'Display name is required';
  }

  if (displayName.length > 100) {
    return 'Display name must be at most 100 characters';
  }

  return null;
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
}