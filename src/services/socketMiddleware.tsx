import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from 'redux';
import { RootState } from '../services/store';
import { setOrders } from './ordersReducer';

const BASE_URL = 'wss://norma.nomoreparties.space';

export const socketMiddleware = (): Middleware => {
  return ((store: MiddlewareAPI<Dispatch<AnyAction>, RootState>) => {
    let socket: WebSocket | null = null;
    let currentKey: string = 'all';
    
    return next => (action: AnyAction) => {
      const { dispatch } = store;
      const { type, payload } = action;

      if (type === 'WS_CONNECT') {
        let url = BASE_URL + payload?.path;
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
        };
        
        socket.onerror = event => {
          console.error('WebSocket ошибка:', event);
        };
        
        socket.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            
            if (data) {
              dispatch(setOrders({
                orders: data.orders,
                total: data.total,
                totalToday: data.totalToday,
                key: currentKey
              }));
            }
          } catch (err) {
            console.error('Ошибка парсинга данных:', err);
          }
        };
        
        socket.onclose = event => {
          console.log('WebSocket закрыт:', event);
        };
        
        if (type === 'WS_SEND_MESSAGE') {
          const message = action.payload;
          socket.send(JSON.stringify(message));
        }
        
        if (type === 'WS_DISCONNECT') {
          socket.close();
        }
      }
      
      return next(action);
    };
  }) as Middleware;
};
