import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function DashboardPage() {
    const [stats, setStats] = useState({});
    const [sensors, setSensors] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);

    // Modals state
    const [showSensorModal, setShowSensorModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    
    // Sensor Form
    const [sensorName, setSensorName] = useState('');
    const [sensorDesc, setSensorDesc] = useState('');
    const [selectedCats, setSelectedCats] = useState([]);

    // User Form
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newFullName, setNewFullName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('Simple');

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const loadData = () => {
        axios.get('http://127.0.0.1:5001/api/stats', config).then(res => setStats(res.data)).catch(() => navigate('/login'));
        axios.get('http://127.0.0.1:5001/api/sensors', config).then(res => setSensors(res.data));
        axios.get('http://127.0.0.1:5001/api/categories', config).then(res => setCategories(res.data));
        
        const currentUser = JSON.parse(localStorage.getItem('user'));
        setUser(currentUser);
        if (currentUser?.role === 'Admin') {
            axios.get('http://127.0.0.1:5001/api/users', config).then(res => setUsers(res.data));
        }
    };

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        loadData();
    }, []);

    // Sensor Actions
    const handleCreateSensor = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:5001/api/sensors', {
            name: sensorName,
            description: sensorDesc,
            category_ids: selectedCats
        }, config);
        setShowSensorModal(false);
        setSensorName(''); setSensorDesc(''); setSelectedCats([]);
        loadData();
    };

    const handleDeleteSensor = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις τον αισθητήρα;')) {
            await axios.delete(`http://127.0.0.1:5001/api/sensors/${id}`, config);
            loadData();
        }
    };

    // User Actions
    const handleCreateUser = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:5001/api/users', {
            username: newUsername,
            password: newPassword,
            full_name: newFullName,
            email: newEmail,
            role: newRole
        }, config);
        setShowUserModal(false);
        setNewUsername(''); setNewPassword(''); setNewFullName(''); setNewEmail('');
        loadData();
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις τον χρήστη;')) {
            await axios.delete(`http://127.0.0.1:5001/api/users/${id}`, config);
            loadData();
        }
    };

    const COLORS = ['#3498db', '#2ecc71', '#e67e22', '#e74c3c'];

    return (
        <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>📊 Πίνακας Ελέγχου Συστήματος</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>Συνδεδεμένος: <strong>{user?.full_name || user?.username}</strong> ({user?.role})</span>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={logoutBtnStyle}>Αποσύνδεση</button>
                </div>
            </div>

            {/* 4 Κάρτες */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}><p>Σύνολο Αισθητήρων</p><h2>{stats.total_sensors ?? 0}</h2></div>
                <div style={cardStyle}><p>Εγγεγραμμένοι Χρήστες</p><h2>{stats.total_users ?? 0}</h2></div>
                <div style={cardStyle}><p>Σύνολο Μετρήσεων</p><h2>{stats.total_measurements ?? 0}</h2></div>
                <div style={cardStyle}><p>Μέση Θερμοκρασία</p><h2>{stats.avg_temp ?? 0} °C</h2></div>
            </div>

            {/* Γραφήματα */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '35px' }}>
                <div style={boxStyle}>
                    <h3 style={{ marginTop: 0 }}>Κατανομή Αισθητήρων ανά Κατηγορία</h3>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={stats.category_chart || []} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                    {(stats.category_chart || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip /><Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={boxStyle}>
                    <h3 style={{ marginTop: 0 }}>Καταγραφές ανά Αισθητήρα</h3>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.sensor_chart || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="measurements" fill="#3498db" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Πίνακας Αισθητήρων */}
            <div style={{ ...boxStyle, marginBottom: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Κατάλογος Αισθητήρων <span style={{ fontSize: '13px', color: '#888' }}>(Κάνε κλικ για λεπτομέρειες)</span></h3>
                    {user?.role === 'Admin' && (
                        <button onClick={() => setShowSensorModal(true)} style={actionBtnStyle}>+ Νέος Αισθητήρας</button>
                    )}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#777' }}>
                            <th style={{ padding: '12px' }}>Όνομα</th>
                            <th style={{ padding: '12px' }}>Κατηγορία</th>
                            <th style={{ padding: '12px' }}>Περιγραφή</th>
                            <th style={{ padding: '12px' }}>Μετρήσεις</th>
                            {user?.role === 'Admin' && <th style={{ padding: '12px' }}>Ενέργειες</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sensors.map(s => (
                            <tr key={s.id} onClick={() => navigate(`/sensors/${s.id}`)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold', color: '#0288d1' }}>{s.name}</td>
                                <td style={{ padding: '12px' }}>{s.category}</td>
                                <td style={{ padding: '12px', color: '#666' }}>{s.description}</td>
                                <td style={{ padding: '12px' }}>{s.measurements_count}</td>
                                {user?.role === 'Admin' && (
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={(e) => handleDeleteSensor(s.id, e)} style={deleteBtnStyle}>Διαγραφή</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Πίνακας Χρηστών (Μόνο για Admin) */}
            {user?.role === 'Admin' && (
                <div style={boxStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#c0392b' }}>👥 Διαχείριση Χρηστών</h3>
                        <button onClick={() => setShowUserModal(true)} style={actionBtnStyle}>+ Νέος Χρήστης</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#777' }}>
                                <th style={{ padding: '12px' }}>Username</th>
                                <th style={{ padding: '12px' }}>Ονοματεπώνυμο</th>
                                <th style={{ padding: '12px' }}>Email</th>
                                <th style={{ padding: '12px' }}>Ρόλος</th>
                                <th style={{ padding: '12px' }}>Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.username}</td>
                                    <td style={{ padding: '12px' }}>{u.full_name}</td>
                                    <td style={{ padding: '12px' }}>{u.email}</td>
                                    <td style={{ padding: '12px' }}>{u.role}</td>
                                    <td style={{ padding: '12px' }}>
                                        {u.username !== 'admin' && (
                                            <button onClick={() => handleDeleteUser(u.id)} style={deleteBtnStyle}>Διαγραφή</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL ΝΕΟΥ ΑΙΣΘΗΤΗΡΑ */}
            {showSensorModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3>Προσθήκη Νέου Αισθητήρα</h3>
                        <form onSubmit={handleCreateSensor}>
                            <input placeholder="Όνομα αισθητήρα" required value={sensorName} onChange={e => setSensorName(e.target.value)} style={modalInput} />
                            <input placeholder="Περιγραφή" value={sensorDesc} onChange={e => setSensorDesc(e.target.value)} style={modalInput} />
                            
                            <p style={{ textAlign: 'left', margin: '10px 0 5px' }}>Επιλογή Κατηγοριών:</p>
                            {categories.map(cat => (
                                <label key={cat.id} style={{ display: 'block', textAlign: 'left', marginBottom: '5px' }}>
                                    <input 
                                        type="checkbox" 
                                        value={cat.id}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedCats([...selectedCats, cat.id]);
                                            else setSelectedCats(selectedCats.filter(id => id !== cat.id));
                                        }}
                                    /> {cat.name}
                                </label>
                            ))}
                            <div style={{ marginTop: '15px' }}>
                                <button type="submit" style={actionBtnStyle}>Αποθήκευση</button>
                                <button type="button" onClick={() => setShowSensorModal(false)} style={{ ...deleteBtnStyle, marginLeft: '10px' }}>Ακύρωση</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ΝΕΟΥ ΧΡΗΣΤΗ */}
            {showUserModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3>Προσθήκη Νέου Χρήστη</h3>
                        <form onSubmit={handleCreateUser}>
                            <input placeholder="Username" required value={newUsername} onChange={e => setNewUsername(e.target.value)} style={modalInput} />
                            <input type="password" placeholder="Password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={modalInput} />
                            <input placeholder="Ονοματεπώνυμο" value={newFullName} onChange={e => setNewFullName(e.target.value)} style={modalInput} />
                            <input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={modalInput} />
                            <select value={newRole} onChange={e => setNewRole(e.target.value)} style={modalInput}>
                                <option value="Simple">Simple User</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div style={{ marginTop: '15px' }}>
                                <button type="submit" style={actionBtnStyle}>Αποθήκευση</button>
                                <button type="button" onClick={() => setShowUserModal(false)} style={{ ...deleteBtnStyle, marginLeft: '10px' }}>Ακύρωση</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

const cardStyle = { padding: '20px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', borderRadius: '12px' };
const boxStyle = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const logoutBtnStyle = { padding: '8px 14px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const actionBtnStyle = { padding: '8px 14px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const deleteBtnStyle = { padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContent = { background: 'white', padding: '30px', borderRadius: '10px', width: '350px', textAlign: 'center' };
const modalInput = { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' };

export default DashboardPage;
