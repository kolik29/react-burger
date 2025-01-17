import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Feed.module.css';
import CustomScrollBar from '../../components/CustomScrollbar/CustomScrollbar';
import Modal from '../../components/Modal/Modal';
import { useModal } from '../../hooks/useModal';
import { useLocation, useNavigate } from 'react-router-dom';
import FeedDetails from '../../components/FeedDetails/FeedDetails';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { useEffect } from 'react';
import { setOrders } from '../../services/ordersReducer';

const Feed = () => {
  const { isModalOpen } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orders = useSelector((state: RootState) => state.orders.orders);
  const total = useSelector((state: RootState) => state.orders.total);
  const totalToday = useSelector((state: RootState) => state.orders.totalToday);
  const ingredients = useSelector((state: RootState) => state.ingredients);

  useEffect(() => {
    const socket = new WebSocket('wss://norma.nomoreparties.space/orders/all');

    socket.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        dispatch(setOrders({ orders: data.orders, total: data.total, totalToday: data.totalToday }));
      }
    };

    socket.onerror = (error) => {
      console.log('WebSocket ошибка:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  const handleOrderClick = (order: any) => {
    navigate(`/feed/${order.number}`, { state: { order, background: location } });
  };

  const handleCloseModal = () => {
    navigate('/feed');
  };

  const calculateOrderPrice = (ingredientIds: string[]) => {
    return ingredientIds.reduce((total, id) => {
      const ingredient = ingredients.find((item) => item._id === id);
      return ingredient ? total + ingredient.price : total;
    }, 0);
  };

  const getIngredientImage = (id: string) => {
    const ingredient = ingredients.find((item) => item._id === id);
    return ingredient ? ingredient.image : '';
  };

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const createdOrders = orders.filter((order) => order.status === 'created');

  const splitIntoColumns = (ordersArray: typeof orders) => {
    const columns = [];
    for (let i = 0; i < ordersArray.length; i += 10) {
      columns.push(ordersArray.slice(i, i + 10));
    }
    return columns;
  };

  const pendingColumns = splitIntoColumns(pendingOrders);
  const createdColumns = splitIntoColumns(createdOrders);

  return (
    <>
      <div className="wrapper overflow_hidden height_100">
        <main className="container display_flex flex-direction_column height_100">
          <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
          <div className="display_flex justify-content_space-between height_100 overflow_hidden">
            <section className="max-width_600px width_100 display_inline-flex flex-direction_column height_100 overflow_hidden">
              <CustomScrollBar>
                {orders && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div
                      key={order._id}
                      className={`p-6 ${styles['feed-item']} mb-6 mr-4 cursor_pointer`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="display_flex justify-content_space-between">
                        <div className="text text_type_digits-default">#{order.number}</div>
                        <div className="text text_type_main-default">{new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text text_type_main-medium mt-6 mb-6">{order.name}</div>
                      <div className="display_flex justify-content_space-between">
                        <div className="display_flex">
                          {order.ingredients.slice(0, 5).map((ingredientId: any, index: number) => (
                            <div key={index} className={`${styles['ingredients__item']} position_relative`}>
                              <div className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}>
                                <img className="width_100 height_100" src={getIngredientImage(ingredientId)} alt="ingredient" />
                              </div>
                            </div>
                          ))}
                          {order.ingredients.length > 5 && (
                            <div className={`${styles['ingredients__item-more']} position_relative`}>
                              <div className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}>
                                <span className="text text_type_digits-default">+{order.ingredients.length - 5}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text text_type_digits-default display_flex align-items_center">
                          {calculateOrderPrice(order.ingredients)}
                          <CurrencyIcon type="primary" className="ml-3" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text text_type_main-medium">Нет заказов</div>
                )}
              </CustomScrollBar>
            </section>
            <section className="max-width_600px width_100 display_inline-flex flex-direction_column height_100 overflow_hidden">
              <div className={`${styles['feed-numbers']} display_grid mb-15`}>
                <div className="feed-numbers__list">
                  <div className="text text_type_main-medium mb-6">Готовы</div>
                  <div className="feed-numbers__list-body display_flex">
                    {pendingColumns.map((column: any, colIndex: number) => (
                      <div key={colIndex} className="feed-numbers__column mr-4">
                        {column.map((order: any) => (
                          <div
                            key={order._id}
                            className={`${styles['feed-numbers__ready']} text text_type_digits-default`}
                          >
                            {order.number}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="feed-numbers__list">
                  <div className="text text_type_main-medium mb-6">В работе</div>
                  <div className="feed-numbers__list-body display_flex">
                    {createdColumns.map((column: any, colIndex: number) => (
                      <div key={colIndex} className="feed-numbers__column mr-4">
                        {column.map((order: any) => (
                          <div
                            key={order._id}
                            className={`${styles['feed-numbers__ready']} text text_type_digits-default`}
                          >
                            {order.number}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-15">
                <div className="text text_type_main-large">Выполнено за все время:</div>
                <div className="text text_type_digits-large">{total}</div>
              </div>
              <div>
                <div className="text text_type_main-large">Выполнено за сегодня:</div>
                <div className="text text_type_digits-large">{totalToday}</div>
              </div>
            </section>
          </div>
        </main>
      </div>
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} onClose={handleCloseModal}>
          <FeedDetails />
        </Modal>
      )}
    </>
  )
}

export default Feed;