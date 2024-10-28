import { IIngredient } from "./Ingredient";
import { IModal } from "./Modal";

export interface IIngredientDetails extends IModal {
    ingredient: IIngredient
}