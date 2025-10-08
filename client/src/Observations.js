import React, { useState, useEffect } from 'react';
import './Observations.css';
import jsPDF from "jspdf";

const Observations = () => {
    const [auditorName, setAuditorName] = useState('');
    const [auditeeName, setAuditeeName] = useState('');
    const [location, setLocation] = useState('');
    const [observationText, setObservationText] = useState('');
    const [category, setCategory] = useState('On-plan');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [observations, setObservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedObservation, setSelectedObservation] = useState(null);

    // Fetch existing observations
    const fetchObservations = async () => {
        try {
            const response = await fetch('/api/observations');
            const data = await response.json();
            setObservations(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch observations');
        } finally {
            setLoading(false);
        }
    };

    // Save a new observation
    const saveObservation = async (e) => {
        e.preventDefault();
        const newObservation = {
            auditorName,
            auditeeName,
            location,
            observation: observationText,
            category,
            startDate,
            endDate,
            timestamp: new Date().toISOString(),
        };

        try {
            const res = await fetch('/api/observations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newObservation),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage(data.msg || 'Observation saved successfully!');
                setAuditorName('');
                setAuditeeName('');
                setLocation('');
                setObservationText('');
                setCategory('On-plan');
                setStartDate('');
                setEndDate('');
                fetchObservations();
                setTimeout(() => setSuccessMessage(null), 1500);
            } else {
                setError(data.error || 'Failed to save observation');
                setTimeout(() => setError(null), 2000);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save observation');
        }
    };

    // Export observations to CSV
    const exportCSV = () => {
        if (observations.length === 0) return;
        const headers = ['Auditor', 'Auditee', 'Location', 'Observation', 'Category', 'Start Date', 'End Date', 'Timestamp'];
        const rows = observations.map(obs => [
            obs.auditorName,
            obs.auditeeName,
            obs.location,
            obs.observation,
            obs.category,
            obs.startDate ? new Date(obs.startDate).toLocaleDateString() : '',
            obs.endDate ? new Date(obs.endDate).toLocaleDateString() : '',
            obs.timestamp ? new Date(obs.timestamp).toLocaleString() : '',
        ]);

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(item => `"${item}"`).join(',') + '\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'observations.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Download single observation as PDF
    const downloadObservationPDF = (observation) => {
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Observation Details", 105, 20, null, null, "center"); // centered

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        let y = 35;

        const details = [
            ["Auditor:", observation.auditorName],
            ["Auditee:", observation.auditeeName],
            ["Location:", observation.location || "-"],
            ["Observation:", observation.observation],
            ["Category:", observation.category],
            ["Start Date:", observation.startDate ? new Date(observation.startDate).toLocaleDateString() : "-"],
            ["End Date:", observation.endDate ? new Date(observation.endDate).toLocaleDateString() : "-"],
            ["Created At:", observation.timestamp ? new Date(observation.timestamp).toLocaleString() : "-"],
        ];

        details.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold");
            doc.text(label, 20, y);
            doc.setFont("helvetica", "normal");
            doc.text(String(value), 70, y);
            y += 10;
        });

        doc.save(`${observation.auditorName || "observation"}.pdf`);
    };

    useEffect(() => {
        fetchObservations();
    }, []);

    if (loading) return <div className="loading">Loading observations...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="observations-container">
            {successMessage && <div className="success-popup">{successMessage}</div>}

            {/* Add New Observation Form */}
            <div className="form-container">
                <h2 className="form-heading">Add New Observation</h2>
                <form onSubmit={saveObservation}>
                    <div className="form-group">
                        <label>Auditor Name:</label>
                        <input type="text" value={auditorName} onChange={(e) => setAuditorName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Auditee Name:</label>
                        <input type="text" value={auditeeName} onChange={(e) => setAuditeeName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Location:</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Observation:</label>
                        <textarea value={observationText} onChange={(e) => setObservationText(e.target.value)} required></textarea>
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="On-plan">On-plan</option>
                            <option value="Needs Attention">Needs Attention</option>
                            <option value="Trouble">Trouble</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Date:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>End Date:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button type="submit" className="save-btn">Save Observation</button>
                </form>
            </div>

            {/* Previous Observations Heading */}
            <h2 className="section-heading">Previous Observations</h2>

            {/* Observations Table */}
            <div className="observations-table-container">
                <table className="observations-table">
                    <thead>
                        <tr>
                            <th>Auditor</th>
                            <th>Auditee</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {observations.map((obs, idx) => (
                            <tr key={idx} onClick={() => setSelectedObservation(obs)}>
                                <td>{obs.auditorName}</td>
                                <td>{obs.auditeeName}</td>
                                <td>{obs.location || '-'}</td>
                                <td>{obs.category}</td>
                                <td>{obs.startDate ? new Date(obs.startDate).toLocaleDateString() : '-'}</td>
                                <td>{obs.endDate ? new Date(obs.endDate).toLocaleDateString() : '-'}</td>
                                <td>{obs.timestamp ? new Date(obs.timestamp).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ width: '100%', maxWidth: '900px', textAlign: 'right', marginTop: '10px' }}>
                <button className="save-btn" onClick={exportCSV}>Export CSV</button>
            </div>

            {/* Observation Details Modal */}
            {selectedObservation && (
                <>
                    <div className="overlay" onClick={() => setSelectedObservation(null)}></div>
                    <div className="observation-modal">
                        <h3>Observation Details</h3>
                        <p><strong>Auditor:</strong> {selectedObservation.auditorName}</p>
                        <p><strong>Auditee:</strong> {selectedObservation.auditeeName}</p>
                        <p><strong>Location:</strong> {selectedObservation.location || '-'}</p>
                        <p><strong>Observation:</strong> {selectedObservation.observation}</p>
                        <p><strong>Category:</strong> {selectedObservation.category}</p>
                        <p><strong>Start Date:</strong> {selectedObservation.startDate ? new Date(selectedObservation.startDate).toLocaleDateString() : '-'}</p>
                        <p><strong>End Date:</strong> {selectedObservation.endDate ? new Date(selectedObservation.endDate).toLocaleDateString() : '-'}</p>
                        <p><strong>Created At:</strong> {selectedObservation.timestamp ? new Date(selectedObservation.timestamp).toLocaleString() : '-'}</p>
                        <div className="modal-buttons">
                            <button className="download-btn" onClick={() => downloadObservationPDF(selectedObservation)}>Download PDF</button>
                            <button className="close-btn" onClick={() => setSelectedObservation(null)}>Close</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Observations;
