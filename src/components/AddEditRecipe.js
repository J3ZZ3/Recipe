import React, { useState, useEffect } from 'react';
import { createRecipe, updateRecipe, getRecipeById } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './AddEditRecipe.css'; // Import the CSS for styling

function AddEditRecipe({ user }) {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [category, setCategory] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [image, setImage] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchRecipe = async () => {
                try {
                    const recipe = await getRecipeById(id);
                    setName(recipe.name);
                    setIngredients(recipe.ingredients);
                    setInstructions(recipe.instructions);
                    setCategory(recipe.category);
                    setPrepTime(recipe.prepTime);
                    setCookTime(recipe.cookTime);
                    setServings(recipe.servings);
                    setImage(recipe.image || '');
                } catch (error) {
                    console.error('Error fetching recipe:', error);
                }
            };
            fetchRecipe();
        }
    }, [id]);

    const generatePDF = (recipeData) => {
        const pdf = new jsPDF();
        const margin = 20;
        let yPosition = margin;
        const lineHeight = 10;
        const pageWidth = pdf.internal.pageSize.width;

        // Title
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(recipeData.name, margin, yPosition);
        yPosition += lineHeight * 2;

        // Category
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Category: ${recipeData.category}`, margin, yPosition);
        yPosition += lineHeight;

        // Time and Servings
        pdf.text(`Preparation Time: ${recipeData.prepTime}`, margin, yPosition);
        yPosition += lineHeight;
        pdf.text(`Cooking Time: ${recipeData.cookTime}`, margin, yPosition);
        yPosition += lineHeight;
        pdf.text(`Servings: ${recipeData.servings}`, margin, yPosition);
        yPosition += lineHeight * 2;

        // Ingredients
        pdf.setFont('helvetica', 'bold');
        pdf.text('Ingredients:', margin, yPosition);
        yPosition += lineHeight;
        pdf.setFont('helvetica', 'normal');
        const ingredientsList = recipeData.ingredients.split('\n');
        ingredientsList.forEach(ingredient => {
            if (yPosition > pdf.internal.pageSize.height - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(`• ${ingredient.trim()}`, margin + 5, yPosition);
            yPosition += lineHeight;
        });
        yPosition += lineHeight;

        // Instructions
        pdf.setFont('helvetica', 'bold');
        pdf.text('Instructions:', margin, yPosition);
        yPosition += lineHeight;
        pdf.setFont('helvetica', 'normal');
        
        const splitInstructions = pdf.splitTextToSize(
            recipeData.instructions, 
            pageWidth - (margin * 2)
        );
        
        splitInstructions.forEach(line => {
            if (yPosition > pdf.internal.pageSize.height - margin) {
                pdf.addPage();
                yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
        });

        // Add image if available
        if (recipeData.image) {
            try {
                pdf.addPage();
                pdf.text('Recipe Image:', margin, margin);
                pdf.addImage(
                    recipeData.image,
                    'JPEG',
                    margin,
                    margin + 10,
                    pageWidth - (margin * 2),
                    100
                );
            } catch (error) {
                console.error('Error adding image to PDF:', error);
            }
        }

        // Save the PDF
        pdf.save(`${recipeData.name.replace(/\s+/g, '_')}_recipe.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipeData = {
            name,
            ingredients,
            instructions,
            category,
            prepTime,
            cookTime,
            servings,
            image,
            userId: user?.id,
        };

        try {
            if (isEdit) {
                await updateRecipe(id, recipeData);
            } else {
                await createRecipe(recipeData);
            }
            setCurrentRecipe(recipeData);
            setShowDownloadButton(true);
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Failed to save recipe. Please try again.');
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
            <h2>{isEdit ? 'Edit Recipe' : 'Add New Recipe'}</h2>
            <div className="form-recipe-container">
                <form className="recipe-form" onSubmit={handleSubmit}>
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
                    <div className="button-container">
                        <button type="submit" className="submit-button">
                            {isEdit ? 'Update Recipe' : 'Add Recipe'}
                        </button>
                        {showDownloadButton && (
                            <button
                                type="button"
                                className="download-pdf-button"
                                onClick={() => generatePDF(currentRecipe)}
                            >
                                Download Recipe PDF
                            </button>
                        )}
                    </div>
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
