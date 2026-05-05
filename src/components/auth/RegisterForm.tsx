import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../lib/api/client';
import { setupKeysForRegistration } from '../../lib/crypto/keyManagement';
import { useAuthStore } from '../../store/authStore';
import { Loader2, User, AlignLeft, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Symbol', pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score - 1] : '#ebebf2' }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(({ label, pass }) => (
            <span key={label} className="text-xs flex items-center gap-1" style={{ color: pass ? '#059669' : 'rgba(13,11,24,0.35)' }}>
              {pass && <CheckCircle2 size={10} />}
              {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className="text-xs font-semibold" style={{ color: colors[score - 1] }}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [keyGenStep, setKeyGenStep] = useState(0); // 0=idle, 1=generating, 2=done

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setKeyGenStep(1);

    try {
      const keys = await setupKeysForRegistration(password);
      setKeyGenStep(2);

      const response = await apiClient.register({
        username,
        display_name: displayName,
        password,
        public_key: keys.publicKey,
        wrapped_private_key: keys.wrappedPrivateKey,
        pbkdf2_salt: keys.pbkdf2Salt,
      });

      setAuth(response.user, response.access_token, response.refresh_token);
      apiClient.setAccessToken(response.access_token);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setKeyGenStep(0);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      id: 'username',
      label: 'Username',
      type: 'text',
      value: username,
      onChange: setUsername,
      icon: User,
      placeholder: 'Input your handle',
      inputProps: { minLength: 3, maxLength: 32, pattern: '[a-zA-Z0-9_\\-]+' },
    },
    {
      id: 'displayName',
      label: 'Display Name',
      type: 'text',
      value: displayName,
      onChange: setDisplayName,
      icon: AlignLeft,
      placeholder: 'How you appear to others',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {inputFields.map(({ id, label, type, value, onChange, icon: Icon, placeholder, inputProps }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(13,11,24,0.45)' }}>
            {label}
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }}>
              <Icon size={15} />
            </div>
            <input
              id={id}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="input-field pl-5"
              placeholder={placeholder}
              required
              {...inputProps}
            />
          </div>
        </div>
      ))}

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(13,11,24,0.45)' }}>
          Password
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }}>
            <Lock size={15} />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-5 pr-12"
            placeholder="Min. 8 characters"
            required
            minLength={8}
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
        <AnimatePresence>
          {password && <PasswordStrength password={password} />}
        </AnimatePresence>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(13,11,24,0.45)' }}>
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(13,11,24,0.3)' }}>
            <Lock size={15} />
          </div>
          <input
            id="confirm"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field pl-5 pr-12"
            placeholder="Repeat your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'rgba(13,11,24,0.3)' }}
          >
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>Passwords don't match</p>
        )}
        {confirmPassword && password === confirmPassword && password.length >= 8 && (
          <p className="text-xs mt-1.5 font-medium flex items-center gap-1" style={{ color: '#059669' }}>
            <CheckCircle2 size={11} /> Passwords match
          </p>
        )}
      </div>

      {/* Key generation status */}
      <AnimatePresence>
        {keyGenStep > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3 rounded-xl flex items-center gap-3"
            style={{ background: keyGenStep === 2 ? 'rgba(34,197,94,0.08)' : 'rgba(110,47,255,0.08)', border: `1px solid ${keyGenStep === 2 ? 'rgba(34,197,94,0.2)' : 'rgba(110,47,255,0.15)'}` }}
          >
            {keyGenStep === 1 ? (
              <>
                <Loader2 size={14} className="animate-spin flex-shrink-0" style={{ color: '#6e2fff' }} />
                <span className="text-xs font-medium" style={{ color: '#6e2fff' }}>Generating your cryptographic key pair...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="flex-shrink-0" style={{ color: '#059669' }} />
                <span className="text-xs font-medium" style={{ color: '#059669' }}>Keys generated! Securing your account...</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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

      <button
        type="submit"
        className="btn-primary w-full mt-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
}