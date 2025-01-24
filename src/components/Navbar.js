import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const defaultProfilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getProfilePicture = () => {
        if (!user) return defaultProfilePic;
        
        // Check if user has a profile picture URL and it's valid
        if (user.profile_picture && user.profile_picture.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
            return user.profile_picture;
        }
        
        return defaultProfilePic;
    };

    const handleLogout = async () => {
        try {
            await onLogout(); // Call the logout function passed as a prop
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">Recipe</span>
                    <span className="logo-accent">Hub</span>
                </Link>

                {user && (
                    <div className="nav-controls">
                        <Link to={`/profile/${user.id}`} className="user-profile-mini">
                            <img 
                                src={getProfilePicture()}
                                alt="Profile" 
                                className="profile-picture-mini"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultProfilePic;
                                }}
                            />
                            <span className="username-mini">
                                {user.username || user.email.split('@')[0]}
                            </span>
                        </Link>
                        <button onClick={handleLogout} className="logout-button">
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;