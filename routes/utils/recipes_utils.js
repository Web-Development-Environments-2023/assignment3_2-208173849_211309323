const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */

async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

async function getRandomRecipes() {
  return await axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

async function RecipeDetailsPreview(recipes_information) {
  return recipes_information.map((recipes_information) => {
    let data = recipes_information;
    if (recipes_information.data) {
      data = recipes_information.data;
    }
    const {id,title,readyInMinutes,image,aggregateLikes,vegan,vegetarian,glutenFree,} = data;
    return {
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      image: image,
      aggregateLikes: aggregateLikes,
      vegan: vegan,
      vegetarian: vegetarian,
      glutenFree: glutenFree,
    };
  });
}

async function getRecipeDetails(recipe_id) {
  let recipes_information = await getRecipeInformation(recipe_id);
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
    extendedIngredients,
    instructions,
    analyzedInstructions,
    servings,
  } = recipes_information.data;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    aggregateLikes: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    extendedIngredients: extendedIngredients,
    instructions: instructions,
    analyzedInstructions: analyzedInstructions,
    servings: servings,
  };
}


async function getRecipesPreview(recipes_ids) {
  let p = [];
  recipes_ids.map((id) => {
    p.push(getRecipeInformation(id));
  });
  let res = await Promise.all(p);
  return RecipeDetailsPreview(res);
}

async function Random() {
  let random_pool = await getRandomRecipes();
  return RecipeDetailsPreview(random_pool.data.recipes);
}


async function searchRecipes(search_params,user_id) {
  let search_res = await axios.get(`${api_domain}/complexSearch`, {
    params: {
      query: search_params.query,
      number: search_params.number,
      instructionsRequired: search_params.instructionsRequired,
      cuisine: search_params.cuisine,
      diet: search_params.diet,
      intolerances: search_params.intolerances,
      sort: search_params.sort,
      sortDirection: search_params.sortDirection,
      addRecipeInformation: true,
      apiKey: process.env.spooncular_apiKey,
    },
  });
  await DButils.execQuery(`UPDATE users SET last_search='${ search_res.data}' WHERE user_id='${user_id}'`);

  return search_res.data;
}
async function getLatSearch(user_id){
  const recipes_id = await DButils.execQuery(`select last_search from users where user_id='${user_id}'`);
  return recipes_id;
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.Random = Random;
exports.searchRecipes = searchRecipes;
exports.getLatSearch=getLatSearch;