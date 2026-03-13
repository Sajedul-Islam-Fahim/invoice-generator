import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const StatCard = ({ icon, label, value, color, prefix = "" }) => (
  <div
    style={{
      backgroundColor: "#1e293b",
      borderRadius: "12px",
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      borderLeft: `4px solid ${color}`,
    }}
  >
    <div style={{ color }}>{icon}</div>
    <div>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.875rem" }}>
        {label}
      </p>
      <p
        style={{
          color: "white",
          margin: 0,
          fontSize: "1.75rem",
          fontWeight: "bold",
        }}
      >
        {prefix}
        {value}
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "4rem" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        Overview of your invoices
      </p>

      <h2
        style={{
          color: "#94a3b8",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "1rem",
        }}
      >
        Invoice Stats
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          icon={<FileText size={28} />}
          label="Total Invoices"
          value={stats?.total_invoices ?? 0}
          color="#6366f1"
        />
        <StatCard
          icon={<Clock size={28} />}
          label="Draft"
          value={stats?.draft ?? 0}
          color="#94a3b8"
        />
        <StatCard
          icon={<AlertCircle size={28} />}
          label="Sent"
          value={stats?.sent ?? 0}
          color="#3b82f6"
        />
        <StatCard
          icon={<CheckCircle size={28} />}
          label="Paid"
          value={stats?.paid ?? 0}
          color="#10b981"
        />
        <StatCard
          icon={<AlertCircle size={28} />}
          label="Overdue"
          value={stats?.overdue ?? 0}
          color="#ef4444"
        />
        <StatCard
          icon={<Users size={28} />}
          label="Total Clients"
          value={stats?.total_clients ?? 0}
          color="#f59e0b"
        />
      </div>

      <h2
        style={{
          color: "#94a3b8",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "1rem",
        }}
      >
        Revenue Stats
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatCard
          icon={<DollarSign size={28} />}
          label="Total Revenue"
          value={stats?.total_revenue ?? "0.00"}
          color="#10b981"
          prefix="$"
        />
        <StatCard
          icon={<DollarSign size={28} />}
          label="Unpaid Amount"
          value={stats?.unpaid_amount ?? "0.00"}
          color="#f59e0b"
          prefix="$"
        />
        <StatCard
          icon={<DollarSign size={28} />}
          label="Overdue Amount"
          value={stats?.overdue_amount ?? "0.00"}
          color="#ef4444"
          prefix="$"
        />
      </div>
    </div>
  );
}
