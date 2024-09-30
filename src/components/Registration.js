import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Registration() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function

    const handleRegister = async (e) => {
        e.preventDefault();
        const user = { username, email, password };

        try {
            await registerUser(user);
            alert('Registration successful! You will now be redirected to the login page.');
            navigate('/login'); // Redirect to the login page after successful registration
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Registration;
