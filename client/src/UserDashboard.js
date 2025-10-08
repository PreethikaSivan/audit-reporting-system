import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from './Header';
import Navbar from './Navbar';
import Observations from './Observations';
import Apps from './Apps';
import './UserDashboard.css';

const DashboardContent = () => {
    const [observations, setObservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAudits: 0,
        trouble: 0,
        needsAttention: 0,
        onPlan: 0,
        completed: 0,
    });
    const [chartData, setChartData] = useState({
        auditorData: [],
        locationData: [],
        categoryData: [],
    });

    const fetchObservations = async () => {
        try {
            const response = await fetch('/api/observations');
            const data = await response.json();
            setObservations(data);

            // Calculate statistics
            const totalAudits = data.length;
            const trouble = data.filter(obs => obs.category === 'Trouble').length;
            const needsAttention = data.filter(obs => obs.category === 'Needs Attention').length;
            const onPlan = data.filter(obs => obs.category === 'On-plan').length;
            const completed = 0; // Assuming 'Completed' is a state you would set

            setStats({
                totalAudits,
                trouble,
                needsAttention,
                onPlan,
                completed,
            });

            // Process data for charts
            const countByAuditor = {};
            const countByLocation = {};
            const countByCategory = {};

            data.forEach(obs => {
                countByAuditor[obs.auditorName] = (countByAuditor[obs.auditorName] || 0) + 1;
                countByLocation[obs.location] = (countByLocation[obs.location] || 0) + 1;
                countByCategory[obs.category] = (countByCategory[obs.category] || 0) + 1;
            });

            const auditorData = Object.keys(countByAuditor).map(name => ({
                name,
                count: countByAuditor[name],
            }));

            const locationData = Object.keys(countByLocation).map(name => ({
                name,
                count: countByLocation[name],
            }));

            const categoryData = Object.keys(countByCategory).map(name => ({
                name,
                count: countByCategory[name],
            }));

            setChartData({ auditorData, locationData, categoryData });
        } catch (error) {
            console.error("Failed to fetch observations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObservations();
    }, []);

    if (loading) {
        return <div className="loading">Loading dashboard data...</div>;
    }

    return (
        <div className="main-content"> 
            <div className="stats-table-container">
                <table className="stats-table">
                    <thead>
                        <tr className="stats-heading">
                            <th colSpan="5">Enterprise Wide Statistics</th>
                        </tr>
                        <tr className="stats-columns">
                            <th>Total Audits</th>
                            <th>Trouble</th>
                            <th>Needs Attention</th>
                            <th>On-plan</th>
                            <th>Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="stats-values">
                            <td>{stats.totalAudits}</td>
                            <td>{stats.trouble}</td>
                            <td>{stats.needsAttention}</td>
                            <td>{stats.onPlan}</td>
                            <td>{stats.completed}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="chart-row">
                {/* Auditor-wise Bar Chart */}
                <div className="chart-container">
                    <h3>Auditor-wise Breakdown</h3>
                    <ResponsiveContainer width="80%" height={300}>
                        <BarChart data={chartData.auditorData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#1e8643ff" name="Audits" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Location-wise Bar Chart */}
                <div className="chart-container">
                    <h3>Location-wise Breakdown</h3>
                    <ResponsiveContainer width="80%" height={300}>
                        <BarChart data={chartData.locationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#29a7d0d3" name="Locations" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category-wise Bar Chart */}
            <div className="chart-container full-width-chart">
                <h3>Category-wise Breakdown</h3>
                <ResponsiveContainer width="80%" height={300}>
                    <BarChart data={chartData.categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#34495e" name="Observations" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

function UserDashboard() {
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Get role and username directly from localStorage
    const role = localStorage.getItem('role');
    const username = role === 'user' ? localStorage.getItem('username') : '';

    const lastLogin = localStorage.getItem('lastLogin'); // optional if needed in header

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardContent />;
            case 'observations':
                return <Observations />;
            case 'apps':
                return <Apps />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <div className="dashboard-container">
            <Header username={username} lastLogin={lastLogin} />
            <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
            {renderPage()}
        </div>
    );
}


export default UserDashboard;
