import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FeedDetails from "../../components/FeedDetails/FeedDetails";

const OrderDetail = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    const cleanedToken = accessToken.replace('Bearer ', '');
    const socketUrl = `wss://norma.nomoreparties.space/orders?token=${cleanedToken}`;

    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.success) {
        const foundOrder = data.orders.find((o: any) => o.number.toString() === number);

        if (foundOrder) {
          setOrder(foundOrder);
        }

        setLoading(false);
      } else {
        console.error('Ошибка загрузки заказов:', data);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    return () => {
      socket.close();
    };
  }, [number, navigate]);

  if (loading) {
    return (
      <div className="display_flex align-items_center justify-content_center height_100">
        <div className="text text_type_main-medium">Загрузка...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="wrapper overflow_hidden height_100">
        <main className="container display_flex flex-direction_column align-items_center justify-content_center height_100">
          <h1 className="text text_type_main-large mb-10">Заказ не найден</h1>
          <p className="text text_type_main-default text_color_inactive mb-10">
            Возможно, вы пытаетесь открыть заказ, который вам не принадлежит, или он не существует.
          </p>
          <button
            className="button button_type_primary"
            onClick={() => navigate("/profile/orders")}
          >
            Вернуться к списку заказов
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex align-items_center justify-content_center height_100">
        <FeedDetails />
      </main>
    </div>
  );
};

export default OrderDetail;
