describe('Проверка заказа', () => {
  it('должен открыть окно ингредиента', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').click();
    cy.contains('Детали ингредиента').should('be.visible');
  });

  it('должен перетащить булку в конструктор', () => {
    cy.visit('http://localhost:5173');
    
    dndIngredients('ingredient-643d69a5c3f7b9001cfa093c');

    cy.get('@dropzone').contains('Краторная булка N-200i');
  });

  it('должен авторизоваться', () => {
    cy.visit('http://localhost:5173/login');

    auth();

    cy.window().then((win) => {
      const token = win.localStorage.getItem('accessToken');
      expect(token).to.exist;
    });
  });

  it('должен создать заказ', () => {
    cy.visit('http://localhost:5173/login');

    auth();
    
    dndIngredients('ingredient-643d69a5c3f7b9001cfa093c');
    dndIngredients('ingredient-643d69a5c3f7b9001cfa0943');

    cy.get('.create-order .button.button_type_primary.button_size_large').click();

    cy.contains('идентификатор заказа', { timeout: 30000 }).should('be.visible');
  });
});

function dndIngredients(ingredient_id: string) {
  cy.get(`[data-testid="${ingredient_id}"]`).as('ingredient');
  cy.get('[data-testid="burger-constructor-dropzone"]').as('dropzone');

  const dataTransfer = new DataTransfer();

  cy.get('@ingredient')
    .trigger('dragstart', { dataTransfer, force: true });
  cy.get('@dropzone')
    .trigger('dragenter', { dataTransfer, force: true })
    .trigger('dragover', { dataTransfer, force: true });
  cy.get('@dropzone')
    .trigger('drop', { dataTransfer, force: true });
  cy.get('@ingredient')
    .trigger('dragend', { dataTransfer, force: true });
}

function auth() {
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/auth/login').as('loginRequest');

  cy.get('input[type="email"]').type('test16012024@test.ru');
  cy.get('input[type="password"]').type('test16012024');
  cy.get('.button.button_type_primary.button_size_medium').click();

  cy.wait('@loginRequest');
}