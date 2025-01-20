import { TWSActions } from '../types/WsActions';

export const WS_CONNECT = 'WS_CONNECT';
export const WS_DISCONNECT = 'WS_DISCONNECT';
export const WS_SEND_MESSAGE = 'WS_SEND_MESSAGE';
export const WS_ON_OPEN = 'WS_ON_OPEN';
export const WS_ON_CLOSE = 'WS_ON_CLOSE';
export const WS_ON_ERROR = 'WS_ON_ERROR';
export const WS_ON_MESSAGE = 'WS_ON_MESSAGE';

export const wsActions: TWSActions = {
  wsConnect: WS_CONNECT,
  wsDisconnect: WS_DISCONNECT,
  wsSendMessage: WS_SEND_MESSAGE,
  onOpen: WS_ON_OPEN,
  onClose: WS_ON_CLOSE,
  onError: WS_ON_ERROR,
  onMessage: WS_ON_MESSAGE,
};
