import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './pages/Dashboard';
import GroupsPage from './pages/GroupsPage';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
