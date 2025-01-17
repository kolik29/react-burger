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

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isModalOpen } = useModal();

  useEffect(() => {
    dispatch({ type: 'WS_CONNECTION_START' });
    return () => {
      dispatch({ type: 'WS_CONNECTION_CLOSED' });
    };
  }, [dispatch]);

  const { orders, total, totalToday } = useSelector((state: RootState) => state.orders);
  const ingredients = useSelector((state: RootState) => state.ingredients);

  const calculateOrderPrice = (ingredientIds: string[]) => {
    return ingredientIds.reduce((sum, id) => {
      const ing = ingredients.find((item: any) => item._id === id);
      return ing ? sum + ing.price : sum;
    }, 0);
  };

  const getIngredientImage = (id: string) => {
    const ing = ingredients.find((item: any) => item._id === id);
    return ing ? ing.image : '';
  };

  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const createdOrders = orders.filter((order) => order.status === 'created');

  const splitIntoColumns = (arr: any[]) => {
    const columns = [];
    for (let i = 0; i < arr.length; i += 10) {
      columns.push(arr.slice(i, i + 10));
    }
    return columns;
  };

  const pendingColumns = splitIntoColumns(pendingOrders);
  const createdColumns = splitIntoColumns(createdOrders);

  const handleOrderClick = (order: any) => {
    navigate(`/feed/${order.number}`, {
      state: { order, background: location },
    });
  };

  const handleCloseModal = () => {
    navigate('/feed');
  };

  const renderOrderColumns = (columns: any[], className: string) =>
    columns.map((column, colIndex) => (
      <div key={colIndex} className="feed-numbers__column mr-4">
        {column.map((order: any) => (
          <div key={order._id} className={`${className} text text_type_digits-default`}>
            {order.number}
          </div>
        ))}
      </div>
    ));

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
                        <div className="text text_type_main-default">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="text text_type_main-medium mt-6 mb-6">{order.name}</div>

                      <div className="display_flex justify-content_space-between">
                        <div className="display_flex">
                          {order.ingredients.slice(0, 5).map((ingredientId: any, index: number) => (
                            <div key={index} className={`${styles['ingredients__item']} position_relative`}>
                              <div
                                className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}
                              >
                                <img
                                  className="width_100 height_100"
                                  src={getIngredientImage(ingredientId)}
                                  alt="ingredient"
                                />
                              </div>
                            </div>
                          ))}
                          {order.ingredients.length > 5 && (
                            <div className={`${styles['ingredients__item']} position_relative`}>
                              <div
                                className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}
                              >
                                <img
                                  className="width_100 height_100"
                                  src={getIngredientImage(order.ingredients[5])}
                                  alt="ingredient"
                                />
                                <span className={` ${styles['ingredients__item-more']} width_100 height_100 display_flex justify-content_center align-items_center text text_type_digits-default position_absolute`}>
                                  +{order.ingredients.length - 5}
                                </span>
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
                    {renderOrderColumns(pendingColumns, styles['feed-numbers__ready'])}
                  </div>
                </div>

                <div className="feed-numbers__list">
                  <div className="text text_type_main-medium mb-6">В работе</div>
                  <div className="feed-numbers__list-body display_flex">
                    {renderOrderColumns(createdColumns, styles['feed-numbers__ready'])}
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
  );
}

export default Feed;