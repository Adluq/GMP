import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Tournament } from '../types';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

const TournamentCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cyber-card group overflow-hidden relative"
    >
      <div className="absolute top-4 right-4 z-10">
        <span className={cn(
          "px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest",
          tournament.type === 'online' ? "bg-brand-cyan text-black" : "bg-brand-purple text-white"
        )}>
          {tournament.type}
        </span>
      </div>

      <div className="h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-gray-900 border-b border-white/10 group-hover:border-brand-cyan/30 transition-colors">
        <img 
          src={tournament.image || `https://picsum.photos/seed/${tournament.id}/800/600`} 
          alt={tournament.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-mono font-bold text-lg uppercase group-hover:text-brand-cyan transition-colors truncate">
            {tournament.title}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest">{tournament.gameName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Trophy className="w-4 h-4 text-brand-cyan" />
            <div>
              <p className="text-[10px] uppercase text-gray-600">Prize Pool</p>
              <p className="text-sm font-mono">{formatCurrency(tournament.prizePool)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4 text-brand-purple" />
            <div>
              <p className="text-[10px] uppercase text-gray-600">Slots</p>
              <p className="text-sm font-mono">{tournament.currentPlayers}/{tournament.maxPlayers}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[10px] uppercase text-gray-600">Entry Fee</p>
            <p className="text-sm font-bold text-brand-cyan">{formatCurrency(tournament.entryFee)}</p>
          </div>
          <Link 
            to={`/tournaments/${tournament.id}`}
            className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest hover:text-white text-gray-400 transition-colors"
          >
            View Specs
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default TournamentCard;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
