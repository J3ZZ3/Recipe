import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import Swal from 'sweetalert2';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { session } = await loginUser(email, password);
            
            if (session) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Welcome back!',
                    text: 'You have successfully logged in.',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.message.includes('Email not confirmed')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email Not Confirmed',
                    text: 'Please check your email and confirm your account before logging in.',
                    showCancelButton: true,
                    confirmButtonText: 'Resend confirmation email',
                    cancelButtonText: 'Close'
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleResendConfirmation();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid email or password. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        try {
            await resendConfirmation(email);
            Swal.fire({
                icon: 'success',
                title: 'Email Sent',
                text: 'Confirmation email has been resent. Please check your inbox.'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Resend',
                text: 'Failed to resend confirmation email. Please try again later.'
            });
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                
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
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </form>
        </div>
    );
}

export default Login;
