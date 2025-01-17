import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../services/store";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import CustomScrollBar from "../../components/CustomScrollbar/CustomScrollbar";
import styles from "./FeedDetails.module.css";
import { fetchOrderByNumber } from "../../services/ordersReducer";

const FeedDetails = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  // Достаем все заказы из Redux (полученные через socket или HTTP)
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.orders
  );

  // Достаем массив всех ингредиентов
  const ingredients = useSelector((state: RootState) => state.ingredients);

  // Локальный стейт не всегда нужен, можно сразу показывать данные из Redux
  // Но, если хотим "склеить" order из location.state и из Redux — можно:
  const [localOrder, setLocalOrder] = useState<any>(null);
  const [isOrderNotFound, setIsOrderNotFound] = useState(false);

  useEffect(() => {
    if (!number) return;

    // 1. Если мы перешли из "background" (modal), то в location.state.order уже есть заказ
    if (location.state?.order) {
      setLocalOrder(location.state.order);
      return;
    }

    // 2. Иначе ищем заказ в Redux
    const foundOrder = orders.find((o) => o.number.toString() === number);
    if (foundOrder) {
      setLocalOrder(foundOrder);
      return;
    }

    // 3. Если не нашли, диспатчим HTTP-запрос
    dispatch(fetchOrderByNumber(number))
      .unwrap()
      .then((fetchedOrder: any) => {
        if (!fetchedOrder) {
          setIsOrderNotFound(true);
        } else {
          setLocalOrder(fetchedOrder);
        }
      })
      .catch(() => setIsOrderNotFound(true));
  }, [number, location.state?.order, orders, dispatch]);

  // Пока идёт загрузка
  if (!localOrder && isLoading) {
    return (
      <div className={`${styles['feed-details__wrapper']}`}>
        <div className={`${styles['feed-details']} width_100`}>
          <div className='text text_type_main-medium'>Загрузка...</div>
        </div>
      </div>
    );
  }

  // Если ошибка или заказ не найден
  if (isOrderNotFound || (!localOrder && error)) {
    return (
      <div className={`${styles['feed-details__wrapper']}`}>
        <div className={`${styles['feed-details']} width_100`}>
          <div className='text text_type_main-medium'>Заказ не найден</div>
        </div>
      </div>
    );
  }

  if (!localOrder) {
    // Нет ошибки, нет заказа, не идёт загрузка?
    // Может, это состояние "загружаем", можно вернуть "Загрузка..." или пустой div
    return null;
  }

  // -------------------------------------------------
  // Подсчёт и отображение ингредиентов
  // -------------------------------------------------
  const price = useMemo(() => {
    return localOrder.ingredients.reduce((total: number, id: string) => {
      const ingredient = ingredients.find((item) => item._id === id);
      return ingredient ? total + ingredient.price : total;
    }, 0);
  }, [localOrder.ingredients, ingredients]);

  const statusLabel = localOrder.status === 'done'
    ? 'Выполнен'
    : localOrder.status === 'pending'
    ? 'В работе'
    : 'Создан';

  return (
    <div className={`${styles['feed-details__wrapper']}`}>
      <div className={`${styles['feed-details']} width_100`}>
        <div className="text-align_center text text_type_digits-default mb-10">
          #{localOrder.number}
        </div>
        <div className="text text_type_main-medium mb-3">
          {localOrder.name}
        </div>
        <div className={`${styles['feed-details__status--ready']} text text_type_main-default mb-15`}>
          {statusLabel}
        </div>
        <div className="text text_type_main-medium mb-6">Состав:</div>
        <div className="mb-10">
          <CustomScrollBar>
            <div className={`${styles['feed-details__ingredients']}`}>
              {localOrder.ingredients.map((ingredientId: string, index: number) => {
                const ingredient = ingredients.find((item) => item._id === ingredientId);
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
                      1 x {ingredient.price} <CurrencyIcon className="ml-2" type="primary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CustomScrollBar>
        </div>
        <div className="display_flex justify-content_space-between">
          <div className="text text_type_main-default">
            {new Date(localOrder.createdAt).toLocaleString()}
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

export default FeedDetails;
