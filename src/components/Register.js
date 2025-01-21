import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import Swal from 'sweetalert2';
import './Login.css'; // We can reuse the login styles

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await registerUser(email, password);
            
            // Show success message
            await Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Please check your email to confirm your account.',
                confirmButtonText: 'Go to Login'
            });
            
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.message.includes('security purposes')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Wait',
                    text: 'Please wait a moment before trying again.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: error.message || 'Failed to register. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleRegister} className="login-form">
                <h2>Register</h2>
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                    <small className="password-hint">Password must be at least 6 characters long</small>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="register-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
}

export default Register; 