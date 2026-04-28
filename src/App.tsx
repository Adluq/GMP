import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Tournaments from './pages/Tournaments';
import Dashboard from './pages/Dashboard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

// Shell components for other paths
const Placeholder = ({ title }: { title: string }) => (
  <div className="pt-24 px-6 max-w-7xl mx-auto h-[60vh] flex flex-col items-center justify-center">
    <h1 className="font-mono text-4xl font-black uppercase text-brand-cyan mb-4 animate-pulse">{title}</h1>
    <p className="text-gray-500 uppercase tracking-widest text-xs">Section Under Construction / Deployment in Progress</p>
  </div>
);

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-gray-100 selection:bg-brand-cyan selection:text-black">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<Placeholder title="Tournament Spec" />} />
          <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/payment-success" element={<Placeholder title="Transmission Success" />} />
        </Routes>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="w-6 h-6 bg-brand-cyan rotate-45" />
              <span className="font-mono font-bold tracking-tighter uppercase">GMP.</span>
            </div>
            <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-600">
               <a href="#" className="hover:text-brand-cyan transition-colors">Privacy Logic</a>
               <a href="#" className="hover:text-brand-cyan transition-colors">Service Manual</a>
               <a href="#" className="hover:text-brand-cyan transition-colors">Contact Node</a>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-700 italic">
              © 2026 Gaming Marketplace Protocol. Built for the Arena.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
