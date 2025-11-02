import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Profile } from '../types';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as Omit<typeof context, 'profile'> & { profile: Profile | null };
};
