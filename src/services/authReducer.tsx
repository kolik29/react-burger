import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IAuth } from '../types/Auth';
import { request } from '../utils/request';

const loadAuthState = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken,
    };
  }

  return {
    accessToken: null,
    refreshToken: null,
  };
};

const initialState: IAuth = {
  ...loadAuthState(),
  user: null,
  isLoading: false,
  error: null,
  forgotPasswordCompleted: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; password: string; name: string }) => {
    return await request('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }) => {
    return await request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  return await request('/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (data: { refreshToken: string }) => {
    return await request('/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
);

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const accessToken = localStorage.getItem('accessToken');
  return await request('/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken!,
    },
  });
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password: string }) => {
    const accessToken = localStorage.getItem('accessToken');
    return await request('/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken!,
      },
      body: JSON.stringify(data),
    });
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
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        alert(action.error.message || 'Ошибка регистрации');
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        alert(action.error.message || 'Ошибка входа');
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        alert(action.error.message || 'Ошибка выхода');
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        alert(action.error.message || 'Ошибка обновления токена');
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        alert(action.error.message || 'Ошибка получения данных пользователя');
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        alert(action.error.message || 'Ошибка обновления данных пользователя');
      });
  },
});

export const { setForgotPasswordCompleted } = authSlice.actions;
export default authSlice.reducer;

export const checkAndRefreshTokens = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/checkAndRefreshTokens', async (_, { dispatch, rejectWithValue }) => {
  const accessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (accessToken) {
    try {
      await dispatch(getUser()).unwrap();
    } catch (err) {
      if (storedRefreshToken) {
        try {
          await dispatch(refreshToken({ refreshToken: storedRefreshToken })).unwrap();
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          return rejectWithValue('Ошибка обновления токенов');
        }
      }
    }
  }
});

export const resetPassword = createAsyncThunk<
  void, // Тип возвращаемого значения
  { password: string; token: string }, // Тип аргументов
  { rejectValue: string } // Тип ошибки
>('auth/resetPassword', async ({ password, token }, { rejectWithValue }) => {
  try {
    await request('/api/password-reset/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, token }),
    });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    return rejectWithValue('Не удалось сбросить пароль');
  }
});
