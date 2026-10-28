import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SensorDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sensor, setSensor] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [resolution, setResolution] = useState('raw'); // 'raw', 'hour', 'day'

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        axios.get('http://127.0.0.1:5001/api/sensors', config)
            .then(res => {
                const current = res.data.find(s => s.id === parseInt(id));
                setSensor(current);
            });

        axios.get(`http://127.0.0.1:5001/api/sensors/${id}/measurements`, config)
            .then(res => setMeasurements(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // Φιλτράρισμα / Ομαδοποίηση Χρονοσειράς
    const chartData = useMemo(() => {
        if (resolution === 'raw') return [...measurements].reverse();
        
        // Ομαδοποίηση ανά ώρα ή ημέρα
        const grouped = {};
        measurements.forEach(m => {
            const dateKey = resolution === 'hour' 
                ? m.timestamp.substring(0, 13) + ':00' 
                : m.timestamp.substring(0, 10);
            if (!grouped[dateKey]) grouped[dateKey] = { count: 0, sum: 0, unit: m.unit };
            grouped[dateKey].sum += m.value;
            grouped[dateKey].count += 1;
        });

        return Object.keys(grouped).map(key => ({
            timestamp: key,
            value: Number((grouped[key].sum / grouped[key].count).toFixed(2)),
            unit: grouped[key].unit
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [measurements, resolution]);

    return (
        <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>← Επιστροφή στον Πίνακα</button>
            
            {sensor && (
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ color: '#2c3e50', marginTop: 0 }}>{sensor.name}</h2>
                    <p style={{ color: '#666' }}>{sensor.description}</p>
                    <p><strong>Κατηγορία:</strong> {sensor.category}</p>
                </div>
            )}

            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#34495e' }}>📈 Ιστορικό Μετρήσεων (Χρονοσειρά)</h3>
                    <div>
                        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Χρονική Ανάλυση:</label>
                        <select value={resolution} onChange={(e) => setResolution(e.target.value)} style={selectStyle}>
                            <option value="raw">Όλες οι μετρήσεις (Ωμές)</option>
                            <option value="hour">Ανά Ώρα (Μέσος Όρος)</option>
                            <option value="day">Ανά Ημέρα (Μέσος Όρος)</option>
                        </select>
                    </div>
                </div>

                <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

const backBtnStyle = { padding: '10px 18px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ccc' };

export default SensorDetailPage;
