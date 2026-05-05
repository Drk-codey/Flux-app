import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Zap, ArrowLeft } from 'lucide-react';
import RegisterImg from '../assets/Register-img.png';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-mesh flex items-stretch">
      {/* Left Panel — Image */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block w-1/2 relative overflow-hidden"
      >
        <img 
          src={RegisterImg} 
          alt="Friends connecting" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Logo overlay */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
              <Zap size={20} className="text-primary-600" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight drop-shadow-md bg-white/50 px-2 rounded-md">Flux</span>
          </div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
        {/* Mobile logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden flex items-center gap-2 mb-8"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6e2fff, #5a18f0)' }}>
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="text-2xl font-bold tracking-tight" style={{ color: '#190654' }}>Flux</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors hover:text-primary-600"
            style={{ color: 'rgba(13,11,24,0.4)' }}
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2" style={{ color: '#0d0b18' }}>Create your account</h1>
            <p className="text-sm" style={{ color: 'rgba(13,11,24,0.5)' }}>
              Join the conversation and connect securely.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <RegisterForm />

            <div className="mt-6 text-center text-sm" style={{ color: 'rgba(13,11,24,0.5)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#6e2fff' }}>
                Sign in
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <div className="e2ee-badge">
              <span className="lock-dot" />
              End-to-End Encrypted
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}