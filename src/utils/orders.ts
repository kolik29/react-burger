import { IIngredient } from "../types/Ingredient";

export const calculateOrderPrice = (ingredientIds: string[], ingredients: IIngredient[]) => {
  return ingredientIds.reduce((sum, id) => {
    const ing = ingredients.find((item: any) => item._id === id);
    return ing ? sum + ing.price : sum;
  }, 0);
};

export const getIngredientImage = (id: string, ingredients: IIngredient[]) => {
  const ing = ingredients.find((item: any) => item._id === id);
  return ing ? ing.image : '';
};