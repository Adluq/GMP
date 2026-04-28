import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Trophy, Wallet, User as UserIcon, LogIn, LogOut, Gamepad2, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      
      // Ensure profile exists
      const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          balance: 100, // Starting balance for new users
          rank: "Bronze",
          tier: 1,
          wins: 0,
          losses: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Sign in failed", error);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-6 justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-cyan rotate-45 flex items-center justify-center">
          <Gamepad2 className="-rotate-45 text-black w-5 h-5" />
        </div>
        <span className="font-mono font-bold text-xl tracking-tighter uppercase">
          GMP<span className="text-brand-cyan">.</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
        <Link to="/tournaments" className="hover:text-brand-cyan transition-colors">Marketplace</Link>
        <Link to="/tournaments?type=online" className="hover:text-brand-cyan transition-colors">Online</Link>
        <Link to="/tournaments?type=offline" className="hover:text-brand-cyan transition-colors">Events</Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 bg-white/5 px-4 py-1.5 border border-white/10 rounded-full"
            >
              <Link to="/wallet" className="flex items-center gap-2 hover:text-brand-cyan">
                <Wallet className="w-4 h-4" />
                <span className="font-mono text-xs">$1,250.00</span>
              </Link>
              <div className="w-px h-4 bg-white/20" />
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-brand-cyan">
                <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                <span className="text-xs hidden sm:block">{user.displayName?.split(' ')[0]}</span>
              </Link>
            </motion.div>
            <button 
              onClick={handleSignOut}
              className="p-2 hover:text-brand-cyan transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button 
            onClick={handleSignIn}
            className="cyber-button text-xs py-1.5 h-auto flex items-center gap-2 outline-none"
          >
            <LogIn className="w-4 h-4 text-black" />
            Enter Arena
          </button>
        )}
      </div>
    </nav>
  );
}
