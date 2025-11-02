import React from 'react';
import { MessageCircle, Share2, Users, ShoppingCart, DollarSign, Briefcase, PenTool, Star, Zap } from 'lucide-react';
import { Service } from '../../types';

const servicesWithUsage: (Omit<Service, 'webhookUrl' | 'inputFields'> & { usageCount: number })[] = [
  { icon: MessageCircle, title: 'Customer Communication', description: 'Automate email follow-ups, SMS notifications, and support ticket responses.', usageCount: 1245 },
  { icon: Share2, title: 'Social Media Management', description: 'Schedule posts, monitor mentions, and analyze engagement across platforms.', usageCount: 832 },
  { icon: Users, title: 'Lead Generation & CRM Sync', description: 'Capture leads from forms and automatically sync data with your CRM.', usageCount: 2109 },
  { icon: ShoppingCart, title: 'E-Commerce Automation', description: 'Manage abandoned carts, process orders, and handle inventory updates.', usageCount: 654 },
  { icon: DollarSign, title: 'Financial Automation', description: 'Generate invoices, track payments, and manage expense reports seamlessly.', usageCount: 431 },
  { icon: Briefcase, title: 'Team Coordination', description: 'Assign tasks, send project updates, and streamline internal communication.', usageCount: 1588 },
  { icon: PenTool, title: 'Content Creation', description: 'Automate content drafting, formatting, and distribution to various channels.', usageCount: 321 },
  { icon: Star, title: 'Feedback Analysis', description: 'Collect and analyze customer feedback from surveys and reviews automatically.', usageCount: 976 },
];

const WorkflowsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Workflows</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">An overview of all available automations and their usage.</p>
      
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-soft dark:shadow-soft-dark">
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {servicesWithUsage.map((service) => (
            <li key={service.title} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
                  <service.icon className="h-6 w-6 text-gray-800 dark:text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg flex-shrink-0 ml-auto sm:ml-0">
                <Zap size={18} />
                <span>{service.usageCount.toLocaleString()} runs</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkflowsPage;
