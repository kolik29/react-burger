import { describe, it, expect } from 'vitest';
import {
  initialState,
  currentIngredientReducer,
  setCurrentIngredient,
  resetCurrentIngredient,
} from './currentIngredientReducer';
import { IIngredient } from '../types/Ingredient';

describe('currentIngredientReducer', () => {
  it('должен возвращать initial state', () => {
    const state = currentIngredientReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  it('должен устанавливать текущий ингредиент', () => {
    const ingredient: IIngredient = {
      _id: '1',
      name: 'ingredient1',
      type: 'sauce',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'image.jpg',
      image_mobile: 'image_mobile.jpg',
      image_large: 'image_large.jpg',
      __v: 0,
      key: 'key1',
    };

    const state = currentIngredientReducer(initialState, setCurrentIngredient(ingredient));
    expect(state).toEqual(ingredient);
  });

  it('должен сбрасывать текущий ингредиент в null', () => {
    const initial: IIngredient = {
      _id: '1',
      name: 'ingredient1',
      type: 'sauce',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'image.jpg',
      image_mobile: 'image_mobile.jpg',
      image_large: 'image_large.jpg',
      __v: 0,
      key: 'key1',
    };

    const state = currentIngredientReducer(initial, resetCurrentIngredient());
    expect(state).toBeNull();
  });
});
