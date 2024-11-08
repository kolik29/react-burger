import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';
import { setIngredients } from '../../services/ingredientsReducer';
import { useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const dispatch = useDispatch();
  const url = 'https://norma.nomoreparties.space';

  const fetchIngredients = React.useCallback(async () => {
    try {
      const response = await fetch(url + '/api/ingredients');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      dispatch(setIngredients(data.data));
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
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients key="ingredients" />
              <BurgerConstructor key="constructor" />
            </DndProvider>
          </div>
        </main>
      </div>
    </>
  )
}

export default App;