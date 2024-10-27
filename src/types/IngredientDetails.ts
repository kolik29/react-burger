import { iIngredient } from "./Ingredient";
import { iModal } from "./Modal";

export interface iIngredientDetails extends iModal {
    ingredient: iIngredient
}