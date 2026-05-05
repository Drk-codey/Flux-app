import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Lock, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useKeyStore } from '../../store/keyStore';
import { apiClient } from '../../lib/api/client';
import { useState } from 'react';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Header() {
  const navigate = useNavigate();
  const { user, refreshToken, clearAuth } = useAuthStore();
  const clearKeys = useKeyStore((state) => state.clearKeys);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (refreshToken) await apiClient.logout(refreshToken);
    } catch {}
    finally {
      clearAuth();
      clearKeys();
      apiClient.setAccessToken(null);
      navigate('/login');
    }
  };

  return (
    <header
      className="flex items-center justify-between px-5 py-3 flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(110,47,255,0.08)',
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6e2fff 0%, #5a18f0 100%)' }}
        >
          <Zap size={16} className="text-white" fill="white" />
        </div>
        <span className="text-xl font-black tracking-tight" style={{ color: '#0d0b18' }}>Flux</span>

        {/* E2EE indicator */}
        <div className="e2ee-badge ml-1">
          <span className="lock-dot" />
          <Lock size={9} />
          E2EE
        </div>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
          style={{ background: menuOpen ? 'rgba(110,47,255,0.08)' : 'transparent' }}
        >
          {/* Avatar */}
          <div className="avatar avatar-sm">
            {getInitials(user?.display_name || user?.username || 'U')}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold leading-tight" style={{ color: '#0d0b18' }}>
              {user?.display_name}
            </p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(13,11,24,0.4)' }}>
              @{user?.username}
            </p>
          </div>
          <ChevronDown
            size={14}
            className="transition-transform"
            style={{
              color: 'rgba(13,11,24,0.4)',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)',
            }}
          />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
            style={{
              background: 'white',
              border: '1px solid rgba(110,47,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              zIndex: 100,
            }}
          >
            <div className="p-3 border-b" style={{ borderColor: 'rgba(110,47,255,0.08)' }}>
              <div className="avatar avatar-md mx-auto mb-2">
                {getInitials(user?.display_name || user?.username || 'U')}
              </div>
              <p className="text-center text-sm font-semibold" style={{ color: '#0d0b18' }}>
                {user?.display_name}
              </p>
              <p className="text-center text-xs" style={{ color: 'rgba(13,11,24,0.4)' }}>
                @{user?.username}
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: '#c80737' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,45,85,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Backdrop to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 39 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}