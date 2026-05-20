import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductCreation from './pages/ProductCreation';
import Billing from './pages/Billing';
import Purchase from './pages/Purchase';
import CRM from './pages/CRM';
import Reports from './pages/Reports';
import MobileBarcode from './pages/MobileBarcode';

function AppRoutes() {
  const { user } = useAuth();
  if (!user) return <Login />;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="product-creation" element={<ProductCreation />} />
          <Route path="billing" element={<Billing />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="crm" element={<CRM />} />
          <Route path="reports" element={<Reports />} />
          <Route path="mobile-barcode" element={<MobileBarcode />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
