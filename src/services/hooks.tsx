import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useEffect } from 'react';
import { checkAndRefreshTokens } from './authReducer';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuthTokenChecker = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkAndRefreshTokens());
    }, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
};