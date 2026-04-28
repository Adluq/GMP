import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { auth, signInWithGoogle } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Play, Shield, Globe, Award, Zap, ArrowRight, UserPlus } from 'lucide-react';

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/20 via-dark-bg/60 to-dark-bg z-10" />
          <img 
            src="https://picsum.photos/id/180/1920/1080?grayscale" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 scale-105 animate-pulse"
            style={{ animationDuration: '8s' }}
            referrerPolicy="no-referrer"
          />
          {/* Animated Scanline */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,242,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
        </div>

        <div className="relative z-20 max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] uppercase font-bold tracking-[0.2em] mb-8">
              <Zap className="w-3 h-3 fill-brand-cyan" />
              The Arena is Live
            </div>
            
            <h1 className="font-mono text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Risk Everything<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-cyan to-brand-purple">Win Anything.</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              The world's first decentralized gaming marketplace where skill is the only currency. Compete, bet, and claim your glory.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/tournaments" className="cyber-button group flex items-center gap-3">
                <Play className="w-5 h-5 fill-current" />
                Browse Marketplace
              </Link>
              {!user && (
                <button 
                  onClick={signInWithGoogle}
                  className="px-8 py-3 border border-white/20 hover:border-white/50 transition-all uppercase tracking-widest font-bold text-xs flex items-center gap-2 hover:bg-white/5"
                >
                  <UserPlus className="w-4 h-4" />
                  Join the Ranks
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24 px-6 md:px-12 border-x border-white/10 py-4 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-brand-cyan font-mono text-2xl font-bold">12,402</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Gamers Online</p>
            </div>
            <div className="text-center">
              <p className="text-brand-purple font-mono text-2xl font-bold">$1.2M</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Total Payouts</p>
            </div>
            <div className="hidden md:block text-center">
              <p className="text-white font-mono text-2xl font-bold">48</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Live Tournaments</p>
            </div>
            <div className="hidden md:block text-center">
              <p className="text-white font-mono text-2xl font-bold">99.9%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Security Index</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="py-24 px-6 bg-dark-bg/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Shield className="w-10 h-10 text-brand-cyan mb-6" />
            <h3 className="font-mono text-xl uppercase font-bold">Encrypted Stakes</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              All transactions are secured with military-grade encryption. Your funds are only released when victory is confirmed.
            </p>
          </div>
          <div className="space-y-4">
            <Globe className="w-10 h-10 text-brand-cyan mb-6" />
            <h3 className="font-mono text-xl uppercase font-bold">Global Arena</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Host or join tournaments anywhere in the world. From grassroots local events to global championship series.
            </p>
          </div>
          <div className="space-y-4">
            <Award className="w-10 h-10 text-brand-cyan mb-6" />
            <h3 className="font-mono text-xl uppercase font-bold">Anti-Cheat System</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Our advanced telemetry and fair-play algorithms ensure that victory is earned through merit, not exploit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
