import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import CustomScrollBar from '../CustomScrollbar/CustomScrollbar';
import styles from './FeedDetails.module.css';
import { RootState } from '../../services/store';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber, selectOrderByNumber } from '../../services/ordersReducer';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { IFeedDetailsProps } from '../../types/FeedDetailsProps';
import { WS_CONNECT, WS_DISCONNECT } from '../../actions/WsActions';

export const AllOrderDeatils: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ 
      type: WS_CONNECT, 
      payload: { path: '/orders/all', key: 'all' } 
    });

    return () => {
      dispatch({ type: WS_DISCONNECT });
    };
  }, [dispatch]);

  return (<FeedDetails feedKey="all" />);
}

export const UserOrderDetails: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken')?.replace('Bearer ', '');

    dispatch({ 
      type: WS_CONNECT, 
      payload: { path: '/orders', key: 'user', accessToken: token } 
    });

    return () => {
      dispatch({ type: WS_DISCONNECT });
    };
  }, [dispatch]);

  return (<FeedDetails feedKey="user" />);
}

export const FeedDetails: React.FC<IFeedDetailsProps> = ({ feedKey }) => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const dispatch = useAppDispatch();

  const order = useAppSelector((state: RootState) => selectOrderByNumber(state.orders[feedKey].orders, orderNumber));
  const ingredients = useAppSelector((state: RootState) => state.ingredients);
  
  useEffect(() => {
    if (!order) {
      dispatch(fetchOrderByNumber({ number: orderNumber, key: feedKey }));
    }
  }, [order, orderNumber, feedKey, dispatch]);

  const groupedIngredients = useMemo(() => {
    if (!order) return [];

    const counts: { [key: string]: number } = {};

    order.ingredients.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });

    return Object.entries(counts).map(([id, count]) => {
      const ingredient = ingredients.find((item) => item._id === id);
      return { ...ingredient, count };
    });
  }, [order, ingredients]);

  const price = useMemo(() => {
    return groupedIngredients.reduce((acc, ingredient: any) => {
      if (ingredient) {
        return acc + ingredient.price * ingredient.count;
      }
      return acc;
    }, 0);
  }, [groupedIngredients]);

  if (!order) {
    return <div className="text text_type_main-medium">Заказ не найден</div>;
  }

  return (
    <div className={`${styles['feed-details__wrapper']}`}>
      <div className={`${styles['feed-details']} width_100`}>
        <div className="text-align_center text text_type_digits-default mb-10">
          #{order.number}
        </div>
        <div className="text text_type_main-medium mb-3">
          {order.name}
        </div>
        <div className={`${styles['feed-details__status--ready']} text text_type_main-default mb-15`}>
          {order.status}
        </div>
        <div className="text text_type_main-medium mb-6">Состав:</div>
        <div className="mb-10">
          <CustomScrollBar>
            <div className={`${styles['feed-details__ingredients']}`}>
              {groupedIngredients.map((ingredient: any & { count: number }) => {
                if (!ingredient) return null;

                return (
                  <div
                    key={ingredient._id}
                    className={`${styles['feed-details__ingredients-item']} display_grid align-items_center mt-4 mb-4 mr-8`}
                  >
                    <div className={`${styles['ingredients-item__image']} position_relative`}>
                      <div
                        className={`${styles['ingredients-item__image-inner']} position_absolute display_flex justify-content_center align-items_center`}
                      >
                        <img
                          className="width_100 height_100"
                          src={ingredient.image}
                          alt={ingredient.name}
                        />
                      </div>
                    </div>
                    <div className="ingredients-item__name ml-4 mr-4 text text_type_main-default">
                      {ingredient.name}
                    </div>
                    <div className="display_flex align-items_center text text_type_digits-default">
                      {ingredient.count} x {ingredient.price} <CurrencyIcon className="ml-2" type="primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CustomScrollBar>
        </div>
        <div className="display_flex justify-content_space-between">
          <div className="text text_type_main-default">
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="display_flex align-items_center text text_type_digits-default">
            {price}
            <CurrencyIcon className="ml-2" type="primary" />
          </div>
        </div>
      </div>
    </div>
  );
};