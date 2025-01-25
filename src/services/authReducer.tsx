import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAuth } from '../types/Auth';
import { request } from '../utils/request';
import { IUser } from '../types/User';

export const loadAuthState = () => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
});

export const initialState: IAuth = {
  ...loadAuthState(),
  user: null,
  isLoading: false,
  error: null,
  forgotPasswordCompleted: false,
};

export const registerUser = createAsyncThunk<
  {
    user: { id: string; email: string; name: string };
    accessToken: string;
    refreshToken: string;
  },
  IUser,
  { rejectValue: { message: string } }
>(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await request<{
        user: { id: string; email: string; name: string };
        accessToken: string;
        refreshToken: string;
      }>('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      return response;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Ошибка сервера' });
    }
  }
);

export const loginUser = createAsyncThunk<
  {
    user: { id: string; email: string; name: string };
    accessToken: string;
    refreshToken: string;
  },
  { email: string; password: string },
  { rejectValue: { message: string } }
>(
  'auth/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await request<{
        user: { id: string; email: string; name: string };
        accessToken: string;
        refreshToken: string;
      }>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      return response;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Ошибка сервера' });
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      await request('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Ошибка выхода' });
    }
  }
);

export const refreshTokenThunk = createAsyncThunk<
  {
    accessToken: string;
    refreshToken: string;
  },
  void,
  { rejectValue: { message: string } }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const response = await request<{
        accessToken: string;
        refreshToken: string;
      }>('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      return response;
    } catch (error: any) {
      return rejectWithValue({ message: error.message || 'Ошибка обновления токенов' });
    }
  }
);

export const getUser = createAsyncThunk<
  { user: { email: string; name: string } },
  void,
  { rejectValue: { message: string } }
>(
  'auth/getUser',
  async () => {
    const accessToken = localStorage.getItem('accessToken');
    return await request('/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken!,
      },
    });
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password: string }) => {
    const accessToken = localStorage.getItem('accessToken');
    return await request('/api/auth/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken!,
      },
      body: JSON.stringify(data),
    });
  }
);

export const checkAndRefreshTokens = createAsyncThunk<void, void, { dispatch: any }>(
  'auth/checkAndRefreshTokens',
  async (_, { dispatch }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('Отсутствует refreshToken');
    }

    if (accessToken) {
      await dispatch(getUser()).unwrap();
    } else {
      const response = await dispatch(refreshToken).unwrap();

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      await dispatch(getUser()).unwrap();
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }) => {
    return await request('/api/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }
);

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async ({ password, token }: { password: string; token: string }) => {
    return await request('/api/password-reset/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token }),
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
    const pending = (state: IAuth) => {
      state.isLoading = true;
      state.error = null;
    };

    const rejected = (state: IAuth, action: PayloadAction<{ message: string } | undefined>): void => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Произошла ошибка';
      state.user = null;
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
      .addCase(refreshTokenThunk.pending, pending)
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshTokenThunk.rejected, rejected);
  },
});

export const { setForgotPasswordCompleted } = authSlice.actions;
export default authSlice.reducer;
