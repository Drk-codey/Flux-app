import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, ArrowRight, Lock, Shield, Eye, Send, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const
    },
  }),
};

export function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#0d0b18] selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-black/[0.03]">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-black/10">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-black">FLUX</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-black/20">Register</Link>
        </div>
      </nav>

      {/* 1. HERO SECTION — “Encrypted, But Beautiful” */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-hero-gradient">
        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-indigo-200/30 blur-[80px] md:blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              x: [0, -40, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-purple-200/20 blur-[100px] md:blur-[150px] rounded-full" 
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left pt-8 lg:pt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/80 backdrop-blur-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 md:mb-8"
            >
              <Sparkles size={12} className="text-indigo-500" />
              Secure by architectural choice
            </motion.div>
            
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-7xl lg:text-9xl font-black leading-[0.95] md:leading-[0.9] tracking-tighter mb-6 md:mb-8"
            >
              Encrypted,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Beautifully.</span>
            </motion.h1>
            
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-black/60 max-w-md mx-auto lg:mx-0 leading-relaxed mb-8 md:mb-10"
            >
              Flux is a high-fidelity messaging platform where military-grade encryption meets cinematic design. Your privacy isn't just a feature — it's an aesthetic.
            </motion.p>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/register" className="px-8 md:px-10 py-4 md:py-5 bg-black text-white rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl shadow-black/20">
                Get Early Access <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            <div className="glass-ui rounded-[32px] md:rounded-[40px] p-6 md:p-8 mt-8 w-full h-[550px] aspect-4/5 lg:aspect-4/5 relative overflow-hidden border-white/40 shadow-2xl animate-float">
              {/* Fake UI Content */}
              <div className="space-y-6">
                {[
                  { text: "Your keys never leave the device.", delay: 0 },
                  { text: "RSA-2048 + AES-GCM.", delay: 0.2 },
                  { text: "Zero metadata logging.", delay: 0.4 },
                ].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + msg.delay }}
                    className="glass-capsule px-6 py-4 rounded-3xl max-w-[80%] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent animate-pulse" />
                    <p className="text-sm font-semibold opacity-80">{msg.text}</p>
                  </motion.div>
                ))}
                
                <div className="pt-12 space-y-4">
                  <div className="h-2 w-1/3 bg-black/5 rounded-full" />
                  <div className="h-2 w-1/2 bg-black/5 rounded-full" />
                </div>
              </div>

              {/* Data stream ribbons */}
              <div className="absolute -bottom-20 -right-20 opacity-20 rotate-45 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-[2px] w-[600px] bg-indigo-500 mb-8" style={{ opacity: 1 - i * 0.2 }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURE SECTION — “Privacy in Motion” */}
      <section className="py-20 md:py-32 bg-[#fffcf5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative aspect-square max-w-lg mx-auto w-full">
              {/* Dynamic visualization */}
              <div className="absolute inset-0 flex items-center justify-center scale-75 md:scale-100">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border border-black/5 rounded-full relative"
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                      className="absolute w-3 md:w-4 h-3 md:h-4 rounded-full bg-coral-500"
                      style={{ 
                        top: '50%', 
                        left: '50%',
                        transform: `rotate(${i * 30}deg) translate(clamp(120px, 20vw, 250px))` 
                      }}
                    />
                  ))}
                </motion.div>
                
                <div className="absolute w-48 md:w-64 h-48 md:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col p-6 items-center justify-center text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 rounded-2xl md:rounded-3xl bg-indigo-50 flex items-center justify-center mb-4">
                    <Shield className="text-indigo-600" size={24} />
                  </div>
                  <h4 className="text-xs md:text-sm font-black uppercase tracking-widest mb-1">Encrypted</h4>
                  <p className="text-[9px] md:text-[10px] opacity-40 font-mono">X82-KLA-992-P</p>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-coral-500 mb-6 block">Living System</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">
                Messages that<br />
                live in the <span className="italic">void.</span>
              </h2>
              <p className="text-lg md:text-xl text-black/60 leading-relaxed mb-8 md:mb-12">
                Traditional apps "secure" your data on their servers. Flux secures your data at the moment of creation. Our backend is a blind processor — it moves information without ever knowing what it contains.
              </p>
              
              <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto lg:mx-0">
                <div>
                  <h5 className="font-black text-xl md:text-2xl mb-1 md:mb-2">0.0ms</h5>
                  <p className="text-[9px] md:text-xs uppercase font-bold tracking-widest opacity-40">Decryption Latency</p>
                </div>
                <div>
                  <h5 className="font-black text-xl md:text-2xl mb-1 md:mb-2">2048-bit</h5>
                  <p className="text-[9px] md:text-xs uppercase font-bold tracking-widest opacity-40">Identity Proof</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST / SECURITY SECTION — “Human-Centered Privacy” */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 block">Human Scale</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">
              Privacy as an<br />extension of self.
            </h2>
            <p className="text-lg md:text-xl text-black/60 leading-relaxed mb-8 md:mb-10">
              Your conversations are more than data — they're your thoughts, your intimacy, and your identity. We built Flux to feel like a vault that only you hold the key to.
            </p>
            
            <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
              {[
                { icon: Eye, title: "Zero Knowledge", desc: "We don't know who you are or what you say." },
                { icon: Lock, title: "Self-Custody", desc: "Your private keys live in your browser's indexedDB, never our servers." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 text-left">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl md:rounded-2xl bg-[#fcfaf7] flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg">{item.title}</h4>
                    <p className="text-xs md:text-sm opacity-50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2">
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              className="rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl aspect-square relative bg-gradient-to-br from-orange-50 to-purple-50"
            >
              <img 
                src="/flux_human_security.png" 
                alt="Human-Centered Security"
                className="w-full h-full object-cover mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
              
              {/* Floating UI bits */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-8 md:top-12 right-8 md:right-12 glass-ui p-3 md:p-4 rounded-xl md:rounded-2xl border-white shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-indigo-500" />
                  <div className="space-y-1">
                    <div className="h-1.5 md:h-2 w-12 md:w-16 bg-black/10 rounded-full" />
                    <div className="h-1 md:h-1.5 w-8 md:w-10 bg-black/5 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CTA / FINAL SECTION — “Send Freely” */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="/flux_send_freely_cta.png" 
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-12 inline-block"
          >
            <div className="w-24 md:w-32 h-24 md:h-32 rounded-[32px] md:rounded-[40px] bg-white flex items-center justify-center shadow-2xl animate-float">
              <Send size={32} className="md:size-[40px] text-indigo-600 rotate-[-15deg]" />
            </div>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter mb-8 md:mb-10 leading-[0.95] md:leading-none">
            Speak your truth.<br />
            <span className="italic opacity-80">Unobserved.</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-white text-black text-base md:text-lg font-black uppercase tracking-widest rounded-[20px] md:rounded-3xl hover:scale-110 transition-transform shadow-2xl active:scale-95 text-center"
            >
              Start Chatting
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 border-2 border-white/40 text-white text-base md:text-lg font-black uppercase tracking-widest rounded-[20px] md:rounded-3xl hover:bg-white/10 transition-colors backdrop-blur-md text-center"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-12 md:mt-16 text-white/50 text-[9px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
            AES-256-GCM · RSA-OAEP-2048 · Zero Knowledge
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-black text-white px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Zap size={16} className="text-black" fill="black" />
            </div>
            <span className="text-xl font-black tracking-tighter">FLUX</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="https://github.com/Drk-codey/Flux-app" className="hover:text-white transition-colors">Github</a>
            <a href="https://vercel.com/drkcodeys-projects/flux-app" className="hover:text-white transition-colors">Status</a>
          </div>
          <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest opacity-40">
            © 2026 Flux Cryptography Group.
          </p>
        </div>
      </footer>
    </div>
  );
}
