import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api'; // Adjust the import according to your API structure
import './Profile.css'; // Import the CSS file

function Profile({ user: currentUser, onProfileUpdate }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit profile modal visibility
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false); // State for credentials modal visibility
    const [editData, setEditData] = useState({
        name: '',
        surname: '',
        username: '',
        profile_picture: '',
    });
    const [credentialsData, setCredentialsData] = useState({
        email: '',
        password: '',
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // If the profile being viewed is the current user's profile
                if (currentUser && currentUser.id === id) {
                    setUser(currentUser);
                    setEditData({
                        name: currentUser.name || '',
                        surname: currentUser.surname || '',
                        username: currentUser.username || '',
                        profile_picture: currentUser.profile_picture || '',
                    });
                } else {
                    const userData = await getUserById(id);
                    if (userData) {
                        setUser(userData);
                        setEditData({
                            name: userData.name || '',
                            surname: userData.surname || '',
                            username: userData.username || '',
                            profile_picture: userData.profile_picture || '',
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, currentUser]);

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
        setEditData(prev => ({
            ...prev,
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
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setEditData(prev => ({
                    ...prev,
                    profile_picture: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            if (editData.profile_picture && !editData.profile_picture.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
                alert('Please enter a valid image URL (must end with .jpg, .jpeg, .png, .gif, or .webp)');
                return;
            }

            const updatedUser = await updateUser(id, editData);
            if (updatedUser) {
                setUser(updatedUser);
                setIsEditModalOpen(false);
                if (onProfileUpdate && currentUser.id === id) {
                    onProfileUpdate(updatedUser);
                }
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
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

    if (loading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;
    if (!user) return <div className="profile-error">User not found</div>;

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <img 
                        src={user.profile_picture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt="Profile" 
                        className="profile-picture"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                        }}
                    />
                    <h1>{user.name} {user.surname}</h1>
                    <p className="username">@{user.username}</p>
                </div>

                <div className="profile-info">
                    <div className="info-group">
                        <label>Name</label>
                        <p>{user.name}</p>
                    </div>
                    <div className="info-group">
                        <label>Surname</label>
                        <p>{user.surname}</p>
                    </div>
                    <div className="info-group">
                        <label>Username</label>
                        <p>{user.username}</p>
                    </div>
                    <div className="info-group">
                        <label>Email</label>
                        <p>{user.email}</p>
                    </div>
                </div>

                {currentUser && currentUser.id === id && (
                    <button 
                        className="edit-profile-button"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Surname</label>
                                <input
                                    type="text"
                                    name="surname"
                                    value={editData.surname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Profile Picture URL</label>
                                <input
                                    type="url"
                                    name="profile_picture"
                                    value={editData.profile_picture}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <small className="input-help">Enter a valid image URL (ending in .jpg, .jpeg, .png, .gif, or .webp)</small>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">Save Changes</button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
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
