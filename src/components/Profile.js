import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api'; // Adjust the import according to your API structure
import './Profile.css'; // Import the CSS file

function Profile() {
    const { id } = useParams(); // Get the user ID from the URL parameters
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit profile modal visibility
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false); // State for credentials modal visibility
    const [editData, setEditData] = useState({
        name: '',
        surname: '',
        email: '',
        username: '',
        profilePicture: '',
    });
    const [credentialsData, setCredentialsData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserById(id); // Fetch user data by ID
                setUser(userData); // Set the user state with the fetched data
                setEditData({
                    name: userData.name,
                    surname: userData.surname,
                    email: userData.email,
                    username: userData.username,
                    profilePicture: userData.profilePicture, // Populate with existing profile picture
                });
                setCredentialsData({
                    email: userData.email,
                    password: '', // Leave password blank initially
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUser();
    }, [id]);

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleCredentialsClick = () => {
        setIsCredentialsModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleCloseCredentialsModal = () => {
        setIsCredentialsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCredentialsChange = (e) => {
        const { name, value } = e.target;
        setCredentialsData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditData((prevState) => ({
                ...prevState,
                profilePicture: reader.result,
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateUser(id, editData); // Update the user data using the API
            setUser(editData); // Update the local state with the new data
            alert('Profile updated successfully!');
            handleCloseEditModal(); // Close the modal
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleUpdateCredentials = async (e) => {
        e.preventDefault();
        try {
            await updateUser(id, credentialsData); // Update the email and password using the API
            setUser({ ...user, email: credentialsData.email }); // Update the email in the local state
            alert('Credentials updated successfully!');
            handleCloseCredentialsModal(); // Close the modal
        } catch (error) {
            console.error('Error updating credentials:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching
    }

    if (!user) {
        return <div>No user found.</div>; // Show message if no user data is found
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>{user.name} {user.surname}'s Profile</h2>
                <img src={user.profilePicture} alt="Profile" className="profile-picture" />
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Surname:</strong> {user.surname}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={handleEditClick}>Edit Profile</button>
                <button onClick={handleCredentialsClick}>Update Credentials</button>
            </div>

            {/* Modal for updating profile */}
            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Profile</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Surname:
                                <input
                                    type="text"
                                    name="surname"
                                    value={editData.surname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Username:
                                <input
                                    type="text"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Profile Picture:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {editData.profilePicture && (
                                    <img
                                        src={editData.profilePicture}
                                        alt="Profile Preview"
                                        className="profile-picture-preview"
                                    />
                                )}
                            </label>
                            <button type="submit">Update Profile</button>
                            <button type="button" onClick={handleCloseEditModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for updating credentials */}
            {isCredentialsModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Credentials</h2>
                        <form onSubmit={handleUpdateCredentials}>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={credentialsData.email}
                                    onChange={handleCredentialsChange}
                                    required
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    name="password"
                                    value={credentialsData.password}
                                    onChange={handleCredentialsChange}
                                    placeholder="Enter new password"
                                />
                            </label>
                            <button type="submit">Update Credentials</button>
                            <button type="button" onClick={handleCloseCredentialsModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
