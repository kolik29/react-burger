import React, { useEffect } from 'react';
import AppHeader from '../AppHeader/AppHeader';
import { setIngredients } from '../../services/ingredientsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Main from '../../pages/Main/Main';
import Register from '../../pages/Register/Register';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import IngredientDetailsPage from '../../pages/IngredientDetailsPage/IngredientDetailsPage';
import ProtectedRouteElement from '../ProtectedRouteElement/ProtectedRouteElement';
import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = 'https://norma.nomoreparties.space';

  const location = useLocation();
  const background = location.state?.background;

  const fetchIngredients = React.useCallback(async () => {
    try {
      const response = await fetch(url + '/api/ingredients');

      if (!response.ok) {
        throw new Error(`HTTP ошибка! Статус: ${response.status}`);
      }

      const data = await response.json();

      dispatch(setIngredients(data.data));
    } catch (e) {
      console.error(e);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <>
      <AppHeader />

      <Routes location={background || location}>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRouteElement>
              <Profile />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRouteElement>
              <Profile />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRouteElement>
              <Profile />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/ingredients/:id"
          element={<IngredientDetailsPage />}
        />
      </Routes>

      {background && (
        <Modal isModalOpen={true} onClose={handleCloseModal}>
          <IngredientDetails />
        </Modal>
      )}
    </>
  );
};

export default App;
