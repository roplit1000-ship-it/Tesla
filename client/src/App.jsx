import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import InvestorSimulation from './pages/InvestorSimulation';
import Newsroom from './pages/Newsroom';
import Marketplace from './pages/Marketplace';
import Learn from './pages/Learn';
import Future from './pages/Future';
import About from './pages/About';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TierDetail from './pages/TierDetail';
import DepositPage from './pages/DepositPage';
import MarketplaceDeposit from './pages/MarketplaceDeposit';
import AdminPortal from './pages/AdminPortal';
import './styles/global.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/investor" element={<InvestorSimulation />} />
          <Route path="/newsroom" element={<Newsroom />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/future" element={<Future />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/tier/:tierSlug" element={<TierDetail />} />
          <Route path="/deposit/:tierSlug" element={<DepositPage />} />
          <Route path="/order-checkout" element={<MarketplaceDeposit />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPortal /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
