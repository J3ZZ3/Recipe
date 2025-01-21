import axios from 'axios';
import { supabase } from './supabaseClient';

const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1';

// Auth APIs
export const registerUser = async (email, password) => {
    const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });
    
    if (signUpError) throw signUpError;
    return data;
};

export const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Add session listener
export const onAuthStateChange = (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
    return subscription;
};

// User Profile APIs
export const getUserById = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) {
            console.error('Error details:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
    }
};

export const updateUser = async (userId, updates) => {
    try {
        // Add updated_at timestamp
        const updatedData = {
            ...updates,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('profiles')
            .update(updatedData)
            .eq('id', userId)
            .select();
            
        if (error) {
            console.error('Update error details:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
    }
};

// Recipe APIs from MealDB
export const getRandomRecipes = async () => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        return response.data.meals;
    } catch (error) {
        throw error;
    }
};

export const searchRecipes = async (query) => {
    const response = await axios.get(`${MEALDB_API_URL}/search.php?s=${query}`);
    return response.data.meals || [];
};

export const getRecipeById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching recipe by id:', error);
        throw error;
    }
};

export const getRecipesByCategory = async (category) => {
    try {
        const response = await axios.get(`${MEALDB_API_URL}/filter.php?c=${category}`);
        return response.data.meals || [];
    } catch (error) {
        console.error('Error fetching recipes by category:', error);
        return [];
    }
};

export const getRecipesByArea = async (area) => {
    try {
        const response = await axios.get(`${MEALDB_API_URL}/filter.php?a=${area}`);
        return response.data.meals || [];
    } catch (error) {
        console.error('Error fetching recipes by area:', error);
        return [];
    }
};

// User's Custom Recipes (stored in Supabase)
export const getRecipes = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('user_id', user.id);
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error in getRecipes:', error);
        return [];
    }
};

export const createRecipe = async (recipeData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('recipes')
        .insert([{ ...recipeData, user_id: user.id }]);
    if (error) throw error;
    return data;
};

export const updateRecipe = async (recipeId, updates) => {
    const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', recipeId);
    if (error) throw error;
    return data;
};

export const deleteRecipe = async (recipeId) => {
    try {
        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', recipeId);
            
        if (error) throw error;
    } catch (error) {
        console.error('Error in deleteRecipe:', error);
        throw error;
    }
};

// Saved Recipes (from MealDB)
export const saveRecipe = async (recipeData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('saved_recipes')
        .insert([{ ...recipeData, user_id: user.id }]);
    if (error) throw error;
    return data;
};

export const getSavedRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id);
    if (error) throw error;
    return data;
};

export const removeSavedRecipe = async (recipeId) => {
    const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);
    if (error) throw error;
};

export const resendConfirmation = async (email) => {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
    });
    if (error) throw error;
};

export const searchMealDBRecipes = async (searchTerm) => {
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        return response.data.meals || [];
    } catch (error) {
        console.error('Error in searchMealDBRecipes:', error);
        return [];
    }
};

export const getRandomMealDBRecipes = async (count = 6) => {
    try {
        const recipes = [];
        for (let i = 0; i < count; i++) {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
            if (response.data.meals && response.data.meals[0]) {
                recipes.push(response.data.meals[0]);
            }
        }
        return recipes;
    } catch (error) {
        console.error('Error in getRandomMealDBRecipes:', error);
        return [];
    }
};

// Add these new MealDB API functions
export const getMealCategories = async () => {
    try {
        const response = await axios.get(`${MEALDB_API_URL}/categories.php`);
        return response.data.categories || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const getMealAreas = async () => {
    try {
        const response = await axios.get(`${MEALDB_API_URL}/list.php?a=list`);
        return response.data.meals || [];
    } catch (error) {
        console.error('Error fetching areas:', error);
        return [];
    }
};

// Add this new function to your api.js
export const getMealById = async (id) => {
    try {
        const response = await axios.get(`${MEALDB_API_URL}/lookup.php?i=${id}`);
        return response.data.meals ? response.data.meals[0] : null;
    } catch (error) {
        console.error('Error fetching meal by id:', error);
        throw error;
    }
};