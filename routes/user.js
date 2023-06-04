var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");


router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});



router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})


router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); 
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.post('/watched', async (req,res,next) => { 
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsWatched(user_id,recipe_id);
    res.status(200).send("you have seen this recipe");
    } catch(error){
    next(error);
  }
})



router.get('/watched', async (req,res,next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getWatchedRecipes(user_id);
    let recipes_array = [];
    recipes_id.map((element) => recipes_array.push(element.recipe_id)); 
    const results = await recipe_utils.getRecipesPreview(
      recipes_array.slice(0,3)
    );
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.post("/addRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const image = req.body.image;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const glutenFree = req.body.glutenFree;
    const extendedIngredients = req.body.extendedIngredients;
    const instruction = req.body.instruction;
    const servings = req.body.servings;
    await user_utils.addRecipes(user_id,title,readyInMinutes,image,vegan,vegetarian,glutenFree, extendedIngredients,instruction,servings
    );
    res.status(200).send("The Recipe successfully saved");
  } catch (error) {
    next(error);
  }
});



router.get("/showMyRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe = await user_utils.getMyRecipes(user_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.post('/addFamilyRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    console.log(user_id);
    const title = req.body.title;
    const image = req.body.image;
    const recipeOwner = req.body.recipeOwner;
    const WhenPrepared = req.body.WhenPrepared;
    const instructions = req.body.instructions;
    const ingredients = req.body.ingredients;
    await user_utils.addFamilyRecipe(title,image,recipeOwner,user_id,instructions,ingredients,WhenPrepared);
    res.status(200).send("The Recipe successfully saved as family recipe!");
    } catch(error){
    next(error);
  }
})

router.get('/ShowfamilyRecips', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFamilyRecipes(user_id,1);
    let ans = await user_utils.FamilyRecipes(recipes_id);
    res.status(200).send(ans);
  } catch(error){
    next(error); 
  }
});


module.exports = router;
