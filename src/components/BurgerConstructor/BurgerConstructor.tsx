import { Button, CurrencyIcon, DeleteIcon, DragIcon, LockIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import React from 'react';
import styles from './BurgerConstructor.module.css';
import { Ingredient } from '../../types/Ingredient';
import data from '../../utils/data.ts';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar.tsx';

const BurgerIngredient: React.FC<{ item: Ingredient, type?: string }> = ({ item, type }) => {
  const isBun = type === 'buns-top' || type === 'buns-bottom';

  return (
    <div className={`${styles['burger-ingredient']} ${isBun ? styles[`burger-ingredient--${type}`] : ''} ${!isBun ? 'mb-4' : ''} position_relative display_grid align-items_center pl-6 pr-8 pt-4 pb-4 ml-8 mr-4`}>
      {!isBun && <DragIcon type="primary" className={`${styles['burger-dragdrop']} cursor_pointer position_absolute`} />}
      <div className="burger-ingredient-image">
        <img src={item.image_mobile} alt="" width="80" height="40" />
      </div>
      <div className="burger-ingredient-name ml-5 mr-5 text text_type_main-default">
        {item.name} {
          type == 'buns-top' ? '(верх)' : type == 'buns-bottom' ? '(низ)' : ''
        }
      </div>
      <div className="burger-ingredient-price mr-5">
        <bdi className='display_flex align-items_center text text_type_digits-default'>{item.price} <CurrencyIcon type="primary" className='ml-3' /></bdi>
      </div>
      <div className="burger-ingredient-lock">
        {isBun ? <LockIcon type="secondary" /> : <DeleteIcon type="primary" className="cursor_pointer" />}
      </div>
    </div>
  )
}

const BurgerConstructor = () => {
  const buns = data[0];
  const ingredients = [data[5], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8]];

  return (
    <section className={`${styles['burger-ingredients']} max-width_600px width_100 display_grid height_auto overflow_hidden mt-25`}>
      <div className={`display_grid ${styles.burger} overflow_hidden height_100`}>
        <BurgerIngredient key={buns._id + '_top'} item={buns} type="buns-top" />
        <div className="mt-4 mb-4 height_auto overflow_hidden">
          <CustomScrollbar>
            {ingredients.map((item: Ingredient, index: number) => (
              <BurgerIngredient key={item._id + '-' + index} item={item} />
            ))}
          </CustomScrollbar>
        </div>
        <BurgerIngredient key={buns._id + '_bottom'} item={buns} type="buns-bottom" />
      </div>
      <div className="display_flex align-items_start mt-10 mb-10 pr-4">
        <div className="display_flex justify-content_end width_100">
          <div className="mr-10 display_flex align-items_center">
            <bdi className="text text_type_digits-medium mr-2">
              610 <CurrencyIcon type="primary" />
            </bdi>
          </div>
          <div className="create-order">
            <Button htmlType="button" type="primary" size="large">
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BurgerConstructor;