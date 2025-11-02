import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Logo from '../../components/Logo';

const AuthPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) throw response.error;

      if (isSignUp && response.data.user) {
        setMessage({ type: 'success', text: 'Success! Please check your email to confirm your account.' });
      }
      // On successful sign-in, the onAuthStateChange listener will trigger the redirect.
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">WorkflowHub</h1>
          </div>
        </div>

        <div className="w-full p-8 rounded-2xl glassmorphism">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            {isSignUp ? 'Start your automation journey today.' : 'Sign in to manage your workflows.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-200/50 dark:bg-gray-900/80 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-200/50 dark:bg-gray-900/80 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 disabled:opacity-60"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {message && (
            <div className={cn("mt-4 text-center text-sm p-3 rounded-lg", {
              'bg-green-500/20 text-green-400 dark:text-green-300': message.type === 'success',
              'bg-red-500/20 text-red-400 dark:text-red-300': message.type === 'error',
            })}>
              {message.text}
            </div>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }} className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
