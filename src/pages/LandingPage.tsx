import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Lock, Shield, ArrowRight, Check, Key, Globe } from 'lucide-react';

const features = [
  {
    icon: Key,
    title: 'Client-side key generation',
    desc: 'Your RSA-2048 key pair is generated inside your browser. The server only ever sees encrypted data.',
    color: '#6e2fff',
  },
  {
    icon: Lock,
    title: 'AES-GCM + RSA-OAEP hybrid',
    desc: 'Each message is encrypted with a unique AES-256 key, wrapped with the recipient\'s RSA public key.',
    color: '#ff2d55',
  },
  {
    icon: Shield,
    title: 'PBKDF2 key protection',
    desc: '100,000 iterations of SHA-256 derive a key from your password to wrap your private key at rest.',
    color: '#059669',
  },
  {
    icon: Globe,
    title: 'Zero-knowledge backend',
    desc: 'Our servers process ciphertext only. No plaintext messages are ever transmitted or stored.',
    color: '#f59e0b',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#f4f4f8' }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(244,244,248,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(110,47,255,0.08)',
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6e2fff, #5a18f0)' }}
          >
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-black" style={{ color: '#0d0b18' }}>Flux</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(170deg, #190654 0%, #2c0a7a 35%, #4910cc 65%, #f4f4f8 100%)',
          minHeight: '90vh',
        }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle, #ff2d55 0%, transparent 70%)', top: '-10%', right: '-10%' }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute rounded-full"
            style={{ width: 400, height: 400, background: 'radial-gradient(circle, #a886ff 0%, transparent 70%)', bottom: '10%', left: '-5%' }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            End-to-End Encrypted · Zero Knowledge · Open Standard Crypto
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-7xl font-black leading-[1.05] mb-6 text-white"
          >
            Private conversations,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ff97a8, #ff2d55)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              reimagined.
            </span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Flux uses military-grade cryptography to ensure that only you and your recipient can read your messages. Not us. Not anyone.
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base">
              Start messaging for free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="px-8 py-3.5 text-base font-semibold rounded-xl transition-all"
              style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Sign in
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-6 mt-12 flex-wrap"
          >
            {[
              'RSA-OAEP 2048-bit',
              'AES-256-GCM',
              'PBKDF2 · 100K iterations',
              'Open standard WebCrypto',
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check size={12} style={{ color: 'rgba(34,197,94,0.8)' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {item}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Chat preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-lg mx-auto mt-16"
        >
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
            }}
          >
            {/* Mock messages */}
            {[
              { out: false, text: 'Hey! Is Flux really E2EE?', delay: 0.6 },
              { out: true, text: 'Yes! Every message is encrypted with your RSA key 🔐', delay: 0.8 },
              { out: false, text: 'Amazing. Even the server can\'t see it?', delay: 1.0 },
              { out: true, text: 'Zero knowledge. Only you and I can decrypt these messages.', delay: 1.2 },
            ].map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.out ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: msg.delay, duration: 0.4 }}
                className={`flex ${msg.out ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm font-medium max-w-[80%]"
                  style={msg.out
                    ? { background: 'rgba(110,47,255,0.85)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }
                  }
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Trust bar */}
            <div
              className="flex items-center justify-center gap-2 pt-2 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <Lock size={9} style={{ color: 'rgba(34,197,94,0.7)' }} />
              <span className="text-[9px] font-semibold" style={{ color: 'rgba(34,197,94,0.7)' }}>
                All messages end-to-end encrypted
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#6e2fff' }}
            >
              Security by design
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black"
              style={{ color: '#0d0b18' }}
            >
              Cryptography you can trust
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${color}16`, border: `1px solid ${color}28` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: '#0d0b18' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,11,24,0.55)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 px-6 text-center"
        style={{
          background: 'linear-gradient(135deg, #190654 0%, #4910cc 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Start messaging securely today
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Free forever. No data collection. No ads. Just encrypted conversations.
          </p>
          <Link to="/register" className="btn-primary px-10 py-4 text-base">
            Create free account
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 text-center"
        style={{ borderTop: '1px solid rgba(110,47,255,0.08)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6e2fff, #5a18f0)' }}
          >
            <Zap size={12} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: '#0d0b18' }}>Flux</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(13,11,24,0.4)' }}>
          End-to-end encrypted · Zero knowledge · Open standard cryptography
        </p>
      </footer>
    </div>
  );
}
