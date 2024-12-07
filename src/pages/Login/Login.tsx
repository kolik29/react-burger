import React, { useState } from 'react';
import { Button, EmailInput, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authReducer';
import { AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Ошибка при входе:', error);
        alert('Ошибка при входе. Проверьте правильность данных.');
      });
  };

  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center height_100">
          <div className="auth display_flex flex-direction_column align-items_center">
            <div className="auth-header mb-6">
              <h1 className="text text_type_main-medium">Вход</h1>
            </div>
            <form onSubmit={handleLogin} className="auth-body display_flex flex-direction_column align-items_center mb-20">
              <EmailInput
                onChange={handleChangeEmail}
                value={email}
                name="email"
                extraClass="mb-6"
              />
              <PasswordInput
                onChange={handleChangePassword}
                value={password}
                name="password"
                extraClass="mb-6"
              />
              <Button htmlType="submit" type="primary" size="medium">
                Войти
              </Button>
            </form>
            <div className="auth-footer">
              <p className="text text_type_main-default text_color_inactive text-align_center mb-4">
                Вы — новый пользователь? 
                <Link to="/register" className="text text_type_main-default ml-2 link">Зарегистрироваться</Link>
              </p>
              <p className="text text_type_main-default text_color_inactive text-align_center">
                Забыли пароль? 
                <Link to="/forgot-password" className="text text_type_main-default ml-2 link">Восстановить пароль</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
