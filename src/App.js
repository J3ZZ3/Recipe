import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentSession, onAuthStateChange } from './api';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Register';
import AddEditRecipe from './components/AddEditRecipe';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import ViewRecipe from './components/ViewRecipe';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const checkSession = async () => {
            try {
                const currentSession = await getCurrentSession();
                setSession(currentSession);
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Subscribe to auth changes
        const subscription = onAuthStateChange((session) => {
            setSession(session);
            setLoading(false);
        });

        // Cleanup subscription
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setSession(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleProfileUpdate = (updatedUser) => {
        if (session) {
            setSession({
                ...session,
                user: {
                    ...session.user,
                    ...updatedUser
                }
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="App">
                {session?.user && <Navbar user={session.user} onLogout={handleLogout} />}
                <Routes>
                    <Route 
                        path="/login" 
                        element={!session ? <Login /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/register" 
                        element={!session ? <Registration /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/" 
                        element={session ? <Home user={session.user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/home" 
                        element={session ? <Home user={session.user} /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/profile/:id" 
                        element={
                            session ? 
                                <Profile 
                                    user={session.user} 
                                    onProfileUpdate={handleProfileUpdate}
                                /> : 
                                <Navigate to="/login" />
                        } 
                    />
                    <Route 
                        path="/addRecipe" 
                        element={session ? 
                            <AddEditRecipe user={session.user} /> : 
                            <Navigate to="/login" />
                        } 
                    />
                    <Route 
                        path="/editRecipe/:id" 
                        element={session ? 
                            <AddEditRecipe user={session.user} /> : 
                            <Navigate to="/login" />
                        } 
                    />
                    <Route 
                        path="/recipe/:type/:id" 
                        element={<ViewRecipe />} 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
