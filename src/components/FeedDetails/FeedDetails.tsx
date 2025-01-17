import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import CustomScrollBar from "../../components/CustomScrollbar/CustomScrollbar";
import styles from "./FeedDetails.module.css";
import { request } from "../../utils/request";

const FeedDetails = () => {
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const ingredients = useSelector((state: RootState) => state.ingredients);
  const orders = useSelector((state: RootState) => state.orders.orders);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!number) return;

    if (location.state?.order) {
      setCurrentOrder(location.state.order);
      setLoading(false);
    } else {
      const foundOrder = orders.find((order) => order.number.toString() === number);

      if (foundOrder) {
        setCurrentOrder(foundOrder);
        setLoading(false);
      } else {
        if (!socketRef.current) {
          const socket = new WebSocket('wss://norma.nomoreparties.space/orders/all');
          socketRef.current = socket;

          socket.onopen = () => {
            console.log('WebSocket соединение установлено');
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.success) {
              const foundOrder = data.orders.find(
                (order: any) => order.number.toString() === number
              );
              if (foundOrder) {
                setCurrentOrder(foundOrder);
                setLoading(false);
                socket.close();
                socketRef.current = null;
              }
            }
          };

          socket.onerror = (error) => {
            console.error('WebSocket ошибка:', error);
          };

          socket.onclose = () => {
            console.log('WebSocket соединение закрыто');
            if (!currentOrder) {
              request(`/api/orders/${number}`)
                .then((response: any) => {
                  if (response.success) {
                    setCurrentOrder(response.orders[0]);
                  } else {
                    setError(true);
                  }
                })
                .catch((err) => {
                  console.error('Ошибка при запросе заказа:', err);
                  setError(true);
                })
                .finally(() => setLoading(false));
            }
          };
        }
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [location.state?.order, number, orders]);

  if (loading) {
    return (
      <div className={`${styles['feed-details__wrapper']}`}>
        <div className={`${styles['feed-details']} width_100`}>
          <div className='text text_type_main-medium'>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className={`${styles['feed-details__wrapper']}`}>
        <div className={`${styles['feed-details']} width_100`}>
          <div className='text text_type_main-medium'>Заказ не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles['feed-details__wrapper']}`}>
      <div className={`${styles['feed-details']} width_100`}>
        <div className="text-align_center text text_type_digits-default mb-10">
          #{currentOrder.number}
        </div>
        <div className="text text_type_main-medium mb-3">{currentOrder.name}</div>
        <div
          className={`${styles['feed-details__status--ready']} text text_type_main-default mb-15`}
        >
          {currentOrder.status === 'done'
            ? 'Выполнен'
            : currentOrder.status === 'pending'
            ? 'В работе'
            : 'Создан'}
        </div>
        <div className="text text_type_main-medium mb-6">Состав:</div>
        <div className="mb-10">
          <CustomScrollBar>
            <div className={`${styles['feed-details__ingredients']}`}>
              {currentOrder.ingredients.map((ingredientId: string, index: number) => {
                const ingredient = ingredients.find(
                  (item) => item._id === ingredientId
                );
                if (!ingredient) return null;

                return (
                  <div
                    key={index}
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
                      1 x {ingredient.price}{" "}
                      <CurrencyIcon className="ml-2" type="primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CustomScrollBar>
        </div>
        <div className="display_flex justify-content_space-between">
          <div className="text text_type_main-default">
            {new Date(currentOrder.createdAt).toLocaleString()}
          </div>
          <div className="display_flex align-items_center text text_type_digits-default">
            {currentOrder.ingredients.reduce((total: number, id: string) => {
              const ingredient = ingredients.find((item) => item._id === id);
              return ingredient ? total + ingredient.price : total;
            }, 0)}
            <CurrencyIcon className="ml-2" type="primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedDetails;
