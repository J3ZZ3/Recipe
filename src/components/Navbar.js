import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS for styling

function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to={`/profile/${user.id}`}>Profile</Link>
                </li>
                <li>
                    <Link to="/addRecipe">+Recipe</Link>
                </li>
            </ul>
            {user && (
                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navbar;
