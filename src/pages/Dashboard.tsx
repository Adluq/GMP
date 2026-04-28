import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile, Tournament } from '../types';
import { Trophy, Award, Zap, Target, Star, ChevronRight, Activity, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import TournamentCard from '../components/TournamentCard';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    if (user) {
      // Profile listener
      const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) setProfile(doc.data() as UserProfile);
      });

      // Simple mock for active tournaments since we need registrations
      // For now, just show upcoming tournaments as "Recommended"
      const q = query(collection(db, 'tournaments'), where('status', '==', 'upcoming'));
      getDocs(q).then(snap => {
        setActiveTournaments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tournament)));
      });

      return () => unsubProfile();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-24">
      {/* Top Banner / Identity */}
      <div className="relative p-12 mb-12 overflow-hidden bg-white/5 border border-white/5">
        <div className="absolute top-0 right-0 p-4 font-mono text-[80px] font-black italic text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
          COMMANDER
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 p-1 bg-linear-to-tr from-brand-cyan to-brand-purple rounded-full">
              <img 
                src={user.photoURL || ''} 
                alt="" 
                className="w-full h-full rounded-full object-cover bg-dark-bg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-brand-cyan text-black px-3 py-1 text-[10px] font-black uppercase rounded-full border-2 border-dark-bg">
              {profile?.rank || 'Bronze'}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="font-mono text-4xl font-black uppercase tracking-tight">{user.displayName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                <Target className="w-3 h-3" />
                Tier {profile?.tier || 1} Elite
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                <Activity className="w-3 h-3 text-green-500" />
                Active Session
              </div>
            </div>
          </div>

          <div className="md:ml-auto grid grid-cols-2 gap-4">
             <div className="cyber-card p-4 bg-white/5 border-white/10 text-center min-w-[120px]">
                <p className="text-[8px] uppercase text-gray-500 tracking-[0.2em] mb-1">Combat Wins</p>
                <p className="font-mono text-2xl font-bold text-brand-cyan">{profile?.wins || 0}</p>
             </div>
             <div className="cyber-card p-4 bg-white/5 border-white/10 text-center min-w-[120px]">
                <p className="text-[8px] uppercase text-gray-500 tracking-[0.2em] mb-1">Loss Rate</p>
                <p className="font-mono text-2xl font-bold text-brand-purple">{profile?.losses || 0}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Active Campaigns */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
              <h2 className="font-mono text-xs uppercase font-bold tracking-[0.3em] text-brand-cyan flex items-center gap-2">
                <Zap className="w-3 h-3 fill-brand-cyan" />
                Live Campaigns
              </h2>
              <button className="text-[8px] uppercase text-gray-600 hover:text-white flex items-center gap-1 transition-colors">
                View History <ChevronRight className="w-2 h-2" />
              </button>
            </div>

            {activeTournaments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {activeTournaments.slice(0, 2).map(t => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            ) : (
                <div className="p-12 border border-dashed border-white/10 text-center bg-white/[0.02]">
                  <LayoutGrid className="w-8 h-8 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-600 uppercase text-[10px] font-bold tracking-widest">No Active Engagements</p>
                </div>
            )}
          </section>

          {/* Rank Progression */}
          <section className="cyber-card relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-purple/20 transition-all duration-700" />
             
             <div className="relative z-10">
                <h3 className="font-mono text-sm uppercase font-bold mb-8 flex items-center gap-2 text-gray-300">
                  <Star className="w-4 h-4 text-brand-purple" />
                  Rank Progression
                </h3>

                <div className="space-y-8">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-400">Current Rank: {profile?.rank || 'Bronze'}</p>
                      <p className="text-[10px] text-gray-600 uppercase">1,240 XP to Silver</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase font-bold text-brand-cyan">Silver III</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1 bg-white/5 w-full relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "45%" }}
                      className="absolute top-0 left-0 h-full bg-linear-to-r from-brand-cyan to-brand-purple shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {['Bronze', 'Silver', 'Gold', 'Master'].map((r, i) => (
                      <div key={r} className="text-center">
                        <div className={cn(
                          "h-1 mb-2",
                          i === 0 ? "bg-brand-cyan" : "bg-white/5"
                        )} />
                        <p className={cn(
                          "text-[8px] uppercase tracking-tighter",
                          i === 0 ? "text-brand-cyan font-bold" : "text-gray-700"
                        )}>{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </section>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="cyber-card border-brand-cyan/20">
            <h4 className="font-mono text-xs uppercase font-bold text-brand-cyan mb-6 tracking-[0.2em]">Social Intelligence</h4>
            <div className="space-y-4">
              {[
                { name: 'X-Ray_01', status: 'In Game', game: 'Valorant' },
                { name: 'Ghost_Protocol', status: 'Online', game: 'Idle' },
                { name: 'Ace_Blade', status: 'In Tournament', game: 'Apex' },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300 group-hover:text-brand-cyan transition-colors">{f.name}</p>
                      <p className="text-[8px] text-gray-600 uppercase tracking-widest">{f.status} • {f.game}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    f.status === 'In Game' ? "bg-red-500" : "bg-green-500"
                  )} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center">
             <Trophy className="w-8 h-8 text-brand-purple opacity-20 mb-4" />
             <p className="text-[10px] uppercase text-gray-600 tracking-widest leading-relaxed">
               Next Championship Drop in<br />
               <span className="text-white font-mono text-xl">14:22:04</span>
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

function User({ className }: { className?: string }) {
  return <Award className={className} />
}
