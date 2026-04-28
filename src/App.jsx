import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import StateAnalysis from './pages/StateAnalysis';
import Resources from './pages/Resources';
import MyReports from './pages/MyReports';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import { useNetwork } from './hooks/useNetwork';
import { WifiOff } from 'lucide-react';

import { useLocation } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReportManagement from './pages/admin/ReportManagement';
import AdminMap from './pages/admin/AdminMap';
import HotspotAnalysis from './pages/admin/HotspotAnalysis';

const AppContent = () => {
  const isOnline = useNetwork();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white bg-grid">
      {!isOnline && (
        <div className="bg-red-500/90 backdrop-blur text-white text-xs font-bold tracking-widest uppercase py-2 px-4 flex justify-center items-center gap-2 z-[100] relative">
          <WifiOff size={14} />
          You are offline. Showing last available data.
        </div>
      )}
      
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<StateAnalysis />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-reports" element={<MyReports />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<ReportManagement />} />
            <Route path="map" element={<AdminMap />} />
            <Route path="hotspots" element={<HotspotAnalysis />} />
          </Route>
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
      <AuthModal />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
