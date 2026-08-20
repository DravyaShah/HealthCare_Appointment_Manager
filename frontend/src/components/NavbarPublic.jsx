import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NavbarPublic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <Activity className="h-5 w-5" />
                <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-sm -z-10 group-hover:blur-md transition-all" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                  Health<span className="text-cyan-400">AI</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    v2.5
                  </span>
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1 relative">
            {[
              { path: '/about', label: 'About Us' },
              { path: '/#services', label: 'Services' },
              { path: '/team', label: 'Our Doctors' },
              { path: '/blog', label: 'Research' },
              { path: '/contact', label: 'Contact' }
            ].map((link) => {
              const isActive = location.pathname === link.path || (link.path.includes('#') && location.hash === link.path.substring(1));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-slate-800/80 border border-slate-700/80 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 border-l border-slate-800/80 pl-6 ml-3">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Book Consultation
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl">About Us</Link>
          <Link to="/team" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl">Our Doctors</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl">Research</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl">Contact</Link>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center px-4 py-2.5 text-base font-medium text-slate-200 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700">Sign In</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center px-4 py-2.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20">Book Consultation</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarPublic;
