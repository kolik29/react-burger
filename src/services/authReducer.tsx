import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IAuth } from '../types/Auth';

const API_URL = 'https://norma.nomoreparties.space/api/auth';

const loadAuthState = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken
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
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string, password: string, name: string }) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        
      } else {
        alert(result.message)
      }
      return result;
    }

    throw new Error('Ошибка при регистрации');
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string, password: string }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        return result;
      } else {
        alert(result.message)
      }
    }

    throw new Error('Ошибка при входе');
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        return result;
      } else {
        alert(result.message)
      }
    }

    throw new Error('Ошибка при выходе');
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (data: { refreshToken: string }) => {
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        return result;
      } else {
        alert(result.message)
      }
    }

    throw new Error('Ошибка при обновлении токена');
  }
)

export const getUser = createAsyncThunk(
  'auth/getUser',
  async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        return result;
      } else {
        alert(result.message)
      }
    }

    throw new Error('Ошибка при получении данных пользователя');
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string, email: string, password: string }) => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success) {
        return result;
      } else {
        alert(result.message)
      }
    }

    throw new Error('Ошибка при обновлении данных пользователя');
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
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
      })
      .addCase(refreshToken.pending, (state) => {        
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;        
        state.error = action.error.message;
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
      })
  }
})

export default authSlice.reducer;