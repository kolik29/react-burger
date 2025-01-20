import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './Orders.module.css';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import CustomScrollBar from '../../components/CustomScrollbar/CustomScrollbar';
import Modal from '../../components/Modal/Modal';
import { RootState } from '../../services/store';
import { useModal } from '../../hooks/useModal';
import { calculateOrderPrice, getIngredientImage } from '../../utils/orders';
import useLogout from '../../hooks/useLogout';
import { useEffect } from 'react';
import { UserOrderDetails } from '../../components/FeedDetails/FeedDetails';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { Order } from '../../types/Order';
import { WS_CONNECT, WS_DISCONNECT } from '../../actions/WsActions';

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const data = useAppSelector((state: RootState) => state.orders.user);

  const orders = data.orders.filter((order) => !!order);

  const handleOrderClick = (order: Order) => {
    navigate(`/profile/orders/${order.number}`, {
      state: { background: location, order }
    });
  };

  const ingredients = useAppSelector((state: RootState) => state.ingredients);

  const { isModalOpen } = useModal();

  const handleCloseModal = () => {
    navigate('/profile/orders');
  };
  
  const accessToken = localStorage.getItem('accessToken');
  
  useEffect(() => {
    dispatch({ type: WS_CONNECT, payload: { path: '/orders', accessToken: accessToken, key: 'user' } });
  
    return () => {
      dispatch({ type: WS_DISCONNECT });
    };
  }, [dispatch])

  return (
    <>
      <div className="wrapper overflow_hidden height_100">
        <main className="container display_flex flex-direction_column height_100">
          <div className="display_flex justify-content_center align-items_center height_100">
            <div className={`${styles['profile']} display_flex mt-30 width_100`}>
              <div className={`${styles['profile-left']} mr-15 text text_type_main-default`}>
                <div className="display_flex flex-direction_column">
                  <NavLink
                    to="/profile"
                    end
                    className={({ isActive }) =>
                      `${isActive ? styles['navlink-active'] : ''} ${styles['navlink']} text text_type_main-medium`
                    }
                  >
                    Профиль
                  </NavLink>
                  <NavLink
                    to="/profile/orders"
                    end
                    className={({ isActive }) =>
                      `${isActive ? styles['navlink-active'] : ''} ${styles['navlink']} text text_type_main-medium`
                    }
                  >
                    История заказов
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={`${styles['navlink']} text text_type_main-medium`}
                    onClick={useLogout}
                  >
                    Выход
                  </NavLink>
                </div>
                <p className="mt-20 text_color_inactive">
                  В этом разделе вы можете просмотреть свою историю заказов
                </p>
              </div>

              <div className={`${styles['profile-right']} width_100`}>
                <CustomScrollBar>
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className={`p-6 ${styles['feed-item']} mb-6 mr-4 cursor_pointer`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="display_flex justify-content_space-between">
                        <div className="text text_type_digits-default">#{order.number}</div>
                        <div className="text text_type_main-default">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="text text_type_main-medium mt-6 mb-2">{order.name}</div>

                      <div className={`${styles['feed-item__status--ready']} text text_type_main-default mb-6`}>
                        {order.status === 'done'
                          ? 'Выполнен'
                          : order.status === 'pending'
                          ? 'В работе'
                          : 'Создан'}
                      </div>

                      <div className="display_flex justify-content_space-between">
                        <div className="display_flex">
                          {order.ingredients.slice(0, 5).map((ingredientId: string, index: number) => {
                            return (
                              <div
                                key={index}
                                className={`${styles['ingredients__item']} position_relative`}
                              >
                                <div
                                  className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}
                                >
                                  <img className="width_100 height_100" src={getIngredientImage(ingredientId, ingredients)} alt="" />
                                </div>
                              </div>
                            );
                          })}
                          {order.ingredients.length > 5 && (
                            <div className={`${styles['ingredients__item-more']} position_relative`}>
                              <div
                                className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}
                              >
                                <span className="text text_type_digits-default">
                                  +{order.ingredients.length - 5}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text text_type_digits-default display_flex align-items_center">
                          {calculateOrderPrice(order.ingredients, ingredients)}
                          <CurrencyIcon type="primary" className="ml-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CustomScrollBar>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} onClose={handleCloseModal}>
          <UserOrderDetails />
        </Modal>
      )}
    </>
  );
};

export default Orders;