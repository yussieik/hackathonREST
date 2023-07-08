
async function getRecipesList(categoryId) {
    try {
        const response = await fetch('/api/recipes/');

        if (response.ok) {
            const getData = await response.json();
            const recipesByCategory = getData.filter(item => item.category === categoryId);
            recipesByCategory.forEach(async item => {
                displayRecepiesByCat(item);
            });
            displayLastRecipes(getData);
        } else {
            throw new Error('Something wrong with fetch');
        }

    } catch (err) {
        console.log(`Error`, err);
    }

}

async function getCategoryList() {
    try {
        const response = await fetch('/api/categories/');
        if (response.ok) {
            const getData = await response.json();
            //console.log(getData);
            getData.forEach(async (item) => {
                displayCategories(item, item['id']);

            });
            // Call getRecipesList with the first category ID
            getRecipesList(getData[0].id);
        } else {
            throw new Error('Something wrong with fetch');
        }

    } catch (err) {
        console.log(`Error`, err);
    }

}


function handleCategoryClick(categoryId) {
    return async function (event) {
        event.preventDefault();
        try {
            const response = await fetch(`/api/categories/${categoryId}/recipes/`);
            if (response.ok) {
                const recipes = await response.json();

                recipes.forEach(async recipe => {

                    displayRecepiesByCat(recipe);
                });
            } else {
                throw new Error('Something went wrong with fetch');
            }
        } catch (err) {
            console.log(`Error`, err);
        }
    };
}

const recipeByCatContainer = document.querySelector('.categories__recipies');

function displayRecepiesByCat(recipe) {
    //console.log(recipe);

    const col = document.createElement('div');
    col.classList.add('col');

    const card = createCard(recipe);

    col.appendChild(card);
    recipeByCatContainer.appendChild(col);
}


function displayCategories(obj, categoryId) {
    const categoryContainer = document.querySelector('.categories__list');
    const categoryUl = categoryContainer.querySelector('.categories__block');

    
    const selectCategory = document.querySelector('#category');
    const newOption = document.createElement('option');
    const optionText = document.createTextNode(obj['name']);

    newOption.appendChild(optionText);
    selectCategory.appendChild(newOption);


    const li = document.createElement('li');
    const a = document.createElement('a');
    const aText = document.createTextNode(obj['name']);
    a.href = '#';

    a.appendChild(aText);
    a.addEventListener('click', function (event) {
        event.preventDefault();

        // Remove the "active" class from all category links
        const allCategoryLinks = categoryUl.querySelectorAll('li a');
        allCategoryLinks.forEach(link => link.classList.remove('active'));

        // Add the "active" class to the clicked category link
        a.classList.add('active');

        handleCategoryClick(categoryId)(event);
        recipeByCatContainer.textContent = '';
    });


    li.appendChild(a);
    categoryUl.appendChild(li);

    categoryContainer.appendChild(categoryUl);
}


function createCard(obj) {
    const card = document.createElement('div');
    card.classList.add('card', 'h-100');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const title = document.createElement('h4');
    const titleText = document.createTextNode(obj['title']);

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');
    const readMore = document.createElement('a');
    readMore.href = '#';
    readMore.classList.add('read_more');
    const instrText = document.createTextNode('Step by step guide...');



    const img = document.createElement('img');
    img.src = obj['img'];

    card.appendChild(img);

    title.appendChild(titleText);
    cardBody.appendChild(title);


    readMore.appendChild(instrText);
    cardFooter.appendChild(readMore);

    card.appendChild(cardBody);
    card.appendChild(cardFooter);


    card.addEventListener(('click'), (e) => {
        e.preventDefault();

        showIngredientsPopup(obj['instructions'], obj['ingredients']);
    })


    return card;
}


function displayRecipes(obj) {
    // console.log(obj);
    const cardContainer = document.querySelector('.catalog');

    const col = document.createElement('div');
    col.classList.add('col');

    const card = createCard(obj);

    col.appendChild(card);
    cardContainer.appendChild(col);
}


function displayLastRecipes(recipes) {

    const lastRecipesContainer = document.querySelector('.lastRecipes');

    // Clear any existing content in the container
    lastRecipesContainer.textContent = '';

    // Get the last four recipes
    const lastFourRecipes = recipes.slice(-4);

    lastFourRecipes.forEach(recipe => {

        const card = createCard(recipe);
        lastRecipesContainer.appendChild(card);
    });
}


function showIngredientsPopup(instructions, ingredients) {
    console.log(ingredients);
    // Create and display the popup window with ingredients
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const content = document.createElement('div');
    content.classList.add('popup-content');

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';

    const titleNeed = document.createElement('h3');
    titleNeed.textContent = 'You need: '

    const titleStep = document.createElement('h3');
    titleStep.textContent = 'Steps: '

    const ingredientsList = document.createElement('div');
    ingredients.forEach(ingredient => {
        const listItem = document.createElement('span');
        listItem.classList.add('ingred');
        listItem.textContent = ingredient['name'];
        ingredientsList.appendChild(listItem);
    });

    const instructionsText = document.createElement('p');
    instructionsText.textContent = instructions;

    content.appendChild(titleNeed);
    content.appendChild(closeBtn);
    content.appendChild(ingredientsList);
    content.appendChild(titleStep);
    content.appendChild(instructionsText);
    popup.appendChild(content);

    document.body.appendChild(popup);

    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            document.body.removeChild(popup);
        }
    });


    // Add event listener to close the popup
    closeBtn.addEventListener('click', function () {
        document.body.removeChild(popup);
    });
}


//recipe CRUD
async function createRecipe(recipeData) {
    try {
        const response = await fetch('/api/recipes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
        } else {
            throw new Error('Something went wrong with creating the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

async function updateRecipe(recipeId, updatedData) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
        } else {
            throw new Error('Something went wrong with updating the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteRecipe(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Recipe deleted successfully');
        } else {
            throw new Error('Something went wrong with deleting the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

// category CRUD
async function createRecipe(categoryData) {
    try {
        const response = await fetch('/api/categories/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
        } else {
            throw new Error('Something went wrong with creating the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

async function updateRecipe(categoryId, updatedData) {
    try {
        const response = await fetch(`/api/categories/${categoryId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
        } else {
            throw new Error('Something went wrong with updating the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`/api/categories/${categoryId}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Recipe deleted successfully');
        } else {
            throw new Error('Something went wrong with deleting the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

// ingredient CRUD
async function createRecipe(ingredientData) {
    try {
        const response = await fetch('/api/ingredients/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ingredientData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
        } else {
            throw new Error('Something went wrong with creating the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

async function updateRecipe(ingredientId, updatedData) {
    try {
        const response = await fetch(`/api/ingredients/${ingredientId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
        } else {
            throw new Error('Something went wrong with updating the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteCategory(ingredientId) {
    try {
        const response = await fetch(`/api/ingredients/${ingredientId}/`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Recipe deleted successfully');
        } else {
            throw new Error('Something went wrong with deleting the Recipe');
        }
    } catch (error) {
        console.error(error);
    }
}

getCategoryList()
getRecipesList()