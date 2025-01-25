# Recipe Management Application Documentation


## Project Overview


A full-stack web application for managing and discovering recipes, built with React and Supabase. Users can create, store, search, and share recipes, as well as discover recipes from external sources.


## Technical Stack

Frontend: React.js
Backend: Supabase
External API: MealDB API
Authentication: Supabase Auth
Storage: Supabase Storage
PDF Generation: jsPDF


## Core Features



1. User Authentication


   - Registration
   - Login/Logout
   - Password Reset
   - Email Verification

2. Recipe Management

   - Create custom recipes
   - Edit existing recipes
   - Delete recipes
   - View recipe details
   - Download recipes as PDF


3. Recipe Discovery


   - Search recipes
   - View recipe details
   - Download recipes as PDF


4. User Profile


   - View/Edit profile information
   
   - Manage personal recipes
   
   - Upload profile picture

## Key Components

### 1. App.js
- Main application component
- Handles routing
- Manages authentication state
- Provides theme context

### 2. api.js
- Contains all API calls
- Handles Supabase interactions
- Manages MealDB API requests

### 3. Components
- AddEditRecipe: Recipe creation/editing
- Home: Main dashboard
- Login/Register: Authentication forms
- Profile: User profile management
- ViewRecipe: Recipe detail view
- Navbar: Navigation component

## API Integration

### Supabase
```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
- Authentication
- User data storage
- Recipe storage
- File storage

### MealDB API
```javascript
const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1'
```
- Recipe search
- Category filtering
- Random recipes

## Authentication Flow
1. User registration
2. Email verification
3. Login
4. Session management
5. Protected routes

## Data Models

### User
```javascript
{
  id: string,
  email: string,
  name: string,
  profile_picture: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Recipe
```javascript
{
  id: string,
  user_id: string,
  name: string,
  ingredients: string,
  instructions: string,
  category: string,
  image: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

## Styling
- CSS Modules for component-specific styles
- Responsive design
- Dark/Light theme support
- Mobile-first approach

## Error Handling
- Form validation
- API error handling
- User feedback
- Loading states

## Future Enhancements
1. Recipe sharing
2. Social features
3. Recipe ratings
4. Shopping list
5. Meal planning

## Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm start`

## Environment Variables
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run the project
```bash
npm run dev
```


