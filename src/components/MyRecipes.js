import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserRecipes, deleteRecipe } from '../api';
import './MyRecipes.css';

function MyRecipes({ user }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                setError(null);
                const userRecipes = await getUserRecipes(user.id);
                setRecipes(userRecipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setError('Failed to load recipes');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchRecipes();
        }
    }, [user]);

    const handleDeleteRecipe = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await deleteRecipe(recipeId);
                setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
            } catch (error) {
                console.error('Error deleting recipe:', error);
                alert('Failed to delete recipe');
            }
        }
    };

    if (!user) return <div className="my-recipes-error">Please log in to view your recipes</div>;
    if (loading) return <div className="my-recipes-loading">Loading...</div>;
    if (error) return <div className="my-recipes-error">{error}</div>;

    return (
        <div className="my-recipes-container">
            <div className="my-recipes-header">
                <h1>My Recipes</h1>
                <Link to="/addRecipe" className="add-recipe-button">
                    <i className="fas fa-plus"></i>
                    Add New Recipe
                </Link>
            </div>

            {recipes.length === 0 ? (
                <div className="no-recipes">
                    <p>You haven't added any recipes yet.</p>
                    <Link to="/addRecipe" className="start-cooking-button">
                        Start Cooking!
                    </Link>
                </div>
            ) : (
                <div className="recipes-grid">
                    {recipes.map(recipe => (
                        <div key={recipe.id} className="recipe-card">
                            <img 
                                src={recipe.image || 'default-recipe-image.jpg'} 
                                alt={recipe.title}
                                className="recipe-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'default-recipe-image.jpg';
                                }}
                            />
                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p className="recipe-description">{recipe.description}</p>
                                <div className="recipe-meta">
                                    <span><i className="fas fa-clock"></i> {recipe.cookTime}</span>
                                    <span><i className="fas fa-user-friends"></i> {recipe.servings}</span>
                                </div>
                                <div className="recipe-actions">
                                    <Link to={`/recipe/${recipe.id}`} className="view-recipe">
                                        View Recipe
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteRecipe(recipe.id)}
                                        className="delete-recipe"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRecipes; 