import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Download, Eye } from 'lucide-react';

const statusColors = {
  draft:   '#94a3b8',
  sent:    '#3b82f6',
  paid:    '#10b981',
  overdue: '#ef4444',
};

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '' });

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const res = await api.get('/invoices', { params });
      setInvoices(res.data);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await api.delete(`/invoices/${id}`);
      toast.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleDownloadPdf = async (invoice) => {
    try {
      const res = await api.get(`/invoices/${invoice.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const selectStyle = {
    padding: '0.5rem 0.75rem', borderRadius: '8px',
    border: '1px solid #334155', backgroundColor: '#1e293b',
    color: 'white', cursor: 'pointer', fontSize: '0.875rem',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ color: 'white', margin: 0 }}>Invoices</h1>
        <button onClick={() => navigate('/invoices/create')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.2rem', backgroundColor: '#6366f1',
          color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
        }}>
          <Plus size={18} /> New Invoice
        </button>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} found</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by invoice number..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ ...selectStyle, minWidth: '220px' }}
        />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={selectStyle}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <button onClick={() => setFilters({ status: '', search: '' })} style={{ ...selectStyle, color: '#94a3b8' }}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No invoices found.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a' }}>
                {['Invoice #', 'Client', 'Issue Date', 'Due Date', 'Total', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '1rem', color: 'white', fontWeight: '600' }}>{invoice.invoice_number}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{invoice.client?.name}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{new Date(invoice.issue_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: 'white', fontWeight: '600' }}>${invoice.grand_total}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: statusColors[invoice.status] + '22',
                      color: statusColors[invoice.status],
                      padding: '0.2rem 0.6rem', borderRadius: '999px',
                      fontSize: '0.75rem', textTransform: 'capitalize',
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/invoices/${invoice.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDownloadPdf(invoice)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981' }}>
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleDelete(invoice.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}