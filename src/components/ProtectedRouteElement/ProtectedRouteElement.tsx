import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../services/store";
import { checkAndRefreshTokens } from "../../services/authReducer";
import { IProtectedRouteElement } from "../../types/ProtectedRouteElement";

const ProtectedRouteElement: React.FC<IProtectedRouteElement> = ({ children }) => {
  const { accessToken, refreshToken: storedRefreshToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    dispatch(checkAndRefreshTokens())
      .unwrap()
      .then(() => setIsTokenChecked(true))
      .catch(() => setIsTokenChecked(true)); // Даже в случае ошибки устанавливаем, что проверка завершена
  }, [dispatch]);

  if (!isTokenChecked) {
    return null;
  }

  if (!accessToken && !storedRefreshToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouteElement;
