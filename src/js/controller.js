import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import addRecipeView from './views/addRecipeView.js';

import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/es';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.jonas.io

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

// renderSpinner();
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // recipeView.renderSpinner();
    recipeView.renderSpinner();

    //mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // updating bookmarks view
    // bookmarksView.update(model.state.bookmarks);
    // loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //2 rendering recipe
    recipeView.render(recipe);

    // controlServings();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // console.log(resultsView);
    // resultsView.renderSpinner();
    resultsView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search  results
    await model.loadSearchResults(query);

    // 3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSEarchResults();
const controlPagination = function (goToPage) {
  // 3) render results

  resultsView.render(model.getSearchResultsPage(goToPage));
  //4 render initial pagination buttons

  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  if (!newServings || isNaN(newServings)) {
    return;
  }
  //update the recipe servings in state
  model.updateServings(newServings);
  // update the view
  // recipeView.render(model.state.recipe);
  if (model.state.recipe) recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe.bookmarked);
  // console.log(model.state.recipe);

  // recipeView.update(model.
  // state.recipe);
  // 2) update recipe bookmark
  recipeView.update(model.state.recipe);

  // 3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinnner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // console.log(newRecipe);
    // recipeView.render(model.state.recipe);
    // setTimeout(function () {
    //   addRecipeView.toggleWindow();
    // });
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();
    // RENDER THE BOOKMARK VIEW
    bookmarksView.render(model.state.bookmarks);

    //change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥${err}`);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlersearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };

// clearBookmarks();
