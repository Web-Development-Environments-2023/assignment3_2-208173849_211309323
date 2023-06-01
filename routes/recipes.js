var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the search result
 */

router.get("/search/", async (req, res, next) => {

  try {
    let query="?query="+req.query.query

    let q_number = 4

    // might add a helper function
    if(req.query.number!= undefined)
      q_number=req.query.number

    if(req.query.cusine!= undefined)
      query=query+"&cusine="+req.query.cusine
      

    if(req.query.diet!= undefined)
      query=query+"&diet="+req.query.diet

    if(req.query.intolerances!= undefined)
      query=query+"&intolerances="+req.query.intolerances
    // end of helper

  const result = await recipes_utils.search(query,q_number) 
   res.send(result)
  } 
  catch (error) 
  {
    next(error)
  }
})

/**
 * This path returns 3 random recipes
 */

router.get("/ExploreThisRecipes",async (req,res,next) =>{

  try
  {
    const recipes = await recipes_utils.getRandom()
    res.send(recipes)
  }
  catch(error)
  {
    next(error)
  }

})

module.exports = router;
