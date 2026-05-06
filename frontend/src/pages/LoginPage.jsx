import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Εισαγωγή του εργαλείου πλοήγησης

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Αρχικοποίηση της πλοήγησης

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5001/login', {
                username,
                password
            });
            
            if (response.data.status === 'success') {
                // Αν η σύνδεση πετύχει, στέλνουμε τον χρήστη στο Dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Λάθος στοιχεία σύνδεσης. Δοκίμασε ξανά.');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={loginBoxStyle}>
                <h2 style={{ color: '#333' }}>Είσοδος στο Σύστημα</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        placeholder="Όνομα χρήστη" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        style={inputStyle}
                    /><br />
                    <input 
                        type="password" 
                        placeholder="Κωδικός πρόσβασης" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={inputStyle}
                    /><br />
                    <button type="submit" style={buttonStyle}>Σύνδεση</button>
                </form>
                {error && <p style={{ color: '#e74c3c', marginTop: '10px' }}>{error}</p>}
            </div>
        </div>
    );
}

// Μερικά απλά στυλ για να φαίνεται πιο όμορφη η σελίδα
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
};

const loginBoxStyle = {
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '350px'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
};

const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
};

export default LoginPage;