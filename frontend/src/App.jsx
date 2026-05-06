import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage'; // 1. Κάναμε import τη νέα σελίδα

function App() {
  return (
    <Router>
      <Routes>
        {/* Η σελίδα του Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ο Πίνακας Ελέγχου (Dashboard) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Η νέα σελίδα Διαχείρισης Χρηστών */}
        <Route path="/users" element={<UsersPage />} /> 
        
        {/* Αυτόματη ανακατεύθυνση στο login αν η διαδρομή είναι κενή */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;