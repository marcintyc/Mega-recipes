const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const recipesContainer = document.getElementById('recipes-container');
const navLinks = document.querySelectorAll('nav .nav-links a');
const popularRecipesContainer = document.querySelector('#popular .popular-recipes');
const listContainer = document.getElementById('list-container');
let searchedRecipes = [];

searchButton.addEventListener('click', fetchRecipes);

async function fetchRecipes() {
    const query = searchInput.value.trim();
    if (!query) {
        alert("Please enter a recipe to search.");
        return;
    }
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
            displayRecipes(data.meals);
            searchedRecipes = [...data.meals]; // Store searched recipes
            displayList();
        } else {
            recipesContainer.innerHTML = `<p>No recipes found.</p>`;
            searchedRecipes = [];
            displayList();
        }
    } catch (error) {
        console.error("An error occurred:", error);
        recipesContainer.innerHTML = `<p>An error occurred. Please try again later.</p>`;
    }
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const image = document.createElement('img');
        image.src = recipe.strMealThumb;
        image.alt = recipe.strMeal;

        const title = document.createElement('h2');
        title.textContent = recipe.strMeal;

        const ingredientsList = document.createElement('ul');

        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient !== "" && measure && measure !== "") {
                const listItem = document.createElement('li');
                listItem.textContent = `${measure} ${ingredient}`;
                ingredientsList.appendChild(listItem);
            }
        }

        recipeCard.appendChild(image);
        recipeCard.appendChild(title);
        recipeCard.appendChild(ingredientsList);
        recipesContainer.appendChild(recipeCard);
    });
    fetchPopularRecipes()
}

// Function to fetch popular recipes
async function fetchPopularRecipes() {
    popularRecipesContainer.innerHTML = '';
    const popularQueries = ["chicken", "beef", "pasta", "dessert"];
    for (const query of popularQueries) {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.meals && data.meals.length > 0) {
                const randomRecipe = data.meals[Math.floor(Math.random() * data.meals.length)];
                displayPopularRecipe(randomRecipe);
            }
        } catch (error) {
            console.error("Error fetching popular recipe for: " + query, error);
        }
    }
}

function displayPopularRecipe(recipe) {
    const popularRecipe = document.createElement('div');
    popularRecipe.classList.add('popular-recipe');

    const image = document.createElement('img');
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;

    const title = document.createElement('h3');
    title.textContent = recipe.strMeal;

    popularRecipe.appendChild(image);
    popularRecipe.appendChild(title);
    popularRecipesContainer.appendChild(popularRecipe);
}

function displayList() {
    listContainer.innerHTML = '';
    if (searchedRecipes.length > 0) {
        searchedRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            const image = document.createElement('img');
            image.src = recipe.strMealThumb;
            image.alt = recipe.strMeal;

            const title = document.createElement('h2');
            title.textContent = recipe.strMeal;

            const ingredientsList = document.createElement('ul');

            for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];
                if (ingredient && ingredient !== "" && measure && measure !== "") {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${measure} ${ingredient}`;
                    ingredientsList.appendChild(listItem);
                }
            }

            recipeCard.appendChild(image);
            recipeCard.appendChild(title);
            recipeCard.appendChild(ingredientsList);
            listContainer.appendChild(recipeCard);
        });
    } else {
        listContainer.innerHTML = `<p>No recipes on the list.</p>`;
    }
}

// Navigation links event listener
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
//  Initialize popular recipes
fetchPopularRecipes();
