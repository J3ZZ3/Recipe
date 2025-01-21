import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMealById, getRecipeById } from '../api';
import jsPDF from 'jspdf';
import './ViewRecipe.css';

function ViewRecipe() {
    const { id, type } = useParams(); // type will be either 'mealdb' or 'custom'
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                let recipeData;
                
                if (type === 'mealdb') {
                    recipeData = await getMealById(id);
                    if (recipeData) {
                        // Format MealDB recipe data
                        const ingredients = [];
                        for (let i = 1; i <= 20; i++) {
                            const ingredient = recipeData[`strIngredient${i}`];
                            const measure = recipeData[`strMeasure${i}`];
                            if (ingredient && ingredient.trim()) {
                                ingredients.push(`${measure} ${ingredient}`.trim());
                            }
                        }
                        recipeData.ingredients = ingredients;
                    }
                } else {
                    recipeData = await getRecipeById(id);
                }

                if (recipeData) {
                    setRecipe(recipeData);
                } else {
                    setError('Recipe not found');
                }
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError('Failed to load recipe');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, type]);

    const handleDownloadPDF = () => {
        if (!recipe) return;

        const recipeData = {
            name: type === 'mealdb' ? recipe.strMeal : recipe.name,
            category: type === 'mealdb' ? recipe.strCategory : recipe.category,
            prepTime: type === 'mealdb' ? 'N/A' : recipe.prepTime,
            cookTime: type === 'mealdb' ? 'N/A' : recipe.cookTime,
            servings: type === 'mealdb' ? recipe.strYield : recipe.servings,
            ingredients: type === 'mealdb' 
                ? recipe.ingredients.join('\n')
                : recipe.ingredients,
            instructions: type === 'mealdb' 
                ? recipe.strInstructions 
                : recipe.instructions,
            image: type === 'mealdb' ? recipe.strMealThumb : recipe.image
        };

        const pdf = new jsPDF();
        // ... (same PDF generation code as in AddEditRecipe) ...
        pdf.save(`${recipeData.name.replace(/\s+/g, '_')}_recipe.pdf`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    return (
        <div className="recipe-view-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>

            <div className="recipe-header">
                <h1>{type === 'mealdb' ? recipe.strMeal : recipe.name}</h1>
                {type === 'mealdb' && (
                    <div className="recipe-meta">
                        <span className="category">{recipe.strCategory}</span>
                        <span className="area">{recipe.strArea}</span>
                    </div>
                )}
            </div>

            <div className="recipe-content">
                <div className="recipe-image-container">
                    <img 
                        src={type === 'mealdb' ? recipe.strMealThumb : recipe.image} 
                        alt={type === 'mealdb' ? recipe.strMeal : recipe.name}
                        className="recipe-image"
                    />
                </div>

                <div className="recipe-details">
                    <section className="ingredients-section">
                        <h2>Ingredients</h2>
                        <ul className="ingredients-list">
                            {type === 'mealdb' 
                                ? recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))
                                : recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))
                            }
                        </ul>
                    </section>

                    <section className="instructions-section">
                        <h2>Instructions</h2>
                        {type === 'mealdb' ? (
                            recipe.strInstructions.split('\n').map((step, index) => (
                                step.trim() && <p key={index}>{step}</p>
                            ))
                        ) : (
                            <p>{recipe.instructions}</p>
                        )}
                    </section>

                    {recipe.strYoutube && (
                        <section className="video-section">
                            <h2>Video Tutorial</h2>
                            <a 
                                href={recipe.strYoutube} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="video-link"
                            >
                                Watch on YouTube
                            </a>
                        </section>
                    )}
                </div>
            </div>

            <button onClick={handleDownloadPDF} className="download-pdf-button">
                Download Recipe PDF
            </button>
        </div>
    );
}

export default ViewRecipe; 