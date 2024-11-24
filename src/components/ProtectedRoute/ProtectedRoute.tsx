import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../services/store";
import { IProtectedRoute } from "../../types/ProtectedRoute";
import { refreshToken } from "../../services/authReducer";

const ProtectedRoute: React.FC<IProtectedRoute> = ({ children }) => {
  const { accessToken, refreshToken: storedRefreshToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();
  
  useEffect(() => {

    console.log(accessToken, storedRefreshToken);
    if (!accessToken && storedRefreshToken) {
      dispatch(refreshToken({ refreshToken: storedRefreshToken }));
    }
  }, [accessToken, storedRefreshToken, dispatch]);
  
  if (!accessToken && !storedRefreshToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;