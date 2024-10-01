import React, { useState } from 'react';
import { createRecipe } from '../api';
import { useNavigate } from 'react-router-dom';
import './AddRecipe.css'; // Import the CSS for styling

function AddRecipe() {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [category, setCategory] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipe = { name, ingredients, instructions, category, prepTime, cookTime, servings };
        try {
            await createRecipe(recipe);
            navigate('/home'); // Redirect to home after adding a recipe
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    return (
        <div className="container">
            <h2>Add New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Recipe Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Ingredients (comma-separated)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category (e.g., Dessert, Main Course)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Preparation Time"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Cooking Time"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Servings"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    required
                />
                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
}

export default AddRecipe;
