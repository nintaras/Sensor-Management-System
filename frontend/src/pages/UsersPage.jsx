import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        axios.get('http://127.0.0.1:5001/api/users', config)
            .then(res => setUsers(res.data))
            .catch(err => {
                // Αν δεν είσαι Admin (403) ή λήξει το token (401), διώχνουμε το χρήστη
                if(err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/dashboard');
                }
            });
    }, [navigate]);

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <h1 style={{ color: '#2c3e50' }}>👥 Διαχείριση Χρηστών</h1>
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: '#7f8c8d' }}>
                            <th style={{ padding: '15px' }}>Username</th>
                            <th style={{ padding: '15px' }}>Ονοματεπώνυμο</th>
                            <th style={{ padding: '15px' }}>Email</th>
                            <th style={{ padding: '15px' }}>Ρόλος</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{u.username}</td>
                                <td style={{ padding: '15px' }}>{u.full_name}</td>
                                <td style={{ padding: '15px' }}>{u.email}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        padding: '5px 12px', borderRadius: '15px', 
                                        background: u.role === 'Admin' ? '#fff3e0' : '#e8f5e9',
                                        color: u.role === 'Admin' ? '#ef6c00' : '#2e7d32',
                                        fontSize: '13px', fontWeight: 'bold'
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersPage;
