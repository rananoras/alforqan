import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { UserProfile, UserRole } from '../types';
import { seedInitialDataIfEmpty } from '../services/dbService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
  isTeacher: boolean;
  isAccountant: boolean;
  isParent: boolean;
  isStudent: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = 'rananoras@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrCreateProfile = async (user: User): Promise<UserProfile> => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const isSuperAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfile;
      // If super admin email, guarantee admin role
      if (isSuperAdmin && data.role !== 'admin') {
        const updated: UserProfile = { ...data, role: 'admin' };
        await setDoc(userRef, updated, { merge: true });
        // Also ensure admin marker doc
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: user.email,
          addedAt: new Date().toISOString(),
        });
        return updated;
      }
      return data;
    } else {
      // First time user registration
      const role: UserRole = isSuperAdmin ? 'admin' : 'staff';
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'مستخدم جديد',
        role,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);

      if (isSuperAdmin) {
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: user.email,
          addedAt: new Date().toISOString(),
        });
      }
      return newProfile;
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const profile = await fetchOrCreateProfile(currentUser);
      setUserProfile(profile);
      setActiveRole(profile.role);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await fetchOrCreateProfile(user);
          setUserProfile(profile);
          setActiveRole(profile.role);
          // Seed sample data if system is empty
          await seedInitialDataIfEmpty();
        } catch (err) {
          console.error('Error loading profile:', err);
          // Fallback profile if offline or error
          const fallback: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'مدير النظام',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          setUserProfile(fallback);
          setActiveRole('admin');
        }
      } else {
        setUserProfile(null);
        setActiveRole('admin');
        // Still seed initial data so guest or local reviewer can explore immediately
        seedInitialDataIfEmpty().catch(console.error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = activeRole === 'admin';
  const isStaff = activeRole === 'staff' || activeRole === 'admin';
  const isTeacher = activeRole === 'teacher' || activeRole === 'admin';
  const isAccountant = activeRole === 'accountant' || activeRole === 'admin';
  const isParent = activeRole === 'parent';
  const isStudent = activeRole === 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        activeRole,
        setActiveRole,
        loading,
        signInWithGoogle,
        logout,
        isAdmin,
        isStaff,
        isTeacher,
        isAccountant,
        isParent,
        isStudent,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
