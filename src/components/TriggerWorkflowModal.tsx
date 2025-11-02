import React, { useState, useEffect } from 'react';
import { Service, InputField } from '../types';
import { X, Zap, Loader2, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface TriggerWorkflowModalProps {
  service: Service;
  onClose: () => void;
}

const TriggerWorkflowModal: React.FC<TriggerWorkflowModalProps> = ({ service, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { icon: Icon, title, inputFields } = service;

  useEffect(() => {
    const initialData = inputFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>);
    setFormData(initialData);
  }, [service, inputFields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const finalValue = isCheckbox ? e.target.checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      // Simulate API call to n8n webhook
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (Math.random() > 0.2) { // Simulate success
        setResponse({ type: 'success', message: 'Workflow triggered successfully! Check your n8n instance for results.' });
        
        // On success, log the run to Supabase
        if (user) {
          const { error: insertError } = await supabase
            .from('workflow_runs')
            .insert({
              user_id: user.id,
              workflow_title: service.title,
            });

          if (insertError) {
            console.error('Error logging workflow run:', insertError.message);
            // Don't show this error to the user, as the primary action was successful
          }
        }
      } else { // Simulate failure
        throw new Error('Failed to trigger workflow. The webhook endpoint returned an error.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setResponse({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const renderField = (field: InputField) => {
    const commonClasses = "w-full px-3 py-2 rounded-lg bg-gray-200/50 dark:bg-gray-900/80 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
    
    switch (field.type) {
      case 'textarea':
        return <textarea id={field.name} name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} placeholder={field.placeholder} rows={4} className={commonClasses} disabled={isLoading} />;
      case 'select':
        return (
          <div className="relative">
            <select id={field.name} name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} className={cn(commonClasses, "appearance-none pr-8")} disabled={isLoading}>
              {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        );
      default:
        return <input type={field.type} id={field.name} name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} placeholder={field.placeholder} className={commonClasses} disabled={isLoading} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fadeIn" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative w-full max-w-lg m-4 p-8 rounded-2xl glassmorphism animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Close modal"><X size={20} /></button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 flex-shrink-0"><Icon className="h-8 w-8 text-gray-800 dark:text-white" /></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{field.label}</label>
              {renderField(field)}
            </div>
          ))}
          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={16} />}
              <span>{isLoading ? 'Triggering...' : 'Trigger Workflow'}</span>
            </button>
          </div>
        </form>
        {response && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 text-sm ${response.type === 'success' ? 'bg-green-500/20 text-green-400 dark:text-green-300' : 'bg-red-500/20 text-red-400 dark:text-red-300'}`}>
            <div className="flex-shrink-0">{response.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}</div>
            <p className="flex-grow">{response.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriggerWorkflowModal;
