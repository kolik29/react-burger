import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';

const Main = () => {
  return (
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
  );
};

export default Main;