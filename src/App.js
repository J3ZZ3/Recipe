import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import AddEditRecipe from './components/AddEditRecipe';
import Profile from './components/Profile';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        setUser(null); // Clear the user state
    };

    return (
        <Router>
            <div className="App">
                {user && <Navbar user={user} onLogout={handleLogout} />} {/* Show navbar only when user is logged in */}
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
                    <Route path="/profile/:id" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
                    <Route path="/addRecipe" element={user ? <AddEditRecipe /> : <Navigate to="/login" />} />
                    <Route path="/editRecipe/:id" element={user ? <AddEditRecipe /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
