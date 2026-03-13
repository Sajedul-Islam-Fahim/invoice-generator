import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/register', form);
      setAuth(res.data.user, res.data.token);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '8px',
    border: '1px solid #334155', backgroundColor: '#0f172a',
    color: 'white', boxSizing: 'border-box',
  };

  const labelStyle = { color: '#94a3b8', display: 'block', marginBottom: '0.5rem' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.75rem', backgroundColor: '#6366f1',
            color: 'white', border: 'none', borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}