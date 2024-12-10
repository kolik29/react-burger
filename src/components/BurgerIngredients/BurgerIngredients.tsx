import React from 'react';
import { Tab, CurrencyIcon, Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import { IIngredient } from '../../types/Ingredient';
import CustomScrollBar from '../CustomScrollbar/CustomScrollbar.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import IngredientDetails from '../IngredientDetails/IngredientDetails.tsx';
import Modal from '../Modal/Modal.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentIngredient, resetCurrentIngredient } from '../../services/currentIngredientReducer.tsx';
import { useDrag } from 'react-dnd';
import { RootState } from '../../services/store.tsx';

const IngredientItem: React.FC<{ item: IIngredient, count: number, onClick: () => void }> = ({ item, count, onClick }) => {
  const [, reactRef] = useDrag({
    type: 'ingredient',
    item: { ...item },
  });

  return (
    <div
      key={item._id}
      className={`${styles.ingredients_item} mr-3 ml-3 mb-8 position_relative`}
      onClick={onClick}
      ref={reactRef}
    >
      {count > 0 && <Counter count={count} size="default" />}
      <div className='display_flex justify-content_center'>
        <img src={item.image} alt={item.name} width="240" height="120" />
      </div>
      <div className='display_flex justify-content_center mt-1 mb-1'>
        <bdi className='display_flex align-items_center text text_type_digits-default'>
          {item.price} <CurrencyIcon type="primary" className='ml-3' />
        </bdi>
      </div>
      <div className='display_flex justify-content_center'>
        <p className='text-align_center height_48px text text_type_main-default'>{item.name}</p>
      </div>
    </div>
  );
};

const BurgerIngredients: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const data = useSelector((state: RootState): IIngredient[] => state.ingredients);
  const burgerConstructor = useSelector((state: RootState): IIngredient[] => state.burgerConstructor);
  const currentTab = useSelector((state: RootState): string => state.scrollbarTab);

  const [ingredientCounts, setIngredientCounts] = React.useState<{ [id: string]: number }>({});

  const buns = data.filter((item: IIngredient) => item.type === 'bun');
  const sauces = data.filter((item: IIngredient) => item.type === 'sauce');
  const ingredients = data.filter((item: IIngredient) => item.type === 'main');

  const tabBuns = React.useRef<HTMLDivElement>(null);
  const tabSauces = React.useRef<HTMLDivElement>(null);
  const tabIngredients = React.useRef<HTMLDivElement>(null);

  const scrollToElement = (element: 'buns' | 'sauces' | 'ingredients'): void => {
    if (element === 'buns' && tabBuns.current) {
      tabBuns.current.scrollIntoView({ behavior: 'smooth' });
    } else if (element === 'sauces' && tabSauces.current) {
      tabSauces.current.scrollIntoView({ behavior: 'smooth' });
    } else if (element === 'ingredients' && tabIngredients.current) {
      tabIngredients.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  React.useEffect(() => {
    if (burgerConstructor.length) {
      const counts: { [id: string]: number } = burgerConstructor.reduce(
        (acc: { [id: string]: number }, ingredient: IIngredient) => {
          acc[ingredient._id] = (acc[ingredient._id] || 0) + 1;
          return acc;
        },
        {}
      );
      
      setIngredientCounts(counts);
    }
  }, [burgerConstructor]);
  
  if (!data || data.length === 0) {
    return (
      <div className="display_flex justify-content_center align-items_center width_100 pt-10 pb-10">
        <div className="text text_type_main-default text_color_inactive text-align_center">Нет ингредиентов</div>
      </div>
    );
  }

  const handleOpenModal = (item: IIngredient) => {
    dispatch(setCurrentIngredient(item));
    sessionStorage.setItem('currentIngredient', JSON.stringify(item));
    navigate(`/ingredients/${item._id}`, { state: { background: location } }); // Передаем текущий путь
  };

  return (
    <>
      <section className='max-width_600px width_100 display_inline-flex flex-direction_column height_100 overflow_hidden'>
        <h1 className='text text_type_main-large mt-10 mb-5'>Соберите бургер</h1>
        <div className='ingredients-tab display_flex'>
          <Tab value="buns" active={currentTab === 'buns'} onClick={() => scrollToElement('buns')}>
            Булки
          </Tab>
          <Tab value="sauces" active={currentTab === 'sauces'} onClick={() => scrollToElement('sauces')}>
            Соусы
          </Tab>
          <Tab value="ingredients" active={currentTab === 'ingredients'} onClick={() => scrollToElement('ingredients')}>
            Начинки
          </Tab>
        </div>
        <div className='ingredients-inner overflow-y_auto height_100'>
          <CustomScrollBar>
            <section className='pt-10' ref={tabBuns} data-type="buns">
              <h2 className='text text_type_main-medium'>Булки</h2>
              <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
                {
                  buns.map((item: IIngredient) => (
                    <IngredientItem
                      key={item._id}
                      item={item}
                      count={ingredientCounts[item._id]}
                      onClick={() => handleOpenModal(item)}
                    />
                  ))
                }
              </div>
            </section>
            <section className='pt-10' ref={tabSauces} data-type="sauces">
              <h2 className='text text_type_main-medium'>Соусы</h2>
              <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
                {
                  sauces.map((item: IIngredient) => (
                    <IngredientItem
                      key={item._id}
                      item={item}
                      count={ingredientCounts[item._id]}
                      onClick={() => handleOpenModal(item)}
                    />
                  ))
                }
              </div>
            </section>
            <section className='pt-10' ref={tabIngredients} data-type="ingredients">
              <h2 className='text text_type_main-medium'>Начинки</h2>
              <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
                {
                  ingredients.map((item: IIngredient) => (
                    <IngredientItem
                      key={item._id}
                      item={item}
                      count={ingredientCounts[item._id]}
                      onClick={() => handleOpenModal(item)}
                    />
                  ))
                }
              </div>
            </section>
          </CustomScrollBar>
        </div>
      </section>
    </>
  );
};

export default BurgerIngredients;
