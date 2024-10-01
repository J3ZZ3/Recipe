import React, { useState, useEffect } from 'react';
import { getRecipes, deleteRecipe } from '../api';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS for styling

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
    const [selectedRecipe, setSelectedRecipe] = useState(null); // State for the selected recipe
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRecipes();
            setRecipes(data);
            setFilteredRecipes(data); // Initially, all recipes are shown
        };
        fetchData();
    }, []);

    // Function to handle search input change
    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchValue) ||
            recipe.category.toLowerCase().includes(searchValue) // Search by name or category
        );
        setFilteredRecipes(filtered); // Update filtered recipes
    };

    // Function to handle viewing the full recipe
    const handleViewRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedRecipe(null); // Reset selected recipe
    };

    return (
        <div>
            <h2>All Recipes</h2>

            {/* Search Input */}
            <center><input
                type="text"
                placeholder="Search for a recipe..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            /></center>

            {/* Recipe Grid */}
            <div className="recipe-grid">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map(recipe => (
                        <div className="recipe-card" key={recipe.id}>
                            <h3>{recipe.name}</h3>
                            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                            <button onClick={() => handleViewRecipe(recipe)}>View Full Recipe</button> {/* New button */}
                            <Link to={`/editRecipe/${recipe.id}`}>Edit</Link>
                            <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No recipes found.</p> // Display message when no recipes match the search term
                )}
            </div>

            {/* Modal for viewing full recipe */}
            {isModalOpen && selectedRecipe && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedRecipe.name}</h2>
                        <img src={selectedRecipe.image} alt={selectedRecipe.name} className="recipe-image" />
                        <p><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(', ')}</p>
                        <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
                        <p><strong>Category:</strong> {selectedRecipe.category}</p>
                        <p><strong>Preparation Time:</strong> {selectedRecipe.prepTime}</p>
                        <p><strong>Cooking Time:</strong> {selectedRecipe.cookTime}</p>
                        <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
