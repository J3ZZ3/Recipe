FUNCTION App:
    // State Management
    INITIALIZE state for recipes (array), searchTerm (string), 
    filteredRecipes (array), selectedRecipe (object), isModalOpen (boolean)

    // Fetch data when the component mounts
    USE EFFECT:
        CALL fetchData() to load initial recipes from the API

    FUNCTION fetchData:
        // Asynchronously fetch the recipe data from the API
        SET recipes to GET recipes from API
        SET filteredRecipes to recipes // Initially, all recipes are shown

    FUNCTION handleSearch(input):
        // This function will filter recipes based on the user's search input
        SET searchTerm to input // Update the search term state
        FILTER recipes by checking if recipe.name or recipe.category includes searchTerm
        SET filteredRecipes to the filtered result // Update the displayed recipes

    FUNCTION handleViewRecipe(recipe):
        // This function is called when the user wants to view a full recipe
        SET selectedRecipe to recipe // Store the selected recipe in state
        SET isModalOpen to TRUE // Open the modal for viewing

    FUNCTION handleCloseModal:
        // This function is called to close the recipe modal
        SET isModalOpen to FALSE // Close the modal
        SET selectedRecipe to NULL // Reset selected recipe for future use

    // Rendering the main UI
    RENDER:
        DISPLAY Navbar component
        DISPLAY search input field, which calls handleSearch on change

        IF filteredRecipes has items THEN
            FOR EACH recipe in filteredRecipes:
                CALL RecipeCard component with recipe data and handlers
        ELSE
            DISPLAY "No recipes found." // Message when no recipes match search

        IF isModalOpen THEN
            CALL Modal component with selectedRecipe details and a close button

FUNCTION Navbar:
    // Renders the navigation bar with links and a logout button
    RENDER:
        DISPLAY a list of links for Home, Profile, and Add Recipe
        IF user is logged in THEN
            DISPLAY Logout button
            ADD onClick handler for Logout button to call onLogout function

FUNCTION RecipeCard:
    // Renders the individual recipe card
    INPUT parameters: recipe (object), handleViewRecipe (function), deleteRecipe (function)

    RENDER:
        DISPLAY recipe name as heading
        DISPLAY recipe image
        DISPLAY "View Full Recipe" button
            ADD onClick handler to call handleViewRecipe with the current recipe
        DISPLAY Edit link pointing to editRecipe route with recipe ID
        DISPLAY Delete button
            ADD onClick handler to call deleteRecipe with the current recipe ID

FUNCTION Modal:
    INPUT parameters: selectedRecipe (object), handleCloseModal (function)

    IF selectedRecipe is not NULL THEN
        RENDER:
            DISPLAY selectedRecipe name as heading
            DISPLAY selectedRecipe image
            DISPLAY recipe ingredients as a list
            DISPLAY recipe instructions
            DISPLAY recipe category, preparation time, cooking time, and servings
            DISPLAY Close button
                ADD onClick handler to call handleCloseModal