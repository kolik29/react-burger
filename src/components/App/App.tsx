import React, { useEffect } from 'react';
import AppHeader from '../AppHeader/AppHeader';
import { fetchIngredients } from '../../services/ingredientsReducer';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import Feed from '../../pages/Feed/Feed';
import { AllOrderDeatils, UserOrderDetails } from '../FeedDetails/FeedDetails';
import FeedDetailsPage from '../../pages/FeedDetailsPage/FeedDetailsPage';
import Orders from '../../pages/Orders/Orders';
import { useAppDispatch, useAuthTokenChecker } from '../../services/hooks';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useAuthTokenChecker();

  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

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
              <Orders />
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRouteElement>
              <FeedDetailsPage>
                <UserOrderDetails />
              </FeedDetailsPage>
            </ProtectedRouteElement>
          }
        />
        <Route
          path="/ingredients/:id"
          element={<IngredientDetailsPage />}
        />

        <Route
          path="/feed"
          element={<Feed />}
        />

        <Route
          path="/feed/:number"
          element={
            <FeedDetailsPage>
              <AllOrderDeatils />
            </FeedDetailsPage>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal isModalOpen={true} onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal isModalOpen={true} onClose={handleCloseModal}>
                <AllOrderDeatils />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRouteElement>
                <Modal isModalOpen={true} onClose={handleCloseModal}>
                  <UserOrderDetails />
                </Modal>
              </ProtectedRouteElement>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
