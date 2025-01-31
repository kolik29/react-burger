import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { checkAndRefreshTokens, getUser, initialState, logoutUser, registerUser, setForgotPasswordCompleted } from './authReducer';
import { configureStore } from '@reduxjs/toolkit';

const setupStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

describe('authSlice', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    localStorage.clear();
  });

  it('должен возвращать initial state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state).toBe(initialState);
  });

  it('должен установить forgotPasswordCompleted', () => {
    const previousState = { forgotPasswordCompleted: false } as any;
    const newState = authReducer(previousState, setForgotPasswordCompleted(true));
    expect(newState.forgotPasswordCompleted).toBe(true);
  });

  it('должен успешно зарегистрировать пользователя', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };
  
    const result = await store.dispatch(registerUser(userData)).unwrap();
  
    expect(result).toEqual({
      user: { id: '12345', email: 'newuser@example.com', name: 'New User' },
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123',
    });
  
    const state = store.getState().auth;
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(result.user);
    expect(state.accessToken).toBe(result.accessToken);
    expect(state.refreshToken).toBe(result.refreshToken);
    expect(state.error).toBeNull();
    expect(localStorage.getItem('accessToken')).toBe('access-token-123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token-123');
  });
  
  it('должен успешно авторизвать пользователя', async () => {
    const userData = {
      email: 'user@example.com',
      password: 'password123',
    };
  
    const result = await store.dispatch(registerUser(userData)).unwrap();

    expect(result).toEqual({
      user: { id: '12345', email: 'user@example.com' },
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123',
    });
  
    const state = store.getState().auth;
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(result.user);
    expect(state.accessToken).toBe(result.accessToken);
    expect(state.refreshToken).toBe(result.refreshToken);
    expect(state.error).toBeNull();
    expect(localStorage.getItem('accessToken')).toBe('access-token-123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token-123');

    describe('другие действия', () => {
      it('должен успешно обновить токены', async () => {
        await store.dispatch(checkAndRefreshTokens()).unwrap();
      
        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.user).toBe(null);
        expect(state.accessToken).toBe('new-access-token-456');
        expect(state.refreshToken).toBe('new-refresh-token-456');
        expect(state.error).toBeNull();
        expect(localStorage.getItem('accessToken')).toBe('new-access-token-456');
      });

      it('должен получить пользователя', async () => {
        const result = await store.dispatch(getUser()).unwrap();

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(result);
        expect(state.accessToken).toBe('new-access-token-456');
        expect(state.refreshToken).toBe('new-refresh-token-456');
        expect(state.error).toBeNull();
        expect(localStorage.getItem('accessToken')).toBe('new-access-token-456');
      });

      it('должен успешно обновить пользователя', async () => {
        const userData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        };
  
        const result = await store.dispatch(registerUser(userData)).unwrap();
  
        await store.dispatch(getUser()).unwrap();
  
        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(result.user);
        expect(state.accessToken).toBe('new-access-token-456');
        expect(state.refreshToken).toBe('new-refresh-token-456');
        expect(state.error).toBeNull();
        expect(localStorage.getItem('accessToken')).toBe('new-access-token-456');
      })

      it('должен успешно деавторизовать пользователя', async () => {
        await store.dispatch(logoutUser()).unwrap();
  
        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.user).toBe(null);
        expect(state.accessToken).toBe(null);
        expect(state.refreshToken).toBe(null);
        expect(state.error).toBeNull();
        expect(localStorage.getItem('accessToken')).toBe(null);
        expect(localStorage.getItem('refreshToken')).toBe(null);
      });
    })
  });
});
