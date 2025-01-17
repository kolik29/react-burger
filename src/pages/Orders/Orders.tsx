// src/pages/Orders.tsx
import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Orders.module.css";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../services/store";
import { logoutUser } from "../../services/authReducer"; // ваша логика выхода
import CustomScrollBar from "../../components/CustomScrollbar/CustomScrollbar";
import Modal from "../../components/Modal/Modal";
import { useModal } from "../../hooks/useModal";
import FeedDetails from "../../components/FeedDetails/FeedDetails";

// Экшены для socketMiddleware
const WS_CONNECTION_START_USER = 'WS_CONNECTION_START_USER';
const WS_CONNECTION_CLOSED = 'WS_CONNECTION_CLOSED';

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { isModalOpen } = useModal();

  // Берём токен из localStorage:
  const accessToken = localStorage.getItem('accessToken');

  // Загружаем список ингредиентов из Redux (или как у вас организовано)
  const allIngredients = useSelector((state: RootState) => state.ingredients);

  // Теперь userOrders берём из нашего userOrdersSlice
  const userOrders = useSelector((state: RootState) => {
    return state.userOrders.orders
  });

  // Если нет токена, перенаправляем на /login
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  // Запускаем подключение к WebSocket (профильные заказы)
  useEffect(() => {
    if (accessToken) {
      // Убираем 'Bearer ' если оно есть
      const cleanedToken = accessToken.replace('Bearer ', '');

      // Диспатчим экшен, который увидит socketMiddleware
      dispatch({
        type: WS_CONNECTION_START_USER,
        payload: { token: cleanedToken }
      });

      // Когда компонент размонтируется — закрыть соединение
      return () => {
        dispatch({ type: WS_CONNECTION_CLOSED });
      };
    }
  }, [accessToken, dispatch]);

  // Обработчик выхода из системы
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error('Ошибка при выходе:', error);
        alert('Ошибка при выходе из системы');
      });
  };

  // При клике по заказу – переходим на страницу деталей
  const handleOrderClick = (order: any) => {
    navigate(`/profile/orders/${order.number}`, {
      state: { background: location, order }
    });
  };

  const handleCloseModal = () => {
    navigate('/profile/orders');
  };

  // Подсчёт суммы заказа
  const getOrderPrice = (ingredients: string[]) =>
    ingredients.reduce((total, id) => {
      const ingredient = allIngredients.find((item) => item._id === id);
      return ingredient ? total + ingredient.price : total;
    }, 0);

  // Если токена нет, можно вернуть null или редирект
  if (!accessToken) {
    return null;
  }

  return (
    <>
      <div className="wrapper overflow_hidden height_100">
        <main className="container display_flex flex-direction_column height_100">
          <div className="display_flex justify-content_center align-items_center height_100">
            <div className={`${styles['profile']} display_flex mt-30 width_100`}>
              {/* Левая колонка меню */}
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
                    onClick={handleLogout}
                  >
                    Выход
                  </NavLink>
                </div>
                <p className="mt-20 text_color_inactive">
                  В этом разделе вы можете просмотреть свою историю заказов
                </p>
              </div>

              {/* Правая колонка – список заказов пользователя */}
              <div className={`${styles['profile-right']} width_100`}>
                <CustomScrollBar>
                  {userOrders.map((order) => (
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

                      {/* Статус: 'done', 'pending', 'created' и т.п. */}
                      <div className={`${styles['feed-item__status--ready']} text text_type_main-default mb-6`}>
                        {order.status === 'done'
                          ? 'Выполнен'
                          : order.status === 'pending'
                          ? 'В работе'
                          : 'Создан'}
                      </div>

                      <div className="display_flex justify-content_space-between">
                        <div className="display_flex">
                          {order.ingredients.slice(0, 5).map((ingredientId: any, index: number) => {
                            const img = allIngredients.find((item) => item._id === ingredientId)?.image || '';
                            return (
                              <div
                                key={index}
                                className={`${styles['ingredients__item']} position_relative`}
                              >
                                <div
                                  className={`${styles['ingredients__image']} position_absolute display_flex justify-content_center align-items_center`}
                                >
                                  <img className="width_100 height_100" src={img} alt="" />
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
                          {getOrderPrice(order.ingredients)}
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
          <FeedDetails />
        </Modal>
      )}
    </>
  );
};

export default Orders;
