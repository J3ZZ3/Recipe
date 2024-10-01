import React, { useState, useEffect } from 'react';
import { createRecipe, updateRecipe, getRecipeById } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import './AddEditRecipe.css'; // Import the CSS for styling

function AddEditRecipe() {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [category, setCategory] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [image, setImage] = useState(null); // State for the uploaded image
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchRecipe = async () => {
                const recipe = await getRecipeById(id);
                setName(recipe.name);
                setIngredients(recipe.ingredients);
                setInstructions(recipe.instructions);
                setCategory(recipe.category);
                setPrepTime(recipe.prepTime);
                setCookTime(recipe.cookTime);
                setServings(recipe.servings);
                setImage(recipe.image); // Set the image if editing
                setIsEdit(true);
            };
            fetchRecipe();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipe = { name, ingredients, instructions, category, prepTime, cookTime, servings, image };
        try {
            if (isEdit) {
                await updateRecipe(id, recipe);
            } else {
                await createRecipe(recipe);
            }
            navigate('/home');
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // Store the base64 image
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container">
            <h2>{isEdit ? 'Edit Recipe' : 'Add Recipe'}</h2>
            <div className="form-recipe-container">
                <form onSubmit={handleSubmit} className="recipe-form">
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
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <button type="submit">{isEdit ? 'Update Recipe' : 'Add Recipe'}</button>
                </form>

                {/* Render the recipe as a card */}
                {image && (
                    <div className="recipe-card">
                        <h3>{name}</h3>
                        <img src={image} alt={name} className="recipe-image" />
                        <p><strong>Ingredients:</strong> {ingredients}</p>
                        <p><strong>Instructions:</strong> {instructions}</p>
                        <p><strong>Category:</strong> {category}</p>
                        <p><strong>Preparation Time:</strong> {prepTime}</p>
                        <p><strong>Cooking Time:</strong> {cookTime}</p>
                        <p><strong>Servings:</strong> {servings}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddEditRecipe;
