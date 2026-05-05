import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Zap, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-mesh flex items-center justify-center p-6"
    >
      <div className="text-center max-w-md">
        {/* Glitchy 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <h1
            className="text-[10rem] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #6e2fff, #ff2d55)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 20px 40px rgba(110,47,255,0.3))',
            }}
          >
            404
          </h1>

          {/* Logo overlay */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 60px rgba(110,47,255,0.2)',
            }}
          >
            <Zap size={36} fill="#6e2fff" style={{ color: '#6e2fff' }} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-black mb-3" style={{ color: '#0d0b18' }}>
            Page not found
          </h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(13,11,24,0.5)' }}>
            This page seems to have gone offline — like an unencrypted message, it was never meant to last.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/" className="btn-primary">
              <Home size={16} />
              Back to Flux
            </Link>
            <button onClick={() => window.history.back()} className="btn-secondary">
              <ArrowLeft size={16} />
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}