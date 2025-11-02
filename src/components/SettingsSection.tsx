import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  icon: Icon,
  title,
  description,
  isOpen,
  onClick,
  children,
}) => {
  return (
    <div className="rounded-2xl glassmorphism overflow-hidden">
      <button
        onClick={onClick}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-black/10 dark:border-white/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsSection;
