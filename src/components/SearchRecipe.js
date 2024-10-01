import React, { useState, useEffect } from 'react';
import { searchRecipes } from '../api';

function SearchRecipes() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [recipes, setRecipes] = useState([]);

    const handleSearch = async () => {
        const data = await searchRecipes(query, category);
        setRecipes(data);
    };

    return (
        <div>
            <input type="text" placeholder="Search by name" value={query} onChange={(e) => setQuery(e.target.value)} />
            <input type="text" placeholder="Search by category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default SearchRecipes;
