import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';
import { iIngredient } from '../../types/Ingredient';

function App() {
  const [ingredients, setIngredients] = React.useState<iIngredient[]>([])
  const url = 'https://norma.nomoreparties.space'

  const fetchIngredients = React.useCallback(async () => {
    try {
      const response = await fetch(url + '/api/ingredients');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      setIngredients(data.data);
    } catch (e) {
      console.error(e);
    }
  }, [])

  React.useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return (
    <>
      <AppHeader />
      <div className="wrapper overflow_hidden height_100">
        <main className="container display_flex flex-direction_column height_100">
          <div className="display_flex justify-content_space-between height_100 overflow_hidden">
            <BurgerIngredients key="ingredients" data={ingredients} />
            <BurgerConstructor key="constructor" data={ingredients} />
          </div>
        </main>
      </div>
      <div id="modal-root"></div>
    </>
  )
}

export default App;