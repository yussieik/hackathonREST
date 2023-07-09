const recipeByCatContainer = document.querySelector('.categories__recipies');
const categorySelect = document.querySelector('#categorySelect');
const newest = document.querySelector('.newest');
const searchInput = document.querySelector('#searchInput');


//get recipes, filter by CategoryID, call display func + display last recipes
async function getRecipesList(categoryId, searchQuery) {
    try {
        const response = await fetch('/api/recipes/');

        if (response.ok) {
            const getData = await response.json();

            const recipesByCategory = getData.filter(item => item.category === categoryId);
            
            recipesByCategory.forEach(async item => {
                //console.log(item);
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



//get info from API categories
async function getCategoryList() {
    
    try {
        const response = await fetch('/api/categories/');
        if (response.ok) {
            const getData = await response.json();
            //console.log(getData); // array of objects: ID + category name
            
            //for display list of category's names in the middle of page
            getData.forEach(async (item) => {
                //go to show func
                displayCategories(item, item['id']);
            });

            // initially category - Pork
            const initialCategoryId = getData[2].id;
            displayRecipesByCategory(initialCategoryId);

            //for select on the top
            getData.forEach(category => {
                const option = document.createElement('option');
                option.value = category['id'];
                option.textContent = category['name'];
                categorySelect.appendChild(option);
            });

            // for category selection event change to get value of option
            categorySelect.addEventListener('change', () => {
                const selectedIndex = categorySelect.selectedIndex;
                const selectedCategoryId = categorySelect.options[selectedIndex].value;

                newest.style.display = 'none';

                const title = document.querySelector('.categories__title');
                const subtitle = document.querySelector('.categories__subtitle');
                subtitle.textContent = '';


                //category.id - toString because i need to compare with the same types
                const selectedCategory = getData.find(category => category.id.toString() === selectedCategoryId);

                if (selectedCategory) {
                    //console.log('Selected Category:', selectedCategory);
                    title.textContent = selectedCategory.name;
                } else {
                    //console.log('Selected Category not found.');
                    title.textContent = '';
                }

                displayRecipesByCategory(selectedCategoryId);
            });

            //search
            searchInput.addEventListener('input', () => {
                const selectedCategoryId = categorySelect.value;
                const searchQuery = searchInput.value;
                displayRecipesByCategory(selectedCategoryId);
            });

        } else {
            throw new Error('Something wrong with fetch');
        }

    } catch (err) {
        console.log(`Error`, err);
    }

}



//when was click event on a category element - fetch the recipes for that category
function handleCategoryClick(categoryId) {
    return async function (event) {
        event.preventDefault();
        try {
            const response = await fetch(`/api/categories/${categoryId}/recipes/`);
            if (response.ok) {
                const recipes = await response.json();
                //console.log(recipes); // arr of objects filtered by category what was chosen
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

//display in DOM recipes after click on the link in list of category 
function displayRecepiesByCat(recipe) {
    //console.log(recipe);

    const col = document.createElement('div');
    col.classList.add('col');

    const card = createCard(recipe);

    col.appendChild(card);
    recipeByCatContainer.appendChild(col);
}


// display recipes based on the selected category from select on the top
async function displayRecipesByCategory(categoryId) {
    
    try {
      const response = await fetch(`/api/categories/${categoryId}/recipes/`);
      if (response.ok) {
        const recipes = await response.json();

        // Clear container
        recipeByCatContainer.textContent = '';
  
        //show on page filtered by Category
        recipes.forEach(recipe => {
          const card = createCard(recipe);
          recipeByCatContainer.appendChild(card);
        });


      } else {
        throw new Error('Something went wrong with fetching recipes');
      }
    } catch (error) {
      console.error(error);
    }
  }


//show list of categories
function displayCategories(obj, categoryId) {
    const categoryContainer = document.querySelector('.categories__list');
    const categoryUl = categoryContainer.querySelector('.categories__block');

    //create link
    const li = document.createElement('li');
    const a = document.createElement('a');
    const aText = document.createTextNode(obj['name']);
    a.href = '#';

    a.appendChild(aText);

    //prevent refresh page, add class to each link, 
    a.addEventListener('click', function (event) {
        event.preventDefault();


        // Remove the "active" class from all category links
        const allCategoryLinks = categoryUl.querySelectorAll('li a');
        allCategoryLinks.forEach(link => link.classList.remove('active'));

        // Add the "active" class to the clicked category link
        a.classList.add('active');

        //immediately call the returned function with event because we return it from handle
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
    const readMoreText = document.createTextNode('Step by step guide...');

    const img = document.createElement('img');
    img.src = obj['img'];




    card.appendChild(img);

    title.appendChild(titleText);
    cardBody.appendChild(title);


    readMore.appendChild(readMoreText);
    cardFooter.appendChild(readMore);

    card.appendChild(cardBody);
    card.appendChild(cardFooter);


    //for popup window after click on card
    card.addEventListener(('click'), (e) => {
        e.preventDefault();

        //got to show ingr + give they two params ingredients + instructions
        showIngredientsPopup(obj['instructions'], obj['ingredients']);
    })


    return card;
}

function createVideoCard(obj) {
    const card = document.createElement('div');
    card.classList.add('card', 'h-100');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const title = document.createElement('h4');
    const titleText = document.createTextNode(obj['title']);

    const img = document.createElement('img');
    img.src = obj['img'];

    card.appendChild(img);

    // // Create a container element in the DOM
    // const videoContainer = document.createElement('div');
    // videoContainer.classList.add('video-container');

    // // Access the video link from the object
    // const videoLink = obj['video'];

    // // Create an iframe element
    // const videoIframe = document.createElement('iframe');
    // videoIframe.src = videoLink;
    // videoIframe.allowFullscreen = true;
    // videoIframe.setAttribute('frameborder', '0');

    card.addEventListener('click', () => {
        window.open(obj['video'], '_blank');
    })

    title.appendChild(titleText);
    cardBody.appendChild(title);
    //cardBody.appendChild(videoIframe);
    card.appendChild(cardBody);


    return card;
}




function showIngredientsPopup(instructions, ingredients) {
    //console.log(ingredients);
    // popup window with ingredients and instructions
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

    const instructionsText = document.createElement('div');
    if (instructions) {
        const regex = /[.!?]+/g;
        const sentences = instructions.split(regex);

        sentences.forEach(sentence => {
            const p = document.createElement('p');
            p.textContent = `- ${sentence.trim()}`; // Trim any whitespace
            instructionsText.appendChild(p);
        });
    }

    content.appendChild(titleNeed);
    content.appendChild(closeBtn);
    content.appendChild(ingredientsList);
    content.appendChild(titleStep);
    content.appendChild(instructionsText);
    popup.appendChild(content);

    document.body.appendChild(popup);

    //document.body.style.position = 'fixed';

    //comparing if we click not on the content window (background) - remove popup
    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            document.body.removeChild(popup);
            //document.body.style.position = '';
        }
    });


    //close the popup on button
    closeBtn.addEventListener('click', function () {
        document.body.removeChild(popup);
        //document.body.style.position = '';
    });
}

const subscribeBtn = document.querySelector('#call__subscription');
subscribeBtn.addEventListener('click', showNewsletters);

function showNewsletters() {

    const popup = document.createElement('div');
    popup.classList.add('popup');

    const content = document.createElement('div');
    content.classList.add('popup-content', 'popup-subscr');

    const closeBtn = document.createElement('span');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';

    //form
    const myFormSubscr = document.createElement('form');

    const labelName = document.createElement('label');
    labelName.textContent = 'Write your name';

    const inputName = document.createElement('input');
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "userNameSubscription");
    inputName.id = 'userNameSubscription';

    const labelEmail = document.createElement('label');
    labelEmail.textContent = 'Write your email';
    const inputEmail = document.createElement('input');
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('name', 'email');
    inputEmail.id = 'userEmailSubscription';
    
    const btn = document.createElement('button');
    btn.textContent = 'Subscribe';

    myFormSubscr.appendChild(labelName);
    myFormSubscr.appendChild(inputName);
    myFormSubscr.appendChild(labelEmail);
    myFormSubscr.appendChild(inputEmail);
    myFormSubscr.appendChild(btn);
    content.appendChild(myFormSubscr);

   
    content.appendChild(closeBtn);
    popup.appendChild(content);
    document.body.appendChild(popup);

    // if we click not on the content window (background) - remove popup
    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            document.body.removeChild(popup);
        }
    });

    //close the popup on button
    closeBtn.addEventListener('click', function () {
        document.body.removeChild(popup);
    });
    
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
    const randomRecipesVideo = document.querySelector('.video__recipes');

    // Clear container
    lastRecipesContainer.textContent = '';

    // last four recipes from DB
    const lastFourRecipes = recipes.slice(-4);

    lastFourRecipes.forEach(recipe => {

        const card = createCard(recipe);
        lastRecipesContainer.appendChild(card);
    });

    //video
    randomRecipesVideo.textContent = '';
    const recipesVideo = recipes.slice(10,18);
    recipesVideo.forEach(recipe => {
        const card = createVideoCard(recipe);
        randomRecipesVideo.appendChild(card);
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
async function createCategory(categoryData) {
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

async function updateCategory(categoryId, updatedData) {
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
async function createIngredient(ingredientData) {
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

async function updateIngredient(ingredientId, updatedData) {
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

async function deleteIngredient(ingredientId) {
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


