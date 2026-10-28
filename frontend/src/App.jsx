import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import SensorDetailPage from './pages/SensorDetailPage'; // Εισαγωγή της σελίδας λεπτομερειών

// Φύλακας προστατευμένων διαδρομών
const ProtectedRoute = ({ children, requireAdmin }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Αν δεν υπάρχει token (μη ταυτοποιημένος χρήστης), ανακατεύθυνση στο login
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    // Αν απαιτούνται δικαιώματα Admin και ο χρήστης δεν είναι Admin, ανακατεύθυνση στο Dashboard
    if (requireAdmin && user && user.role !== 'Admin') {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Σελίδα Σύνδεσης */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Κεντρικός Πίνακας Ελέγχου */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        } />

        {/* Σελίδα Λεπτομερειών Αισθητήρα (Χρονοσειρές) */}
        <Route path="/sensors/:id" element={
            <ProtectedRoute>
                <SensorDetailPage />
            </ProtectedRoute>
        } />

        {/* Σελίδα Διαχείρισης Χρηστών (Μόνο για Admin) */}
        <Route path="/users" element={
            <ProtectedRoute requireAdmin={true}>
                <UsersPage />
            </ProtectedRoute>
        } /> 
        
        {/* Ανακατεύθυνση στο login για οποιαδήποτε άλλη αρχική διαδρομή */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
