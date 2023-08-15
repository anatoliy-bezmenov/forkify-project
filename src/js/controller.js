import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
};
init();

/*
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// console.log(icons);

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2 // <--- API

///////////////////////////////////////

// Comment out below "module.hot" code if needed (for testing). It prevents page reload on saved file(s)

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // Below adds a default recipe on opening the website/server
    // const id = window.location.hash.slice(1) || '5ed6604591c37cdc054bc90b';
    //console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    // resultsView.render(model.getSearchResultsPage());
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id); // <--- await because it's an async function
    ////const recipe = model.state.recipe;
    //const { recipe } = model.state; // <--- the same as above but destructured

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    // const recipeView = new RecipeView(mode.state.recipe) // <--- if the class was exported
  } catch (err) {
    //alert(err);
    //console.error(`${err}ZZZZZ`);
    recipeView.renderError();
    console.error(`ZZZ ${err}`);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);

    //console.log(model.getSearchResultsPage(1));
    resultsView.render(model.getSearchResultsPage()); // <--- leaving it empty is the same as
    // setting it to 1 (1st page)

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(`${err}iiiii`);
    //throw err;
  }
};

const controlPagination = function (goToPage) {
  // console.log(goToPage);

  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  // model.updateServings(8);
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // console.log(model.state.recipe.bookmarked);
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// const deleteRecipe = function () {
//   model.deleteRecipeView(model.state.id);
// };

// const controlAddRecipe = async function (newRecipe) {
//   // console.log(newRecipe);
//   try {
//     // Show loading spinner
//     addRecipeView.renderSpinner();

//     // Upload the new recipe data
//     await model.uploadRecipe(newRecipe);
//     console.log(model.state.recipe);

//     // Render recipe
//     recipeView.render(model.state.recipe);

//     // Success message
//     addRecipeView.renderMessage();

//     // Render bookmark view
//     bookmarksView.render(model.state.bookmarks);

//     // Close form window
//     setTimeout(function () {
//       addRecipeView.toggleWindow();
//     }, MODAL_CLOSE_SEC * 1000);
//   } catch (err) {
//     console.error(`PAZ ${err}`);
//     addRecipeView.renderError(err.message);
//   }
// };

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      // location.reload(); -> PAGE WILL REFRESH THIS WAY
    }, MODAL_CLOSE_SEC * 1000);

    // RIGHT HERE!
    // We need to re-render this modal window
    // Do this to be able to create new recipes after successfully making a recipe
    setTimeout(function () {
      addRecipeView.renderUploadForm();
    }, MODAL_CLOSE_SEC * 1150);

    // addRecipeView._addHandlerShowWindow();
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);

    // PAGE WILL REFRESH THIS WAY -> Use the addRecipeView renderUploadForm function

    // setTimeout(function () {
    //   addRecipeView.toggleWindow();
    //   location.reload();
    // }, MODAL_CLOSE_SEC * 1150);

    // AFTER AN ERROR!
    // Do this to be able to create new recipes after an error occurs
    setTimeout(function () {
      addRecipeView.renderUploadForm();
    }, MODAL_CLOSE_SEC * 1150);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  // model.deleteRecipeView(deleteRecipe);
};
init();

//showRecipe();

// // Below is moved to recipeView
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
*/
