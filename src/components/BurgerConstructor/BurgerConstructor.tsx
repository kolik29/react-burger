import React from 'react';
import { Button, ConstructorElement, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { IIngredient } from '../../types/Ingredient';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar.tsx';
import OrderDetails from '../OrderDetails/OrderDetails.tsx';
import { useModal } from '../../hooks/useModal.tsx';
import Modal from '../Modal/Modal.tsx';

const BurgerConstructor: React.FC<{ data: IIngredient[] }> = ({ data }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const [orderCode, setOrderCode] = React.useState<string | null>(null);

  const handleOpenModal = () => {
    openModal();
    setOrderCode(Math.round(Math.random() * 10000).toString().padStart(6, '0'));
  };

  const handleCloseModal = () => {
    closeModal();
    setOrderCode(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="display_flex justify-content_center align-items_center width_100 pt-10 pb-10">
        <div className="text text_type_main-default text_color_inactive text-align_center">Нет ингредиентов</div>
      </div>
    );
  }

  const buns = data[0];
  const currentIngredients = [data[5], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8], data[4], data[7], data[8], data[8]];

  return (
    <>
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
              {currentIngredients.map((item: IIngredient, index: number) => (
                <div
                  key={item._id + '_' + index}
                  className={`${styles['burger-ingredient']} position_relative display_flex align-items_center justify-content_end pl-8 pr-4 pb-2 pt-2`}
                >
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
              <Button htmlType="button" type="primary" size="large" onClick={handleOpenModal}>
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      </section>
      {
        (isModalOpen && orderCode) &&
          <Modal isModalOpen={isModalOpen} onClose={handleCloseModal}>
            <OrderDetails orderCode={orderCode} />
          </Modal>
      }
    </>
  );
};

export default BurgerConstructor;