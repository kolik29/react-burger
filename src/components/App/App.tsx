import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import { setIngredients } from '../../services/ingredientsReducer';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Main from '../../pages/Main/Main';
import Register from '../../pages/Register/Register';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import ProtectedRouteElement from '../ProtectedRouteElement/ProtectedRouteElement';
import IngredientDetailsPage from '../../pages/IngredientDetailsPage/IngredientDetailsPage';

function App() {
  const dispatch = useDispatch();
  const url = 'https://norma.nomoreparties.space';

  const fetchIngredients = React.useCallback(async () => {
    try {
      const response = await fetch(url + '/api/ingredients');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      dispatch(setIngredients(data.data));
    } catch (e) {
      console.error(e);
    }
  }, [])

  React.useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return (
    <BrowserRouter>
      <AppHeader />

      <Routes>
        <Route path="/" element={
          <Main />
        } />
        <Route path="/login" element={
          <Login />
        } />
        <Route path="/register" element={
          <Register />
        } />
        <Route path="/forgot-password" element={
          <ForgotPassword />
        } />
        <Route path="/reset-password" element={
          <ResetPassword />
        } />
        <Route path="/profile" element={
          <ProtectedRouteElement>
            <Profile />
          </ProtectedRouteElement>
        } />
        <Route path="/profile/orders" element={
          <ProtectedRouteElement>
            <Profile />
          </ProtectedRouteElement>
        } />
        <Route path="/profile/orders/:number" element={
          <ProtectedRouteElement>
            <Profile />
          </ProtectedRouteElement>
        } />
        <Route path="/ingredients/:id" element={
          <ProtectedRouteElement>
            <IngredientDetailsPage />
          </ProtectedRouteElement>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;