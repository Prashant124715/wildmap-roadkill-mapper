import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('wildmap_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  const login = (email, password) => {
    // Check for admin
    if (email === 'admin@wildmap.in' && password === 'admin123') {
      const adminUser = { id: 'admin-001', name: 'System Admin', email, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('wildmap_user', JSON.stringify(adminUser));
      return { success: true };
    }

    const users = JSON.parse(localStorage.getItem('wildmap_users') || '[]');
    const existingUser = users.find(u => u.email === email && u.password === password);
    
    if (existingUser) {
      const userData = { id: existingUser.id, name: existingUser.name, email: existingUser.email, role: 'user' };
      setUser(userData);
      localStorage.setItem('wildmap_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('wildmap_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem('wildmap_users', JSON.stringify(users));
    
    const userData = { id: newUser.id, name, email };
    setUser(userData);
    localStorage.setItem('wildmap_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wildmap_user');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthModalOpen, 
      openAuthModal, 
      closeAuthModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
