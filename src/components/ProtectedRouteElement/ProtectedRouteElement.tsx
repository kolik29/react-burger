import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RootState } from "../../services/store";
import { checkAndRefreshTokens } from "../../services/authReducer";
import { IProtectedRouteElement } from "../../types/ProtectedRouteElement";
import { useAppDispatch, useAppSelector } from "../../services/hooks";

const ProtectedRouteElement: React.FC<IProtectedRouteElement> = ({ children }) => {
  const { accessToken, refreshToken: storedRefreshToken } = useAppSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
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
