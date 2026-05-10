import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Gallery from './pages/Gallery';
import StateAnalysis from './pages/StateAnalysis';
import Resources from './pages/Resources';
import MyReports from './pages/MyReports';
import BiodiversityInsights from './pages/BiodiversityInsights';
import DriverSafety from './pages/DriverSafety';
import SeasonalTrends from './pages/SeasonalTrends';

// Report Pages
import ReportIncident from './pages/reports/ReportIncident';
import ConflictSupport from './pages/reports/ConflictSupport';
import ContactUs from './pages/reports/ContactUs';

import About from './pages/About';

import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import FloatingLanguageSelector from './components/ui/FloatingLanguageSelector';
import { useNetwork } from './hooks/useNetwork';
import { WifiOff } from 'lucide-react';

import { useLocation } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReportManagement from './pages/admin/ReportManagement';
import AdminMap from './pages/admin/AdminMap';
import HotspotAnalysis from './pages/admin/HotspotAnalysis';
import ConflictManagement from './pages/admin/ConflictManagement';

const AppContent = () => {
  const isOnline = useNetwork();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white bg-grid">
      {!isOnline && (
        <div className="bg-red-500/90 backdrop-blur text-white text-xs font-bold tracking-widest uppercase py-2 px-4 flex justify-center items-center gap-2 z-[100] relative">
          <WifiOff size={14} />
          You are offline. Showing last available data.
        </div>
      )}
      
      {!isAdminRoute && <Navbar />}
      
      <main className={`flex-grow ${!isHome && !isAdminRoute ? 'pt-20' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<StateAnalysis />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/seasonal-trends" element={<SeasonalTrends />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/biodiversity" element={<BiodiversityInsights />} />
          <Route path="/driver-safety" element={<DriverSafety />} />
          
          {/* Protected Report Routes */}
          <Route path="/reports/incident" element={<ReportIncident />} />
          <Route path="/reports/conflict-support" element={<ConflictSupport />} />
          <Route path="/reports/contact" element={<ContactUs />} />

          <Route path="/about" element={<About />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<ReportManagement />} />
            <Route path="conflicts" element={<ConflictManagement />} />
            <Route path="map" element={<AdminMap />} />
            <Route path="hotspots" element={<HotspotAnalysis />} />
          </Route>
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
      <AuthModal />
      <FloatingLanguageSelector />
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
