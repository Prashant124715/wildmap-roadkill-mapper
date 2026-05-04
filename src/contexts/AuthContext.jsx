import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Listen for real-time auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Special case for our hardcoded admin email if they want to keep it simple
        const isAdmin = firebaseUser.email === 'admin@wildmap.in';
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || (isAdmin ? 'System Admin' : 'User'),
          email: firebaseUser.email,
          role: isAdmin ? 'admin' : 'user'
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // 1. Check for hardcoded admin first (bypassing Firebase)
    if (email === 'admin@wildmap.in' && password === 'admin@123') {
      setUser({
        id: 'admin-hardcoded-001',
        name: 'System Admin',
        email: 'admin@wildmap.in',
        role: 'admin'
      });
      return { success: true };
    }

    // 2. Otherwise, check Firebase Auth for regular users
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Local state will update via onAuthStateChanged
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Explicitly clear local state (crucial for hardcoded admin bypass)
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null); // Clear state even on error to ensure user can exit
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      login, 
      signup, 
      logout, 
      isAuthModalOpen, 
      openAuthModal, 
      closeAuthModal 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
