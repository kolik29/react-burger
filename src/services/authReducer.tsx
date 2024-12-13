import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
    return await request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    return await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    return await request('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    });
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    return await request('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
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
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
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

export const checkAndRefreshTokens = createAsyncThunk(
  'auth/checkAndRefreshTokens',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('Отсутствует refreshToken');
    }

    if (accessToken) {
      await dispatch(getUser()).unwrap();
    } else {
      const response = await dispatch(refreshToken()).unwrap();
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      await dispatch(getUser()).unwrap();
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    return await request('/api/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }
);

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async ({ password, token }: { password: string; token: string }, { rejectWithValue }) => {
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

    const rejected = (state: IAuth, action: PayloadAction<string | undefined>): IAuth => {
      state.isLoading = false;
      state.error = action.payload || action.error.message || 'Произошла ошибка';
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
