import { describe, it, expect } from 'vitest';
import {
  initialState,
  burgerConstructorReducer,
  setSelectedIngredients,
  removeSelectedIngredients,
  clearAllIngredients,
  reorderSelectedIngredients,
} from './burgerConstructorReducer';
import { IIngredient } from '../types/Ingredient';

describe('burgerConstructorReducer', () => {
  it('должен возвращать initial state', () => {
    const state = burgerConstructorReducer(undefined, { type: undefined });
    expect(state).toEqual(initialState);
  });

  it('должен добавлять ингредиент', () => {
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

    const state = burgerConstructorReducer(initialState, setSelectedIngredients(ingredient));
    expect(state).toEqual([ingredient]);
  });

  it('должен заменять булку, если добавляется новая', () => {
    const initial: IIngredient[] = [
      {
        _id: '1',
        name: 'bun1',
        type: 'bun',
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
      },
      {
        _id: '2',
        name: 'sauce1',
        type: 'sauce',
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 50,
        price: 30,
        image: 'image2.jpg',
        image_mobile: 'image_mobile2.jpg',
        image_large: 'image_large2.jpg',
        __v: 0,
        key: 'key2',
      },
    ];

    const newBun: IIngredient = {
      _id: '3',
      name: 'bun2',
      type: 'bun',
      proteins: 15,
      fat: 7,
      carbohydrates: 25,
      calories: 120,
      price: 60,
      image: 'image3.jpg',
      image_mobile: 'image_mobile3.jpg',
      image_large: 'image_large3.jpg',
      __v: 0,
      key: 'key3',
    };

    const state = burgerConstructorReducer(initial, setSelectedIngredients(newBun));
    expect(state).toEqual([
      initial[1],
      newBun,
    ]);
  });

  it('должен удалять ингредиент по индексу', () => {
    const initial: IIngredient[] = [
      {
        _id: '1',
        name: 'bun1',
        type: 'bun',
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
      },
      {
        _id: '2',
        name: 'sauce1',
        type: 'sauce',
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 50,
        price: 30,
        image: 'image2.jpg',
        image_mobile: 'image_mobile2.jpg',
        image_large: 'image_large2.jpg',
        __v: 0,
        key: 'key2',
      },
      {
        _id: '3',
        name: 'main1',
        type: 'main',
        proteins: 20,
        fat: 10,
        carbohydrates: 30,
        calories: 200,
        price: 100,
        image: 'image3.jpg',
        image_mobile: 'image_mobile3.jpg',
        image_large: 'image_large3.jpg',
        __v: 0,
        key: 'key3',
      },
    ];

    const state = burgerConstructorReducer(initial, removeSelectedIngredients(1));
    expect(state).toEqual([
      initial[0],
      initial[2],
    ]);
  });

  it('должен очищать все ингредиенты', () => {
    const initial: IIngredient[] = [
      {
        _id: '1',
        name: 'bun1',
        type: 'bun',
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
      },
      {
        _id: '2',
        name: 'sauce1',
        type: 'sauce',
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 50,
        price: 30,
        image: 'image2.jpg',
        image_mobile: 'image_mobile2.jpg',
        image_large: 'image_large2.jpg',
        __v: 0,
        key: 'key2',
      },
    ];

    const state = burgerConstructorReducer(initial, clearAllIngredients());
    expect(state).toEqual([]);
  });

  it('должен менять порядок ингредиентов, сохраняя булки на месте', () => {
    const initial: IIngredient[] = [
      {
        _id: '1',
        name: 'bun1',
        type: 'bun',
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
      },
      {
        _id: '2',
        name: 'sauce1',
        type: 'sauce',
        proteins: 5,
        fat: 2,
        carbohydrates: 10,
        calories: 50,
        price: 30,
        image: 'image2.jpg',
        image_mobile: 'image_mobile2.jpg',
        image_large: 'image_large2.jpg',
        __v: 0,
        key: 'key2',
      },
      {
        _id: '3',
        name: 'main1',
        type: 'main',
        proteins: 20,
        fat: 10,
        carbohydrates: 30,
        calories: 200,
        price: 100,
        image: 'image3.jpg',
        image_mobile: 'image_mobile3.jpg',
        image_large: 'image_large3.jpg',
        __v: 0,
        key: 'key3',
      },
    ];

    const reordered: IIngredient[] = [
      initial[2],
      initial[1],
    ];

    const state = burgerConstructorReducer(initial, reorderSelectedIngredients(reordered));
    expect(state).toEqual([
      initial[0],
      initial[2],
      initial[1],
    ]);
  });
});
