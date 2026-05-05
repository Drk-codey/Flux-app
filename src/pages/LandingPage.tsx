import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Send, ArrowRight, Lock, Check } from 'lucide-react';

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fdfdfc]">
      <div className="grain-overlay" />

      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 mix-blend-difference">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Zap size={16} className="text-black" fill="black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Flux</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:scale-105 transition-transform">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 1. HERO SECTION: "Encrypted, But Beautiful" --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Soft volumetric gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf7] via-[#f0f0fa] to-[#e6f0ff] -z-20" />
        
        {/* Abstract flowing ribbons */}
        <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center">
          <motion.div 
            className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[80px] mix-blend-multiply opacity-40 animate-orb-1"
            style={{ background: 'radial-gradient(circle, #e0c3fc 0%, rgba(142, 197, 252, 0) 70%)' }}
          />
          <motion.div 
            className="absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full blur-[80px] mix-blend-multiply opacity-30 animate-orb-2"
            style={{ background: 'radial-gradient(circle, #8ec5fc 0%, rgba(224, 195, 252, 0) 70%)', right: '-10%', top: '20%' }}
          />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
          {/* Typographic side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-white/40 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6e2fff] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black/60">End-to-End Encrypted</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8 text-[#1a1a24]">
              Your words.<br />
              <span className="text-gradient-purple">Only yours.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-black/50 leading-relaxed mb-10 max-w-md font-medium">
              Flux protects every conversation with military-grade encryption, so you can connect freely, privately, beautifully.
            </p>
            
            <div className="flex items-center gap-4">
              <Link to="/register" className="btn-primary shadow-2xl shadow-purple-500/30">
                Start Messaging <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* 3D Glass UI Mockup */}
          <motion.div 
            style={{ y: heroY }}
            initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
            animate={{ opacity: 1, rotateY: -15, rotateX: 5, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="relative lg:h-[700px] flex items-center justify-center perspective-[2000px] transform-gpu"
          >
            <div className="glass-panel w-full max-w-[400px] rounded-[40px] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6e2fff] to-[#0ea5e9] flex items-center justify-center text-white font-bold shadow-lg">A</div>
                  <div>
                    <h3 className="font-bold text-sm">Ava</h3>
                    <p className="text-[10px] text-green-600 flex items-center gap-1 font-semibold">
                      <Lock size={8} /> Encrypted
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-6 mb-8 relative">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="hero-bubble w-[85%]">
                  Just sent over the final mockups ✨
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="hero-bubble encrypted w-[85%] ml-auto">
                  <div className="liquid-light" />
                  These look incredible!
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }} className="hero-bubble w-[85%]">
                  Love the direction. Let's ship it! 🚀
                </motion.div>
              </div>

              {/* Input */}
              <div className="h-12 w-full rounded-full bg-white/50 border border-white/60 flex items-center px-4">
                <span className="text-xs text-black/30 font-medium">Type a message...</span>
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-1/4 glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-[#6e2fff]"
            >
              <Shield size={14} /> AES-256-GCM
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. FEATURE SECTION: "Privacy in Motion" --- */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#faf9f6]">
        {/* Abstract animated paths */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <svg className="absolute w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path id="path1" d="M -100,200 C 300,100 600,800 1100,300" fill="none" stroke="url(#grad1)" strokeWidth="80" strokeLinecap="round" className="blur-[20px] opacity-30" />
            <path id="path2" d="M -100,800 C 400,900 500,200 1100,600" fill="none" stroke="url(#grad2)" strokeWidth="120" strokeLinecap="round" className="blur-[30px] opacity-20" />
            <defs>
              <linearGradient id="grad1"><stop offset="0%" stopColor="#ff7e5f"/><stop offset="100%" stopColor="#feb47b"/></linearGradient>
              <linearGradient id="grad2"><stop offset="0%" stopColor="#6e2fff"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center"
          >
            {/* Visualizer */}
            <div className="relative w-full max-w-[400px] aspect-square rounded-full border border-black/5 bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border border-dashed border-[#6e2fff]/30" />
              
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ff2d55] to-[#6e2fff] flex items-center justify-center shadow-[0_0_60px_rgba(110,47,255,0.4)] relative z-10">
                <Lock size={40} className="text-white" />
              </div>

              {/* Orbiting nodes */}
              {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  className="absolute w-12 h-12 rounded-full glass-pill flex items-center justify-center shadow-lg"
                  animate={{ 
                    x: [Math.cos(i*2)*150, Math.cos(i*2)*180, Math.cos(i*2)*150],
                    y: [Math.sin(i*2)*150, Math.sin(i*2)*180, Math.sin(i*2)*150],
                  }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-xs font-mono font-bold text-[#6e2fff]">**#@!</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="order-1 lg:order-2">
            <h2 className="text-5xl font-black mb-6 text-[#1a1a24] leading-tight">
              Privacy in <span className="text-gradient">Motion.</span>
            </h2>
            <p className="text-xl text-black/50 mb-10 leading-relaxed font-medium">
              We've turned complex cryptography into an invisible, living system. Messages are scrambled into unrecognizable fragments before they ever leave your device.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: 'Zero-Knowledge Architecture', desc: 'Our servers never see your plaintext data.' },
                { title: 'Perfect Forward Secrecy', desc: 'New keys are generated for every single message.' },
                { title: 'Local Device Encryption', desc: 'Keys never leave the secure enclave of your browser.' }
              ].map((feature, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#6e2fff]/10 flex items-center justify-center flex-shrink-0 text-[#6e2fff]">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a24] text-lg">{feature.title}</h4>
                    <p className="text-black/50">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --- 3. TRUST SECTION: "Human-Centered Privacy" --- */}
      <section className="py-32 px-6 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl lg:text-7xl font-black text-[#1a1a24] mb-6 tracking-tight"
          >
            Human-Centered <span className="text-gradient-purple">Privacy.</span>
          </motion.h2>
          <p className="text-xl text-black/50 max-w-2xl mx-auto font-medium">
            Security shouldn't feel like a vault. It should feel like a safe space where you can be your most authentic self.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto h-[600px] flex items-center justify-center">
          {/* Abstract human silhouette concept */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-20 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
            className="relative w-[300px] h-[500px] rounded-full blur-[2px] bg-gradient-to-b from-[#fde6e6] to-[#e6e9fd] opacity-80 silhouette-mask shadow-[0_0_100px_rgba(255,45,85,0.2)]"
          >
            {/* Floating protected fragments inside */}
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/4 left-4 glass-pill px-3 py-1.5 rounded-full text-[10px] font-bold text-black/40 blur-[1px]">@alex_smith</motion.div>
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 right-4 glass-pill px-3 py-1.5 rounded-full text-[10px] font-bold text-black/40 blur-[1px]">"See you at 8"</motion.div>
            <motion.div animate={{ y: [-5, 15, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-1/3 left-1/4 glass-pill px-3 py-1.5 rounded-full text-[10px] font-bold text-black/40 blur-[1px]">Location shared</motion.div>
          </motion.div>

          {/* Protective halos */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute w-[500px] h-[500px] rounded-full border border-black/5" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute w-[650px] h-[650px] rounded-full border border-[#6e2fff]/10" />
        </div>
      </section>

      {/* --- 4. CTA SECTION: "Send Freely" --- */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-6 overflow-hidden bg-sunset-gradient">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <div className="grain-overlay opacity-10" />

        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black text-white mb-12 drop-shadow-2xl"
          >
            Send Freely.
          </motion.h2>

          {/* Surreal jelly button */}
          <div className="relative">
            {isSent && (
              <motion.div 
                initial={{ opacity: 1 }} animate={{ opacity: 0, scale: 2 }} transition={{ duration: 1 }}
                className="absolute inset-0 rounded-full border-4 border-white/50"
              />
            )}
            
            <button
              onClick={() => setIsSent(true)}
              onMouseLeave={() => setIsSent(false)}
              className="relative w-40 h-40 rounded-[2rem] bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_2px_10px_rgba(255,255,255,0.5)] flex items-center justify-center text-white jelly-btn overflow-hidden group hover:bg-white/30"
            >
              <Send size={48} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              
              {/* Expanding bubbles on click */}
              {isSent && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{ 
                        scale: Math.random() * 2 + 0.5,
                        x: (Math.random() - 0.5) * 400, 
                        y: (Math.random() - 0.5) * 400,
                        opacity: 0
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute w-8 h-8 rounded-full bg-white/60 blur-[2px]"
                    />
                  ))}
                </>
              )}
            </button>
          </div>
          
          <p className="mt-8 text-white/80 font-medium text-lg tracking-wide">
            Tap to experience. Then <Link to="/register" className="text-white font-bold underline decoration-2 underline-offset-4 hover:text-[#ff2d55] transition-colors">join Flux</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
