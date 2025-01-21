const API_BASE_URL = 'http://localhost:3001';

// User-related API functions
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users?email=${credentials.email}`);
        if (!response.ok) throw new Error('Failed to login');
        const users = await response.json();
        
        const user = users[0];
        if (user && user.password === credentials.password) {
            return user;
        }
        throw new Error('Invalid credentials');
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        // Check if email already exists
        const checkEmail = await fetch(`${API_BASE_URL}/users?email=${userData.email}`);
        const existingUsers = await checkEmail.json();
        
        if (existingUsers.length > 0) {
            throw new Error('Email already exists');
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...userData,
                createdAt: new Date().toISOString(),
            }),
        });

        if (!response.ok) throw new Error('Failed to register');
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Recipe-related API functions
export const getUserRecipes = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        throw error;
    }
};

export const createRecipe = async (recipeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...recipeData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create recipe');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};

export const deleteRecipe = async (recipeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete recipe');
        return true;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};

export const getAllRecipes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const getRecipeById = async (recipeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch recipe');
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

export const updateRecipe = async (recipeId, recipeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...recipeData,
                updatedAt: new Date().toISOString(),
            }),
        });
        if (!response.ok) throw new Error('Failed to update recipe');
        return await response.json();
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
}; 