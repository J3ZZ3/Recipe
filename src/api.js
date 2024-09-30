import axios from 'axios';

const API_URL = 'http://localhost:5000';

// User APIs
export const registerUser = async (user) => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await axios.get(`${API_URL}/users?email=${email}&password=${password}`);
    return response.data.length > 0 ? response.data[0] : null;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    if (!response.status === 200) {
        throw new Error('Failed to fetch user data');
    }
    return response.data; // Return the JSON data
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
};

// Recipe APIs
export const getRecipes = async () => {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
};

export const getRecipeById = async (id) => {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return response.data;
};

export const createRecipe = async (recipe) => {
    const response = await axios.post(`${API_URL}/recipes`, recipe);
    return response.data;
};

export const updateRecipe = async (id, recipeData) => {
    const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData);
    return response.data;
};

export const deleteRecipe = async (id) => {
    await axios.delete(`${API_URL}/recipes/${id}`);
};
