import React, { useState, useEffect } from 'react';
import { getRecipes, deleteRecipe } from '../api';

function Home({ setView, user }) {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        async function fetchRecipes() {
            const data = await getRecipes();
            setRecipes(data);
        }
        fetchRecipes();
    }, []);

    const handleDelete = async (id) => {
        await deleteRecipe(id);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
    };

    return (
        <div>
            <h2>Recipes</h2>
            <button onClick={() => setView('addRecipe')}>Add Recipe</button>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        {recipe.name} - {recipe.description}
                        <button onClick={() => setView(`editRecipe/${recipe.id}`)}>Edit</button>
                        <button onClick={() => handleDelete(recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setView('profile')}>Profile</button>
        </div>
    );
}

export default Home;
