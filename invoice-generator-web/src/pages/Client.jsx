import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, X, Pencil, Trash2, User } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: '8px',
  border: '1px solid #334155', backgroundColor: '#0f172a',
  color: 'white', boxSizing: 'border-box', marginBottom: '1rem',
};

const labelStyle = { color: '#94a3b8', display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' };

function ClientForm({ onSuccess, editClient = null }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:    editClient?.name    || '',
    email:   editClient?.email   || '',
    phone:   editClient?.phone   || '',
    address: editClient?.address || '',
    city:    editClient?.city    || '',
    country: editClient?.country || '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editClient) {
        await api.put(`/clients/${editClient.id}`, form);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', form);
        toast.success('Client created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Address</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>City</label>
          <input type="text" name="city" value={form.city} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input type="text" name="country" value={form.country} onChange={handleChange} style={inputStyle} />
        </div>
      </div>
      <button type="submit" disabled={loading} style={{
        width: '100%', padding: '0.75rem', backgroundColor: '#6366f1',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: loading ? 0.7 : 1,
      }}>
        {loading ? 'Saving...' : editClient ? 'Update Client' : 'Create Client'}
      </button>
    </form>
  );
}

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [search, setSearch] = useState('');

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients', { params: search ? { search } : {} });
      setClients(res.data);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditClient(null);
    fetchClients();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ color: 'white', margin: 0 }}>Clients</h1>
        <button onClick={() => { setShowForm(!showForm); setEditClient(null); }} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.2rem', backgroundColor: '#6366f1',
          color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
        }}>
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close' : 'New Client'}
        </button>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{clients.length} client{clients.length !== 1 ? 's' : ''} found</p>

      {showForm && (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginTop: 0, marginBottom: '1.5rem' }}>
            {editClient ? 'Edi