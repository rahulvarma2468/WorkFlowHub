import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { User, Shield, LogOut, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import SettingsSection from '../../components/SettingsSection';

const SettingsPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>('profile');

  const [fullName, setFullName] = useState('');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [password, setPassword] = useState({ new: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileLoading(true);
    setProfileMessage(null);
    
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      setProfileMessage({ type: 'error', text: error.message });
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (!password.new) {
      setPasswordMessage({ type: 'error', text: 'Password cannot be empty.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage(null);
    const { error } = await supabase.auth.updateUser({ password: password.new });
    if (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } else {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPassword({ new: '', confirm: '' });
    }
    setPasswordLoading(false);
  };

  const commonInputClasses = "w-full px-3 py-2 rounded-lg bg-gray-200/50 dark:bg-gray-900/80 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
  const commonButtonClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Settings</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your account, preferences, and privacy.</p>

      <div className="max-w-3xl mx-auto space-y-4">
        <SettingsSection
          icon={User}
          title="Edit Profile"
          description="Update your personal information."
          isOpen={openSection === 'profile'}
          onClick={() => setOpenSection(openSection === 'profile' ? null : 'profile')}
        >
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={commonInputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Email Address</label>
              <input type="email" value={user?.email} disabled className={cn(commonInputClasses, "opacity-60 cursor-not-allowed")} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <button type="submit" disabled={profileLoading} className={commonButtonClasses}>
                {profileLoading && <Loader2 size={16} className="animate-spin" />} Save Changes
              </button>
              {profileMessage && <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{profileMessage.text}</p>}
            </div>
          </form>
        </SettingsSection>

        <SettingsSection
          icon={Shield}
          title="Privacy"
          description="Change your password."
          isOpen={openSection === 'privacy'}
          onClick={() => setOpenSection(openSection === 'privacy' ? null : 'privacy')}
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">New Password</label>
              <input type="password" value={password.new} onChange={(e) => setPassword(p => ({ ...p, new: e.target.value }))} className={commonInputClasses} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Confirm New Password</label>
              <input type="password" value={password.confirm} onChange={(e) => setPassword(p => ({ ...p, confirm: e.target.value }))} className={commonInputClasses} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <button type="submit" disabled={passwordLoading} className={commonButtonClasses}>
                {passwordLoading && <Loader2 size={16} className="animate-spin" />} Change Password
              </button>
              {passwordMessage && <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{passwordMessage.text}</p>}
            </div>
          </form>
        </SettingsSection>
        
        <div className="p-6 rounded-2xl glassmorphism mt-8">
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sign Out</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">End your current session on this device.</p>
           <button onClick={signOut} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200">
              <LogOut size={16} /> Sign Out
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
