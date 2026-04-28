import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tournament } from '../types';
import TournamentCard from '../components/TournamentCard';
import { Search, Filter, Gamepad2, Trophy, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tournaments'),
      orderBy('startDate', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
      setTournaments(data);
      setLoading(false);
    });
  }, []);

  const filteredTournaments = tournaments.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.gameName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-24">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="font-mono text-5xl font-black uppercase mb-4">The Marketplace</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                {tournaments.length} Modules Active
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-brand-purple" />
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                $4.2K Prize Pool
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-cyan transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by Game or Intel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-white/5 border border-white/10 px-12 py-3 text-sm font-mono focus:outline-none focus:border-brand-cyan transition-all"
            />
          </div>
          
          <div className="flex bg-white/5 p-1 border border-white/10">
            {(['all', 'online', 'offline'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all",
                  filter === t ? "bg-brand-cyan text-black" : "text-gray-500 hover:text-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="cyber-card h-80 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredTournaments.length > 0 ? (
            <motion.div 
               layout
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTournaments.map(t => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center border border-dashed border-white/10"
            >
              <Gamepad2 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="font-mono text-xl uppercase font-bold text-gray-500">No Active Transmissions</h3>
              <p className="text-gray-600 text-sm mt-2">Adjust your filters or standby for new drops.</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
