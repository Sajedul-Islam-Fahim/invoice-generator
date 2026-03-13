import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#0f172a",
  color: "white",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "#94a3b8",
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
};

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_id: "",
    issue_date: "",
    due_date: "",
    notes: "",
  });
  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: 0, tax_rate: 0 },
  ]);

  useEffect(() => {
    api.get("/clients").then((res) => setClients(res.data));
  }, []);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () =>
    setItems([
      ...items,
      { description: "", quantity: 1, unit_price: 0, tax_rate: 0 },
    ]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calcItemTotal = (item) => {
    const subtotal = item.quantity * item.unit_price;
    return subtotal + subtotal * (item.tax_rate / 100);
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const taxTotal = items.reduce(
    (sum, i) => sum + i.quantity * i.unit_price * (i.tax_rate / 100),
    0,
  );
  const grandTotal = subtotal + taxTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/invoices", { ...form, items });
      toast.success("Invoice created successfully");
      navigate("/invoices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "2rem" }}>
        Create New Invoice
      </h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ color: "white", marginTop: 0, marginBottom: "1.5rem" }}>
            Invoice Details
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label style={labelStyle}>Client *</label>
              <select
                name="client_id"
                value={form.client_id}
                onChange={handleFormChange}
                required
                style={inputStyle}
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Issue Date *</label>
              <input
                type="date"
                name="issue_date"
                value={form.issue_date}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Due Date *</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleFormChange}
                required
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleFormChange}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ color: "white", margin: 0 }}>Invoice Items</h2>
            <button
              type="button"
              onClick={addItem}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#334155",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr 1fr 1fr auto",
                gap: "1rem",
                alignItems: "end",
                marginBottom: "1rem",
              }}
            >
              <div>
                {index === 0 && <label style={labelStyle}>Description</label>}
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  required
                  placeholder="Service or product"
                  style={inputStyle}
                />
              </div>
              <div>
                {index === 0 && <label style={labelStyle}>Qty</label>}
                <input
                  type="number"
                  value={item.quantity}
                  min="0.01"
                  step="0.01"
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseFloat(e.target.value),
                    )
                  }
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                {index === 0 && <label style={labelStyle}>Unit Price</label>}
                <input
                  type="number"
                  value={item.unit_price}
                  min="0"
                  step="0.01"
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "unit_price",
                      parseFloat(e.target.value),
                    )
                  }
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                {index === 0 && <label style={labelStyle}>Tax %</label>}
                <input
                  type="number"
                  value={item.tax_rate}
                  min="0"
                  max="100"
                  step="0.01"
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "tax_rate",
                      parseFloat(e.target.value),
                    )
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                {index === 0 && <label style={labelStyle}>&nbsp;</label>}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: items.length === 1 ? "#475569" : "#ef4444",
                    padding: "0.75rem",
                  }}
                  disabled={items.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              borderTop: "1px solid #334155",
              paddingTop: "1rem",
              marginTop: "1rem",
            }}
          >
            <div style={{ width: "300px", marginLeft: "auto" }}>
              {[
                ["Subtotal", subtotal],
                ["Tax", taxTotal],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.4rem 0",
                    color: "#94a3b8",
                  }}
                >
                  <span>{label}</span>
                  <span>${val.toFixed(2)}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  borderTop: "1px solid #334155",
                  marginTop: "0.5rem",
                }}
              >
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "transparent",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
