import { describe, it, expect } from 'vitest';
import { initialState, ingredientsReducer } from './ingredientsReducer';

describe('ingredientsReducer', () => {
    it('должен возвращать initial state', () => {
        const state = ingredientsReducer(undefined, { type: '@@INIT' });
        expect(state).toBe(initialState);
    });

    it('должен обрабатывать действие setIngredients и обновлять состояние', () => {
        const payload = [{ id: 1, name: 'Ingredient 1' }, { id: 2, name: 'Ingredient 2' }];
        const action = { type: 'ingredients/get', payload };
        const state = ingredientsReducer(initialState, action);
        expect(state).toEqual(payload);
    });
});