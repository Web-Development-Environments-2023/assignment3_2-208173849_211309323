const DButils = require("./DButils");

async function  markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}
async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`insert into watchedRecipes values ('${user_id}',${recipe_id})`);
     
}
async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from watchedRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function addRecipes(
    user_id,
    title,
    readyInMinutes,
    image,
    vegan,
    vegetarian,
    glutenFree,
    extendedIngredients,
    instruction,
    servings
  ) {
    await DButils.execQuery(
      `insert into my_recipes values ('${user_id}','${title}','${image}','${readyInMinutes}
      ','${vegan}','${vegetarian}','${glutenFree}','${extendedIngredients}','${instruction}','${servings}')`
    );
  }
  async function getMyRecipes(user_id) {
    const recipes = await DButils.execQuery(
      `select * from my_recipes where user_id='${user_id}'`
    );
    return recipes;
  }
  async function FamilyRecipes(recipesId){
    ans = []
    for (let i=0; i<recipesId.length; i++){
        toAdd = await DButils.execQuery(`select title,image,recipeOwner,instructions,ingredients,WhenPrepared from family_recipes where id='${recipesId[i].id}';`)
        console.log(toAdd)
        ans.push(toAdd);
    }
    return ans;
}
  async function getFamilyRecipes() {
    const recipes = await DButils.execQuery(`select * from family_recipes`);
    return recipes;
  }
  async function addFamilyRecipe(title,image,recipeOwner,user_id,instructions,ingredients,WhenPrepared){
    if( recipeOwner==undefined ||instructions==undefined  || ingredients==undefined || WhenPrepared==undefined){
        throw { status: 422, message: "There are a Missing Value!" }; 
    }
    else{
        await DButils.execQuery(`insert into family_recipes values (NULL,'${title}','${user_id}','${image}','${recipeOwner}','${instructions}','${ingredients}','${WhenPrepared}
       ')`);
    }
}




exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.markAsWatched=markAsWatched;
exports.getWatchedRecipes=getWatchedRecipes;
exports.getMyRecipes=getMyRecipes;
exports.addRecipes=addRecipes;
exports.FamilyRecipes=FamilyRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.addFamilyRecipe=addFamilyRecipe;

