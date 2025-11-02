import React, { useState, useEffect, useMemo } from 'react';
import { MessageCircle, Share2, Users, ShoppingCart, DollarSign, Briefcase, PenTool, Star, Zap } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import TriggerWorkflowModal from '../components/TriggerWorkflowModal';
import { Service } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

const generateWebhookId = () => `whk_${[...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

const services: Service[] = [
  { icon: MessageCircle, title: 'Customer Communication', description: 'Automate emails, SMS, and support ticket responses.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'email', label: 'Recipient Email', type: 'email', placeholder: 'customer@example.com', defaultValue: 'lead@example.com' }, { name: 'subject', label: 'Email Subject', type: 'text', placeholder: 'Following up on your inquiry', defaultValue: 'Quick Question' }, { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your personalized message here...', defaultValue: 'Hi there, just wanted to follow up on our recent conversation.' }] },
  { icon: Share2, title: 'Social Media Management', description: 'Schedule posts, monitor mentions, and analyze engagement.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'platform', label: 'Platform', type: 'select', options: ['X', 'LinkedIn', 'Instagram'], defaultValue: 'LinkedIn' }, { name: 'content', label: 'Post Content', type: 'textarea', placeholder: 'What\'s on your mind?', defaultValue: 'Excited to share our latest blog post on automation trends!' }] },
  { icon: Users, title: 'Lead Generation & CRM Sync', description: 'Capture leads from forms and sync with your CRM.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' }, { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane.doe@company.com' }, { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Innovate Inc.' }] },
  { icon: ShoppingCart, title: 'E-Commerce Automation', description: 'Manage abandoned carts, orders, and inventory.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'action', label: 'Automation Type', type: 'select', options: ['Abandoned Cart Recovery', 'Order Confirmation'], defaultValue: 'Abandoned Cart Recovery' }, { name: 'customerEmail', label: 'Customer Email', type: 'email', placeholder: 'shopper@example.com' }, { name: 'orderId', label: 'Order ID', type: 'text', placeholder: 'ORD-12345' }] },
  { icon: DollarSign, title: 'Financial Automation', description: 'Generate invoices, track payments, and manage expenses.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'clientEmail', label: 'Client Email', type: 'email', placeholder: 'client@business.com' }, { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-2025-001' }, { name: 'amount', label: 'Amount (USD)', type: 'number', placeholder: '1500.00' }] },
  { icon: Briefcase, title: 'Team Coordination', description: 'Assign tasks, send project updates, and streamline comms.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'projectName', label: 'Project Name', type: 'text', placeholder: 'Q3 Marketing Campaign' }, { name: 'taskName', label: 'Task Description', type: 'text', placeholder: 'Draft initial ad copy' }, { name: 'assigneeEmail', label: 'Assignee Email', type: 'email', placeholder: 'team-member@workflowhub.com' }] },
  { icon: PenTool, title: 'Content Creation', description: 'Automate content drafting, formatting, and distribution.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'topic', label: 'Blog Post Topic', type: 'text', placeholder: 'The Future of AI in Business' }, { name: 'keywords', label: 'SEO Keywords', type: 'text', placeholder: 'AI, business, automation, future' }] },
  { icon: Star, title: 'Feedback Analysis', description: 'Collect and analyze customer feedback automatically.', webhookUrl: `https://api.workflowhub.com/hooks/v1/${generateWebhookId()}`, inputFields: [{ name: 'feedbackText', label: 'Customer Feedback', type: 'textarea', placeholder: 'Enter customer review or survey response here...' }] },
];

interface WorkflowListItemProps {
  service: Service;
  onClick: () => void;
}

const WorkflowListItem: React.FC<WorkflowListItemProps> = ({ service, onClick }) => {
  const { icon: Icon, title, description } = service;
  return (
    <button onClick={onClick} className="w-full text-left p-4 rounded-xl flex items-center gap-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200">
      <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
        <Icon className="h-6 w-6 text-gray-800 dark:text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </button>
  );
};

const DashboardPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { theme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('workflow_runs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent activity:', error);
      } else {
        setRecentActivity(data);
      }
    };

    fetchRecentActivity();
    
    // Set up a subscription to listen for new workflow runs
    const channel = supabase.channel('workflow_runs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'workflow_runs' }, (payload) => {
        setRecentActivity(currentActivity => [payload.new, ...currentActivity].slice(0, 5));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const chartOptions = useMemo(() => {
    const isDark = theme === 'dark';
    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const tooltipBg = isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const tooltipColor = isDark ? '#E5E7EB' : '#1F2937';
    const axisLineColor = isDark ? '#4B5563' : '#D1D5DB';
    const splitLineColor = 'transparent';

    return {
      grid: { left: 0, right: 0, top: '5%', bottom: 0, containLabel: true },
      tooltip: { trigger: 'axis', backgroundColor: tooltipBg, borderColor: tooltipBorder, textStyle: { color: tooltipColor }, confine: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLine: { show: false }, axisLabel: { color: textColor }, axisTick: { show: false } },
      yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { show: false }, splitLine: { lineStyle: { color: splitLineColor } } },
      series: [{ name: 'Runs', type: 'line', smooth: true, data: [12, 21, 8, 15, 13, 33, 22], showSymbol: false, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(139, 92, 246, 0.4)' }, { offset: 1, color: 'rgba(139, 92, 246, 0)' }] } }, lineStyle: { width: 2, color: '#8B5CF6' }, itemStyle: { color: '#8B5CF6' } }]
    };
  }, [theme]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-4">
        <div className="p-6 rounded-2xl glassmorphism">
          <h2 className="text-lg font-bold mb-4">Workflows</h2>
          <div className="space-y-2">
            {services.map((service) => (
              <WorkflowListItem key={service.title} service={service} onClick={() => setSelectedService(service)} />
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="p-6 rounded-2xl glassmorphism">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Runs (Last 7 Days)</h3>
          <div style={{ height: '250px' }}>
            <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} notMerge={true} lazyUpdate={true} />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl glassmorphism">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center gap-4 text-sm">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Zap className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-gray-800 dark:text-gray-200 flex-grow">
                  <span className="font-semibold">{activity.workflow_title}</span> workflow triggered.
                </p>
                <p className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </li>
            )) : (
              <p className="text-sm text-center py-8 text-gray-500 dark:text-gray-400">No recent activity. Trigger a workflow to get started!</p>
            )}
          </ul>
        </div>
      </div>

      {selectedService && (
        <TriggerWorkflowModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
