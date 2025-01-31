import { describe, it } from 'vitest';

describe('Burger Constructor Drag and Drop', () => {
  it('должен перетащить ингредиент в конструктор', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="ingredient-bun-1"]').as('bun');
    cy.get('[data-testid="burger-constructor-dropzone"]').as('dropzone');

    const dataTransfer = new DataTransfer();

    cy.get('@bun')
      .trigger('dragstart', { dataTransfer, force: true });

    cy.get('@dropzone')
      .trigger('dragenter', { dataTransfer, force: true })
      .trigger('dragover', { dataTransfer, force: true });

    cy.get('@dropzone')
      .trigger('drop', { dataTransfer, force: true });

    cy.get('@bun')
      .trigger('dragend', { dataTransfer, force: true });

    cy.get('@dropzone').contains('Краторная булка N-200i');
  });
});

