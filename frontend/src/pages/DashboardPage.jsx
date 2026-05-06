import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function DashboardPage() {
    const [stats, setStats] = useState({});
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        // Παίρνουμε τα στατιστικά και τα δεδομένα του γραφήματος
        axios.get('http://127.0.0.1:5001/api/stats').then(res => setStats(res.data));
        // Παίρνουμε τη λίστα των αισθητήρων
        axios.get('http://127.0.0.1:5001/api/sensors').then(res => setSensors(res.data));
    }, []);

    const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'];

    return (
        <div style={{ padding: '30px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '40px' }}>📊 Πίνακας Ελέγχου Συστήματος</h1>
            
            {/* ΚΑΡΤΕΣ ΣΤΑΤΙΣΤΙΚΩΝ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Σύνολο Αισθητήρων</p>
                    <h2 style={{ margin: '10px 0 0 0' }}>{stats.total_sensors || 0}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Εγγεγραμμένοι Χρήστες</p>
                    <h2 style={{ margin: '10px 0 0 0' }}>{stats.total_users || 0}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Ενεργά Alerts</p>
                    <h2 style={{ margin: '10px 0 0 0' }}>{stats.active_alerts || 0}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Μέση Θερμοκρασία</p>
                    <h2 style={{ margin: '10px 0 0 0' }}>{stats.avg_temp || 0}°C</h2>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* ΓΡΑΦΗΜΑ */}
                <div style={{ flex: '1', minWidth: '300px', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0, color: '#34495e' }}>Κατανομή ανά Κατηγορία</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie 
                                    data={stats.chart_data || []} 
                                    innerRadius={70} 
                                    outerRadius={90} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {(stats.chart_data || []).map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ΠΙΝΑΚΑΣ */}
                <div style={{ flex: '2', minWidth: '400px', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ marginTop: 0, color: '#34495e' }}>Λίστα Αισθητήρων</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#7f8c8d' }}>
                                <th style={{ padding: '12px' }}>Όνομα</th>
                                <th style={{ padding: '12px' }}>Κατηγορία</th>
                                <th style={{ padding: '12px' }}>Περιγραφή</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sensors.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{s.name}</td>
                                    <td style={{ padding: '12px' }}><span style={tagStyle}>{s.category}</span></td>
                                    <td style={{ padding: '12px', color: '#95a5a6', fontSize: '14px' }}>{s.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    padding: '25px',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
};

const tagStyle = {
    padding: '4px 10px',
    background: '#e1f5fe',
    color: '#0288d1',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
};

export default DashboardPage;