import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Settings, BarChart2, Zap } from 'lucide-react';
import { NavItem } from '../types';
import { cn } from '../lib/utils';
import Logo from './Logo';

const navItems: NavItem[] = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/' },
  { icon: Zap, label: 'Workflows', href: '/workflows' },
  { icon: BarChart2, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 p-4 bg-gray-100/70 dark:bg-gray-950/70 backdrop-blur-xl border-r border-black/10 dark:border-white/10">
      <div className="flex items-center gap-3 mb-10 p-2">
        <Logo className="h-8 w-8" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">WorkflowHub</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg transition-colors',
              location.pathname === item.href
                ? 'bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
