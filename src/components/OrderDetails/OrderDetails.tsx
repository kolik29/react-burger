import React from 'react';
import styles from './OrderDetails.module.css';
import order_done__bg1 from '../../images/order_done__bg1.svg';
import order_done__bg2 from '../../images/order_done__bg2.svg';
import order_done__bg3 from '../../images/order_done__bg3.svg';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

const OrderDetails: React.FC = () => {
  const data = useSelector((state: any) => state.order);

  return (
    <div className="pt-30 pb-30 pr-20 pl-20">
      <div className={`${styles.order_code} text text_type_digits-large text-align_center`}>{data}</div>
      <div className="text text_type_main-medium text-align_center mt-8">идентификатор заказа</div>
      <div className={`${styles.order_done} display_flex align-items_center justify-content_center mt-15 mb-15 position_relative`}>
        <img src={order_done__bg1} alt="done" className="position_absolute" />
        <img src={order_done__bg2} alt="done" className="position_absolute" />
        <img src={order_done__bg3} alt="done" className="position_absolute" />
        <CheckMarkIcon type="primary" />
      </div>
      <div className="text text_type_main-default text-align_center mb-2">Ваш заказ начали готовить</div>
      <div className="text text_type_main-default text_color_inactive text-align_center">Дождитесь готовности на орбитальной станции</div>
    </div>
  );
}

export default OrderDetails;