import React from 'react';
import { Tab, CurrencyIcon, Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import data from '../../utils/data.ts';
import { Ingredient } from '../../types/Ingredient';
import CustomScrollBar from '../CustomScrollbar/CustomScrollbar.tsx';

const IngredientItem: React.FC<{ item: Ingredient, count: number }> = ({ item, count }) => (
  <div key={item._id} className={`${styles.ingredients_item} mr-3 ml-3 mb-8 position_relative`}>
    {
      count > 0 &&
      <Counter count={count} size="default" />
    }
    <div className='display_flex justify-content_center'>
      <img src={item.image} className='width_100' alt={item.name} width="240" height="120" />
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
)

const BurgerIngredients = () => {
  const [current, setCurrent] = React.useState('buns');

  const buns = data.filter((item: any) => item.type === 'bun');
  const sauces = data.filter((item: any) => item.type === 'sauce');
  const ingredients = data.filter((item: any) => item.type === 'main');

  const tabBuns = React.useRef<HTMLDivElement>(null);
  const tabSauces = React.useRef<HTMLDivElement>(null);
  const tabIngredients = React.useRef<HTMLDivElement>(null);

  const scrollToElement = (element: any) => {
    setCurrent(element);

    if (element === 'buns' && tabBuns.current) {
      tabBuns.current.scrollIntoView({ behavior: 'smooth' });
    } else if (element === 'sauces' && tabSauces.current) {
      tabSauces.current.scrollIntoView({ behavior: 'smooth' });
    } else if (element === 'ingedients' && tabIngredients.current) {
      tabIngredients.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className='max-width_600px width_100 display_inline-flex flex-direction_column height_100 overflow_hidden'>
      <h1 className='text text_type_main-large mt-10 mb-5'>Соберите бургер</h1>
      <div className='ingredients-tab display_flex'>
        <Tab value="buns" active={current === 'buns'} onClick={() => scrollToElement('buns')}>
          Булки
        </Tab>
        <Tab value="sauces" active={current === 'sauces'} onClick={() => scrollToElement('sauces')}>
          Соусы
        </Tab>
        <Tab value="ingedients" active={current === 'ingedients'} onClick={() => scrollToElement('ingedients')}>
          Начинки
        </Tab>
      </div>
      <div className='ingredients-inner overflow-y_auto height_100'>
        <CustomScrollBar>
          <section className='mt-10' ref={tabBuns}>
            <h2 className='text text_type_main-medium'>Булки</h2>
            <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
              {
                buns.map((item: any) => (
                  <IngredientItem key={item._id} item={item} count={Math.floor(Math.random() * 5)} />
                ))
              }
            </div>
          </section>
          <section className='mt-10' ref={tabSauces}>
            <h2 className='text text_type_main-medium'>Соусы</h2>
            <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
              {
                sauces.map((item: any) => (
                  <IngredientItem key={item._id} item={item} count={Math.floor(Math.random() * 5)} />
                ))
              }
            </div>
          </section>
          <section className='mt-10' ref={tabIngredients}>
            <h2 className='text text_type_main-medium'>Начинки</h2>
            <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
              {
                ingredients.map((item: any) => (
                  <IngredientItem key={item._id} item={item} count={Math.floor(Math.random() * 5)} />
                ))
              }
            </div>
          </section>
        </CustomScrollBar>
      </div>
    </section>
  );
};

export default BurgerIngredients;