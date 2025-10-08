import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; // Create this file for styling

const AdminDashboard = ({ username, lastLogin }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAudits: 0,
        pendingApprovals: 0,
    });

    // Example: Fetch some admin data (replace with your real API later)
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Replace with your backend API call
                const response = await fetch('/api/admin/stats');
                const data = await response.json();
                setStats({
                    totalUsers: data.totalUsers || 0,
                    totalAudits: data.totalAudits || 0,
                    pendingApprovals: data.pendingApprovals || 0,
                });
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            }
        };

        fetchAdminData();
    }, []);

    return (
        <div className="admin-dashboard-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, {username} | Last login: {new Date(lastLogin).toLocaleString()}</p>
            </header>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Audits</h3>
                    <p>{stats.totalAudits}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Approvals</h3>
                    <p>{stats.pendingApprovals}</p>
                </div>
            </div>

            <div className="admin-placeholder">
                <p>Additional admin controls will appear here.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
