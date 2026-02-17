import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import {
  AiOutlineUser,
  AiOutlineSwap,
  AiOutlineApi,
  AiOutlineCalendar,
  AiOutlineArrowUp,
  AiOutlineBarChart,
  AiOutlineReload,
} from "react-icons/ai";

import "../../components/css/dashboard.css";

/* ================= REDUX ================= */
import { useSelector } from "react-redux";

export default function Dashboard() {
  /* ================= UI STATE ================= */
  const [activeTab, setActiveTab] = useState("users");

  /* ================= REDUX DATA ================= */
  const users = useSelector((state) => state.users?.users || []);
  const vendors = useSelector((state) => state.vendorApiKeys?.vendors || []);
  const apis = useSelector((state) => state.vendorApiKeys?.apis || []);

  /* 🔥 BALANCE FROM REDUX (NO CONTEXT) */
  const balanceRequests = useSelector(
    (state) => state.balance?.requests || []
  );

  /* ================= CONSTANTS ================= */
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  /* ================= KPI ================= */
  const activeApis = useMemo(() => apis.length, [apis]);
  const vendorsCount = useMemo(() => vendors.length, [vendors]);

  /* ================= TOTAL BALANCE ================= */
  const totalBalance = useMemo(() => {
    return balanceRequests
      .filter((r) => r.status === "Approved")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
  }, [balanceRequests]);

  /* ================= USER GROWTH ================= */
  const userData = useMemo(() => {
    return months.map((month) => ({
      month,
      value: users.filter((u) => {
        if (!u.registeredAt) return false;
        return (
          new Date(u.registeredAt).toLocaleString("default", {
            month: "short",
          }) === month
        );
      }).length,
    }));
  }, [users, months]);

  /* ================= TRANSACTIONS (APPROVED RECHARGES) ================= */
  const transactionData = useMemo(() => {
    return months.map((month) => ({
      month,
      value: balanceRequests
        .filter((r) => {
          if (!r.date || r.status !== "Approved") return false;
          return (
            new Date(r.date).toLocaleString("default", {
              month: "short",
            }) === month
          );
        })
        .reduce((sum, r) => sum + Number(r.amount || 0), 0),
    }));
  }, [balanceRequests, months]);

  /* ================= API USAGE (DEMO) ================= */
  const apiData = useMemo(() => {
    return apis.map((a) => ({
      month: a.name,
      value: Math.floor(Math.random() * 300 + 50),
    }));
  }, [apis]);

  /* ================= RECENT ACTIVITY ================= */
  const recent = useMemo(() => {
    return [
      ...users.slice(-3).map((u) => `👤 User "${u.name}" registered`),
      ...vendors.slice(-3).map((v) => `🏢 Vendor "${v.vendor_name}" added`),
      ...apis.slice(-3).map((a) => `🔌 API "${a.name}" added`),
      ...balanceRequests
        .filter((r) => r.status === "Approved")
        .slice(-3)
        .map(
          (r) => `💰 ₹${r.amount} recharge approved for ${r.clientName}`
        ),
    ].reverse();
  }, [users, vendors, apis, balanceRequests]);

  /* ================= TOP CLIENTS ================= */
  const topClients = useMemo(() => {
    return users.slice(0, 5).map((u) => ({
      name: u.name,
      usage: `${Math.floor(Math.random() * 500 + 50)} req/day`,
    }));
  }, [users]);

  /* ================= ACTIVE CHART ================= */
  const { activeData, title, color } = useMemo(() => {
    if (activeTab === "users")
      return { activeData: userData, title: "User Growth", color: "#2563eb" };
    if (activeTab === "transactions")
      return {
        activeData: transactionData,
        title: "Transactions",
        color: "#16a34a",
      };
    return { activeData: apiData, title: "API Usage", color: "#9333ea" };
  }, [activeTab, userData, transactionData, apiData]);

  /* ================= METRICS ================= */
  const metrics = useMemo(() => {
    const values = activeData.map((d) => Number(d.value) || 0);
    const total = values.reduce((s, v) => s + v, 0);
    const latest = values.at(-1) || 0;
    const prev = values.at(-2) || 0;
    return { latest, growth: latest - prev, total };
  }, [activeData]);

  const handleRefresh = () => {
    toast.info("Dashboard refreshed", { autoClose: 800 });
  };

  return (
    <div className="dash-root">
      {/* HEADER */}
      <div className="dash-header">
        <h2>Dashboard Overview</h2>
        <button className="refresh-btn" onClick={handleRefresh}>
          <AiOutlineReload /> Refresh
        </button>
      </div>

      {/* KPI */}
      <div className="kpi-row">
        <motion.div className="kpi-card">
          <p>Users</p>
          <h2><CountUp end={users.length} /></h2>
        </motion.div>

        <motion.div className="kpi-card">
          <p>APIs</p>
          <h2><CountUp end={activeApis} /></h2>
        </motion.div>

        <motion.div className="kpi-card">
          <p>Vendors</p>
          <h2><CountUp end={vendorsCount} /></h2>
        </motion.div>

        <motion.div className="kpi-card">
          <p>Balance</p>
          <h2>₹<CountUp end={totalBalance} /></h2>
        </motion.div>
      </div>

      {/* CHART + TABS */}
      <div className="dash-top-row">
        <div className="chart-column">
          <div className="tabs-row">
            <button className={activeTab === "users" ? "active tab" : "tab"} onClick={() => setActiveTab("users")}>
              <AiOutlineUser /> Users
            </button>
            <button className={activeTab === "transactions" ? "active tab" : "tab"} onClick={() => setActiveTab("transactions")}>
              <AiOutlineSwap /> Transactions
            </button>
            <button className={activeTab === "api" ? "active tab" : "tab"} onClick={() => setActiveTab("api")}>
              <AiOutlineApi /> APIs
            </button>
          </div>

          <motion.div className="big-chart-card">
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* STATS */}
        <aside className="stats-column">
          <div className="stat-box">
            <small>Latest</small>
            <h4><CountUp end={metrics.latest} /></h4>
            <AiOutlineCalendar />
          </div>
          <div className="stat-box">
            <small>Growth</small>
            <h4><CountUp end={metrics.growth} /></h4>
            <AiOutlineArrowUp />
          </div>
          <div className="stat-box">
            <small>Total</small>
            <h4><CountUp end={metrics.total} /></h4>
            <AiOutlineBarChart />
          </div>
        </aside>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="recent-card">
        <h4>Recent Activity</h4>
        <ul>
          <AnimatePresence>
            {recent.map((r, i) => (
              <motion.li key={i}>{r}</motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* TOP CLIENTS */}
      <div className="recent-card">
        <h4>Top Clients</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {topClients.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
