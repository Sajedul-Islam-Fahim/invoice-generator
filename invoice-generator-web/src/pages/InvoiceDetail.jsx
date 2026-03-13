import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Download, ArrowLeft } from "lucide-react";

const statusColors = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  paid: "#10b981",
  overdue: "#ef4444",
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .get(`/invoices/${id}`)
      .then((res) => setInvoice(res.data))
      .catch(() => toast.error("Failed to load invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      const res = await api.put(`/invoices/${id}`, { status });
      setInvoice(res.data);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await api.get(`/invoices/${id}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
        Loading...
      </div>
    );
  if (!invoice) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/invoices")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          <ArrowLeft size={18} /> Back to Invoices
        </button>
        <button
          onClick={handleDownloadPdf}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ color: "white", margin: 0 }}>
              {invoice.invoice_number}
            </h1>
            <p style={{ color: "#94a3b8", margin: "0.5rem 0 0" }}>
              Issue: {new Date(invoice.issue_date).toLocaleDateString()}{" "}
              &nbsp;|&nbsp; Due:{" "}
              {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Status
            </label>
            <select
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: `1px solid ${statusColors[invoice.status]}`,
                backgroundColor: statusColors[invoice.status] + "22",
                color: statusColors[invoice.status],
                cursor: "pointer",
              }}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              margin: "0 0 0.5rem",
              fontSize: "0.875rem",
            }}
          >
            Bill To
          </p>
          <p style={{ color: "white", margin: 0, fontWeight: "600" }}>
            {invoice.client?.name}
          </p>
          <p
            style={{
              color: "#94a3b8",
              margin: "0.25rem 0 0",
              fontSize: "0.875rem",
            }}
          >
            {invoice.client?.email}
          </p>
          {invoice.client?.phone && (
            <p
              style={{
                color: "#94a3b8",
                margin: "0.25rem 0 0",
                fontSize: "0.875rem",
              }}
            >
              {invoice.client?.phone}
            </p>
          )}
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1.5rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0f172a" }}>
              {["Description", "Qty", "Unit Price", "Tax %", "Total"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      color: "#94a3b8",
                      fontSize: "0.875rem",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #334155" }}>
                <td style={{ padding: "0.75rem 1rem", color: "white" }}>
                  {item.description}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>
                  ${item.unit_price}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#94a3b8" }}>
                  {item.tax_rate}%
                </td>
                <td
                  style={{
                    padding: "0.75rem 1rem",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  ${item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ width: "300px", marginLeft: "auto" }}>
          {[
            ["Subtotal", invoice.subtotal],
            ["Tax", invoice.tax_total],
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
              <span>${val}</span>
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
            <span>${invoice.grand_total}</span>
          </div>
        </div>

        {invoice.notes && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#0f172a",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                margin: "0 0 0.5rem",
                fontSize: "0.875rem",
              }}
            >
              Notes
            </p>
            <p style={{ color: "white", margin: 0 }}>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
