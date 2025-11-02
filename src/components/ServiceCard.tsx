import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const { icon: Icon, title, description } = service;

  return (
    <button
      onClick={onClick}
      className="group relative text-left w-full rounded-2xl p-6 glassmorphism transition-all duration-300 ease-in-out hover:scale-[1.03] hover:border-black/20 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
    >
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="mb-4 inline-block p-3 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
          <Icon className="h-6 w-6 text-gray-800 dark:text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </button>
  );
};

export default ServiceCard;
