import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../services/store";
import { refreshToken, getUser } from "../../services/authReducer";
import { IProtectedRouteElement } from "../../types/ProtectedRouteElement";

const ProtectedRouteElement: React.FC<IProtectedRouteElement> = ({ children }) => {
  const { accessToken, refreshToken: storedRefreshToken } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  
  useEffect(() => {
    const checkTokens = async () => {
      if (accessToken) {
        try {
          await dispatch(getUser()).unwrap();
        } catch (err) {
          if (storedRefreshToken) {
            try {
              await dispatch(refreshToken({ refreshToken: storedRefreshToken })).unwrap();
            } catch {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          }
        }
      }
      setIsTokenChecked(true);
    };

    checkTokens();
  }, [accessToken, storedRefreshToken, dispatch]);

  if (!isTokenChecked) {
    return null;
  }

  if (!accessToken && !storedRefreshToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRouteElement;
