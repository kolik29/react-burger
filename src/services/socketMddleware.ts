// src/services/socketMiddleware.ts
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

const WS_CONNECTION_START = 'WS_CONNECTION_START';           // Общая лента, если есть
const WS_CONNECTION_START_USER = 'WS_CONNECTION_START_USER'; // Лента заказов пользователя
const WS_CONNECTION_SUCCESS = 'WS_CONNECTION_SUCCESS';
const WS_CONNECTION_ERROR = 'WS_CONNECTION_ERROR';
const WS_CONNECTION_CLOSED = 'WS_CONNECTION_CLOSED';
const WS_GET_MESSAGE = 'WS_GET_MESSAGE';                     // Общая лента (Feed)
const WS_GET_USER_ORDERS = 'WS_GET_USER_ORDERS';             // Заказы пользователя
const WS_SEND_MESSAGE = 'WS_SEND_MESSAGE';
const WS_SEND_USER_MESSAGE = 'WS_SEND_USER_MESSAGE';         // Если надо что-то отправлять от пользователя

export const socketMiddleware = (): Middleware => {
  let socket: WebSocket | null = null;

  return (store: MiddlewareAPI) => next => action => {
    const { dispatch } = store;
    const { type, payload }: any = action;

    switch (type) {
      // -------------------------------
      // 1) Общая лента (пример)
      // -------------------------------
      case WS_CONNECTION_START: {
        socket = new WebSocket(`wss://norma.nomoreparties.space/orders/all`);
        initSocketHandlers(socket, dispatch, WS_GET_MESSAGE);
        break;
      }

      // -------------------------------
      // 2) Профиль пользователя
      // -------------------------------
      case WS_CONNECTION_START_USER: {
        // payload может содержать токен
        const token = payload?.token;
        // Открываем сокет с токеном
        socket = new WebSocket(`wss://norma.nomoreparties.space/orders?token=${token}`);
        initSocketHandlers(socket, dispatch, WS_GET_USER_ORDERS);
        break;
      }

      // -------------------------------
      // Закрыть соединение
      // -------------------------------
      case WS_CONNECTION_CLOSED: {
        if (socket) {
          socket.close();
        }
        socket = null;
        break;
      }

      // -------------------------------
      // Отправить сообщение (общий канал)
      // -------------------------------
      case WS_SEND_MESSAGE: {
        if (socket) {
          socket.send(JSON.stringify(payload));
        }
        break;
      }

      // -------------------------------
      // Отправить сообщение (пользователь)
      // -------------------------------
      case WS_SEND_USER_MESSAGE: {
        if (socket) {
          socket.send(JSON.stringify(payload));
        }
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};

/**
 * Хелпер, который вешает обработчики onopen, onmessage, onerror, onclose
 * на созданный сокет, чтобы не дублировать логику.
 */
function initSocketHandlers(
  socket: WebSocket,
  dispatch: Function,
  messageType: string
) {
  socket.onopen = event => {
    dispatch({ type: WS_CONNECTION_SUCCESS, payload: event });
  };
  socket.onerror = event => {
    dispatch({ type: WS_CONNECTION_ERROR, payload: event });
  };
  socket.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      console.log(data)
      dispatch({ type: messageType, payload: data });
    } catch (error) {
      console.error('Ошибка парсинга WebSocket сообщения:', error);
    }
  };
  socket.onclose = event => {
    dispatch({ type: WS_CONNECTION_CLOSED, payload: event });
  };
}
