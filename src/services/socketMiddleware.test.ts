import { describe, it, expect, beforeEach, vi } from 'vitest';
import { socketMiddleware } from './socketMiddleware';
import { createStore, applyMiddleware } from 'redux';
import { WS_CONNECT, WS_DISCONNECT, WS_ON_CLOSE, WS_ON_MESSAGE, WS_ON_OPEN, WS_SEND_MESSAGE, wsActions } from '../actions/WsActions';

const testReducer = (state = {}, action: any) => {
  switch (action.type) {
    case WS_ON_OPEN:
      return { ...state, isConnected: true };
    case WS_ON_CLOSE:
      return { ...state, isConnected: false };
    case WS_ON_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
};

describe('socketMiddleware', () => {
  let store: any;
  let socketMock: any;

  beforeEach(() => {
    socketMock = {
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
      send: vi.fn(),
      close: vi.fn(),
    };

    vi.stubGlobal('WebSocket', vi.fn(() => socketMock));

    const middleware = socketMiddleware('ws://localhost', wsActions);
    store = createStore(testReducer, applyMiddleware(middleware));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('должен открывать соединение с правильным URL', () => {
    store.dispatch({ type: WS_CONNECT, payload: { path: '/test' } });

    expect(WebSocket).toHaveBeenCalledWith('ws://localhost/test');
  });

  it('должен вызывать onOpen при подключении', () => {
    store.dispatch({ type: WS_CONNECT });

    socketMock.onopen?.(new Event('open'));

    expect(store.getState().isConnected).toBe(true);
  });

  it('должен корректно обрабатывать onMessage', () => {
    store.dispatch({ type: WS_CONNECT });

    const message = JSON.stringify({ data: 'test' });
    socketMock.onmessage?.({ data: message } as MessageEvent);

    expect(store.getState().message).toEqual({ data: 'test' });
  });

  it('должен корректно отправлять сообщение', () => {
    store.dispatch({ type: WS_CONNECT });

    const message = { type: 'TEST_MESSAGE' };
    store.dispatch({ type: WS_SEND_MESSAGE, payload: message });

    expect(socketMock.send).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('должен закрывать соединение при wsDisconnect', () => {
    store.dispatch({ type: WS_CONNECT });

    store.dispatch({ type: WS_DISCONNECT });

    expect(socketMock.close).toHaveBeenCalled();
  });
});
