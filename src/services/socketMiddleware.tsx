import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { RootState } from '../services/store';
import { TWSActions } from '../types/WsActions';

export const socketMiddleware = (wsUrl: string, wsActions: TWSActions): Middleware => {
  return ((store: MiddlewareAPI<Dispatch<AnyAction>, RootState>) => {
    let socket: WebSocket | null = null;
    let currentKey: string = 'all';

    return next => (action: AnyAction) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const {
        wsConnect,
        wsDisconnect,
        wsSendMessage,
        onOpen,
        onClose,
        onError,
        onMessage
      } = wsActions;

      if (type === wsConnect) {
        let url = wsUrl + payload?.path;
        currentKey = payload?.key;

        if (payload?.accessToken) {
          const token = payload.accessToken?.replace('Bearer ', '');
          url += `?token=${token}`;
        }

        socket = new WebSocket(url);
      }

      if (socket) {
        socket.onopen = event => {
          console.log('WebSocket подключен:', event);
          dispatch({ type: onOpen, payload: { type: event.type } });
        };

        socket.onerror = event => {
          console.error('WebSocket ошибка:', event);
          dispatch({
            type: onError,
            payload: {
              type: event.type,
            }
          });
        };

        socket.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            dispatch({ type: onMessage, payload: { ...data, key: currentKey } });
          } catch (err) {
            console.error('Ошибка парсинга данных:', err);
          }
        };

        socket.onclose = event => {
          console.log('WebSocket закрыт:', event);
          dispatch({ type: onClose, payload: { type: event.type } });
        };

        if (type === wsSendMessage) {
          const message = action.payload;
          socket.send(JSON.stringify(message));
        }

        if (type === wsDisconnect) {
          socket.close();
        }
      }

      return next(action);
    };
  }) as Middleware;
};