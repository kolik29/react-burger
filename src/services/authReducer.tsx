import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IAuth } from '../types/Auth';
import { request } from '../utils/request';

const loadAuthState = () => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
});

const initialState: IAuth = {
  ...loadAuthState(),
  user: null,
  isLoading: false,
  error: null,
  forgotPasswordCompleted: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      return await request('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      return await request('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      return await request('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка обновления токена');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      return await request('/api/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken!,
        },
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка получения данных пользователя');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      return await request('/api/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken!,
        },
        body: JSON.stringify(data),
      });
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка обновления данных пользователя');
    }
  }
);

export const checkAndRefreshTokens = createAsyncThunk(
  'auth/checkAndRefreshTokens',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return rejectWithValue('Отсутствует refreshToken');
    }

    try {
      if (accessToken) {
        await dispatch(getUser()).unwrap();
      } else {
        const response = await dispatch(refreshToken()).unwrap();
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        await dispatch(getUser()).unwrap();
      }
    } catch (error: any) {
      localStorage.clear();
      return rejectWithValue('Ошибка проверки токенов');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      return await request('/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (error: any) {
      return rejectWithValue('Ошибка при сбросе пароля');
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async ({ password, token }: { password: string; token: string }, { rejectWithValue }) => {
    try {
      return await request('/api/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });
    } catch (error: any) {
      return rejectWithValue('Ошибка установки нового пароля');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setForgotPasswordCompleted: (state, action) => {
      state.forgotPasswordCompleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: IAuth) => {
      state.isLoading = true;
      state.error = null;
    };

    const rejected = (state: IAuth, action: any) => {
      state.isLoading = false;
      state.error = action.payload || 'Произошла ошибка';
    };

    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, rejected)
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, rejected)
      .addCase(logoutUser.pending, pending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.clear();
      })
      .addCase(logoutUser.rejected, rejected)
      .addCase(refreshToken.pending, pending)
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, rejected);
  },
});

export const { setForgotPasswordCompleted } = authSlice.actions;
export default authSlice.reducer;
