import { Button, ConstructorElement, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { Ingredient } from '../../types/Ingredient';
import data from '../../utils/data.ts';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar.tsx';

const BurgerConstructor = () => {
  const buns = data[0];
  const ingredients = [data[5], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8]];

  return (
    <section className={`${styles['burger-ingredients']} max-width_600px width_100 display_grid height_auto overflow_hidden mt-25`}>
      <div className={`display_grid ${styles.burger} overflow_hidden height_100`}>
        <div className="position_relative display_flex align-items_center justify-content_end pl-8 pr-4">
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${buns.name} (верх)`}
            price={buns.price}
            thumbnail={buns.image_mobile}
            key={buns._id + '_top'}
          />
        </div>
        <div className="mt-4 mb-4 height_auto overflow_hidden">
          <CustomScrollbar>
            {ingredients.map((item: Ingredient, index: number) => (
              <div className={`${styles['burger-ingredient']} position_relative display_flex align-items_center justify-content_end pl-8 pr-4 pb-2 pt-2`}>
                <DragIcon type="primary" className={`${styles['burger-dragdrop']} cursor_pointer position_absolute`} />
                <ConstructorElement
                  text={item.name}
                  price={item.price}
                  thumbnail={item.image_mobile}
                  key={item._id + '_' + index}
                />
              </div>
            ))}
          </CustomScrollbar>
        </div>
        <div className="position_relative display_flex align-items_center justify-content_end pl-8 pr-4">
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${buns.name} (низ)`}
            price={buns.price}
            thumbnail={buns.image_mobile}
            key={buns._id + '_bottom'}
          />
        </div>
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