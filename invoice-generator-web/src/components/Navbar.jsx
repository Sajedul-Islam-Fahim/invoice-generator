import { Link, useNavigate } from 'react-router-dom';
import { LogOut, FileText } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // silent
    } finally {
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e293b',
      color: 'white',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={24} color="#6366f1" />
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Invoice Generator</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/clients" style={{ color: 'white', textDecoration: 'none' }}>Clients</Link>
        <Link to="/invoices" style={{ color: 'white', textDecoration: 'none' }}>Invoices</Link>
        <span style={{ color: '#94a3b8' }}>Hi, {user?.name}</span>
        <button onClick={handleLogout} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: 'none',
          border: '1px solid #475569',
          color: 'white',
          padding: '0.4rem 0.8rem',
          borderRadius: '6px',
          cursor: 'pointer',
        }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}