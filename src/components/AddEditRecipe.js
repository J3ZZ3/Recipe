import React, { useState, useEffect } from 'react';
import { createRecipe, updateRecipe, getRecipeById } from '../api';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

function AddEditRecipe() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate(); // Use navigate for redirection

    useEffect(() => {
        if (id) {
            async function fetchRecipe() {
                const recipe = await getRecipeById(id);
                setName(recipe.name);
                setDescription(recipe.description);
                setIsEdit(true);
            }
            fetchRecipe();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipe = { name, description };
        try {
            if (isEdit) {
                await updateRecipe(id, recipe);
            } else {
                await createRecipe(recipe);
            }
            navigate('/home'); // Redirect to home after submit
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Failed to save recipe. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isEdit ? 'Edit Recipe' : 'Add Recipe'}</h2>
            <input
                type="text"
                placeholder="Recipe Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Recipe Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
        </form>
    );
}

export default AddEditRecipe;
