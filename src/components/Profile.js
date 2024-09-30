import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../api'; // Adjust the import according to your API structure

function Profile() {
    const { id } = useParams(); // Get the user ID from the URL parameters
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserById(id); // Fetch user data by ID
                setUser(userData); // Set the user state with the fetched data
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching
    }

    if (!user) {
        return <div>No user found.</div>; // Show message if no user data is found
    }

    return (
        <div>
            <h2>User Profile</h2>
            <p><strong>Name:</strong> {user.name}</p> {/* Display user name */}
            <p><strong>Email:</strong> {user.email}</p> {/* Display user email */}
            <p><strong>Bio:</strong> {user.bio}</p> {/* Display user bio */}
            {/* Add more fields as necessary */}
        </div>
    );
}

export default Profile;
