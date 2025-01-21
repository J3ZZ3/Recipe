import React, { useState, useEffect } from 'react';
import { 
    getRecipes, 
    deleteRecipe, 
    searchMealDBRecipes, 
    getRandomMealDBRecipes,
    getMealCategories,
    getMealAreas,
    getRecipesByCategory,
    getRecipesByArea
} from '../api';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Home.css'; // Import the CSS for styling

function Home({ user }) {
    const [recipes, setRecipes] = useState([]);
    const [mealDBRecipes, setMealDBRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch categories and areas
                const [categoriesData, areasData] = await Promise.all([
                    getMealCategories(),
                    getMealAreas()
                ]);
                
                setCategories(categoriesData);
                setAreas(areasData);

                // Fetch random recipes initially
                const randomRecipes = await getRandomMealDBRecipes(6);
                setMealDBRecipes(randomRecipes);

                // Fetch user's recipes if logged in
                if (user) {
                    const userRecipes = await getRecipes();
                    setRecipes(userRecipes || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load recipes. Please try again later.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load recipes. Please try again later.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);

        if (searchValue.trim()) {
            try {
                const results = await searchMealDBRecipes(searchValue);
                setMealDBRecipes(results);
            } catch (error) {
                console.error('Search error:', error);
            }
        } else {
            // If search is empty, fetch random recipes again
            const randomRecipes = await getRandomMealDBRecipes(6);
            setMealDBRecipes(randomRecipes);
        }
    };

    const handleCategoryChange = async (category) => {
        try {
            setLoading(true);
            setSelectedCategory(category);
            setSelectedArea(''); // Reset area when category changes
            
            if (category) {
                const recipes = await getRecipesByCategory(category);
                setMealDBRecipes(recipes);
            } else {
                const randomRecipes = await getRandomMealDBRecipes(6);
                setMealDBRecipes(randomRecipes);
            }
        } catch (error) {
            console.error('Error fetching category recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAreaChange = async (area) => {
        try {
            setLoading(true);
            setSelectedArea(area);
            setSelectedCategory(''); // Reset category when area changes
            
            if (area) {
                const recipes = await getRecipesByArea(area);
                setMealDBRecipes(recipes);
            } else {
                const randomRecipes = await getRandomMealDBRecipes(6);
                setMealDBRecipes(randomRecipes);
            }
        } catch (error) {
            console.error('Error fetching area recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewRecipe = (recipe) => {
        if (recipe.idMeal) {
            // MealDB recipe
            navigate(`/recipe/mealdb/${recipe.idMeal}`);
        } else {
            // Custom recipe
            navigate(`/recipe/custom/${recipe.id}`);
        }
    };

    const getIngredientsList = (recipe) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        return ingredients.join('<br>');
    };

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteRecipe(recipeId);
                    const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
                    setRecipes(updatedRecipes);
                    
                    Swal.fire(
                        'Deleted!',
                        'Your recipe has been deleted.',
                        'success'
                    );
                }
            });
        } catch (error) {
            console.error('Error deleting recipe:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete recipe. Please try again.'
            });
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-container">
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search for recipes..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e)}
                    className="search-input"
                />
                
                <select 
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.strCategory} value={category.strCategory}>
                            {category.strCategory}
                        </option>
                    ))}
                </select>

                <select 
                    value={selectedArea}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Cuisines</option>
                    {areas.map(area => (
                        <option key={area.strArea} value={area.strArea}>
                            {area.strArea}
                        </option>
                    ))}
                </select>
            </div>

            <section className="recipes-section">
                <h2>Discover Recipes</h2>
                <div className="recipe-grid">
                    {mealDBRecipes?.map(recipe => (
                        <div className="recipe-card" key={recipe.idMeal}>
                            <img 
                                src={recipe.strMealThumb} 
                                alt={recipe.strMeal} 
                                className="recipe-image"
                            />
                            <h3>{recipe.strMeal}</h3>
                            <p className="recipe-category">
                                {recipe.strCategory || selectedCategory}
                            </p>
                            {recipe.strArea && (
                                <p className="recipe-area">{recipe.strArea}</p>
                            )}
                            <button onClick={() => handleViewRecipe(recipe)}>
                                View Recipe
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {user && recipes.length > 0 && (
                <section className="recipes-section">
                    <h2>Your Recipes</h2>
                    <div className="recipe-grid">
                        {recipes.map(recipe => (
                            <div className="recipe-card" key={recipe.id}>
                                <h3>{recipe.name}</h3>
                                {recipe.image && (
                                    <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                                )}
                                <button onClick={() => handleViewRecipe(recipe)}>
                                    View Recipe
                                </button>
                                <Link to={`/editRecipe/${recipe.id}`} className="edit-button">
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDeleteRecipe(recipe.id)} 
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

          
            
            {user && (
                <Link to="/addRecipe" className="fab-button" title="Add New Recipe">
                    <i className="fas fa-plus"></i>
                </Link>
            )}
        </div>
    );
}

export default Home;
