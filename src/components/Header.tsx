import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, LogOut, Sun, Moon, Bell, PlusCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/workflows')) return 'Workflows';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/settings')) return 'Settings';
    return 'WorkflowHub';
  };
  
  const displayName = profile?.full_name || user?.email;

  return (
    <header className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10 sticky top-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-xl z-20 h-16">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden md:block">{getPageTitle()}</h1>
      <div className="md:hidden">
        <Logo className="h-8 w-8" />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200">
          <PlusCircle size={16} />
          Create Workflow
        </button>

        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <Search size={18} />
        </button>
        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <Bell size={18} />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
            <img
              src={`https://i.pravatar.cc/40?u=${user?.id || 'default'}`}
              alt="User Avatar"
              className="h-9 w-9 rounded-full border-2 border-gray-300 dark:border-white/20 hover:border-indigo-500 transition-colors"
            />
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-full right-0 mt-2 w-64 rounded-xl glassmorphism shadow-soft-dark overflow-hidden"
              >
                <div className="p-4 border-b border-black/10 dark:border-white/10">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your Plan: <span className="font-semibold text-indigo-600 dark:text-indigo-400">Pro</span></p>
                </div>
                <div className="p-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={theme}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                        </motion.div>
                      </AnimatePresence>
                      <span>Theme</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{theme === 'light' ? 'Dark' : 'Light'}</span>
                  </button>
                   <button
                    onClick={signOut}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
