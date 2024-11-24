import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../services/store";
import { refreshToken } from "../../services/authReducer";
import { IProtectedRouteElement } from "../../types/ProtectedRouteElement";

const ProtectedRouteElement: React.FC<IProtectedRouteElement> = ({ children }) => {
  const { accessToken, refreshToken: storedRefreshToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();
  
  useEffect(() => {
    if (!accessToken && storedRefreshToken) {
      dispatch(refreshToken({ refreshToken: storedRefreshToken }));
    }
  }, [accessToken, storedRefreshToken, dispatch]);
  
  if (!accessToken && !storedRefreshToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRouteElement;