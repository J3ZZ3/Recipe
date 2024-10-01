import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';

function Registration() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(''); // For base64 profile picture
    const navigate = useNavigate();

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicture(reader.result); // Store base64 image
        };
        reader.readAsDataURL(file);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const user = { name, surname, username, email, password, profilePicture };

        try {
            await registerUser(user);
            alert('Registration successful! You will now be redirected to the login page.');
            navigate('/login');
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
            />
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
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleProfilePictureUpload} 
                required 
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Registration;
