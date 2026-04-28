import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthModalOpen, openAuthModal } = useAuth();

  if (!user) {
    // If we want to force login, we could trigger modal here, 
    // but typically we just redirect to home
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
