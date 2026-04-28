import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile, Transaction } from '../types';
import { Shield, ArrowUpRight, ArrowDownLeft, Plus, History, Banknote, CreditCard, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';

export default function Wallet() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) setProfile(doc.data() as UserProfile);
      });
    }
  }, [user]);

  const handleDeposit = async (amount: number) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId: user.uid }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Deposit failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    alert("Withdrawal system is currently in read-only demo mode. Please contact support for large payouts.");
  };

  if (!user) {
    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center h-[70vh]">
        <Shield className="w-16 h-16 text-gray-700 mb-6" />
        <h1 className="text-2xl font-mono uppercase mb-4">Secure Area</h1>
        <p className="text-gray-500 mb-8">You must be authenticated to access your wallet.</p>
        <button onClick={() => navigate('/')} className="cyber-button">Return to Lobby</button>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-24">
      <div className="mb-12">
        <h1 className="font-mono text-4xl font-black uppercase mb-2">Command Central Wallet</h1>
        <p className="text-gray-500 uppercase tracking-widest text-[10px]">Secure Financial Interface v2.4.0</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-brand-cyan text-black relative overflow-hidden group border-4 border-black"
          >
            {/* Decal background */}
            <DollarSign className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
            
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] mb-8">Available Liquid Credit</p>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-5xl font-black font-mono">
                  {formatCurrency(profile?.balance || 0)}
                </span>
                <span className="text-sm font-bold opacity-60 uppercase tracking-widest">USD</span>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleDeposit(50)}
                  disabled={isLoading}
                  className="flex-1 bg-black text-brand-cyan py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 border-2 border-black hover:bg-transparent hover:text-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Quick Load $50
                </button>
                <button 
                  onClick={handleWithdrawal}
                  className="flex-1 border-2 border-black py-3 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-brand-cyan transition-colors"
                >
                  Request Payout
                </button>
              </div>
            </div>
            
            {/* Animated bar at bottom */}
            <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full overflow-hidden">
               <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-full w-24 bg-black"
               />
            </div>
          </motion.div>

          <div className="cyber-card">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-brand-cyan" />
                <h3 className="font-mono text-lg uppercase font-bold text-gray-300">Transmission Log</h3>
              </div>
              <button className="text-[10px] uppercase text-gray-500 hover:text-white transition-colors">Export .CSV</button>
            </div>

            <div className="space-y-2">
              {[
                { type: 'deposit', amount: 50, method: 'Stripe', date: '2024-03-27' },
                { type: 'entry_fee', amount: -10, method: 'Shadow Strike Pro', date: '2024-03-25' },
                { type: 'prize_win', amount: 80, method: 'Valor Cup #4', date: '2024-03-20' },
                { type: 'withdrawal', amount: -100, method: 'Bank Transfer', date: '2024-03-15' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      tx.amount > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight text-gray-300">{tx.method}</p>
                      <p className="text-[10px] text-gray-600 uppercase font-mono tracking-widest">{tx.date}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "font-mono font-bold",
                    tx.amount > 0 ? "text-green-500" : "text-white"
                  )}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Options */}
        <div className="space-y-8">
          <div className="cyber-card">
            <h4 className="font-mono text-xs uppercase font-bold text-brand-purple mb-6 tracking-[0.2em]">Payment Methods</h4>
            <div className="space-y-4">
              <div className="p-4 border border-brand-cyan/20 bg-brand-cyan/5 flex items-center justify-between group cursor-pointer hover:bg-brand-cyan/10 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-brand-cyan" />
                  <div>
                    <p className="text-xs font-bold text-gray-300">VISA Card **** 4242</p>
                    <p className="text-[8px] text-brand-cyan uppercase tracking-widest">Primary Logic</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              </div>
              
              <div className="p-4 border border-white/10 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <Banknote className="w-5 h-5 text-gray-500" />
                <p className="text-xs font-bold text-gray-500">PayPal Connection (Link)</p>
              </div>
              
              <div className="pt-2">
                <button className="w-full py-2 border-2 border-white/10 text-[10px] uppercase font-bold tracking-widest hover:border-white/30 transition-colors">
                  Add New Interface
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 border border-brand-purple/20 bg-brand-purple/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-brand-purple/20">
               <Shield className="w-12 h-12" />
            </div>
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-purple mb-2">Zero-Sum Security</h4>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "Your stakes are escrowed instantly upon registration. We guarantee 0% slippage on winning payouts."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
