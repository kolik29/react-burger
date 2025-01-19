import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authReducer';
import { useAppDispatch } from '../services/hooks';

const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Ошибка при выходе из системы');
    }
  };

  return logout;
};

export default useLogout;
