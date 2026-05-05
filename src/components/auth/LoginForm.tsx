import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../lib/api/client';
import { restorePrivateKey, importPublicKey } from '../../lib/crypto/keyManagement';
import { useAuthStore } from '../../store/authStore';
import { useKeyStore } from '../../store/keyStore';
import { Loader2, User, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setKeys = useKeyStore((state) => state.setKeys);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login({ username, password });
      setAuth(response.user, response.access_token, response.refresh_token);
      apiClient.setAccessToken(response.access_token);

      const privateKey = await restorePrivateKey(
        response.user.wrapped_private_key,
        response.user.pbkdf2_salt,
        password
      );
      const publicKey = await importPublicKey(response.user.public_key);
      setKeys(privateKey, publicKey);

      navigate('/chat');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label htmlFor="login-username" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(13,11,24,0.45)' }}>
          Username
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }}>
            <User size={15} />
          </div>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field pl-5"
            placeholder="Input Your handle"
            required
            autoComplete="username"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(13,11,24,0.45)' }}>
          Password
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }}>
            <Lock size={15} />
          </div>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-5 pr-12"
            placeholder="Your password"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'rgba(13,11,24,0.3)' }}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <p className="text-xs mt-1.5" style={{ color: 'rgba(13,11,24,0.35)' }}>
          Used to decrypt your private key locally
        </p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,45,85,0.08)', color: '#c80737', border: '1px solid rgba(255,45,85,0.2)' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}