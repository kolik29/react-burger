import React, { useState } from 'react';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { resetUserPassword } from '../../services/authReducer';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeToken = (e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value);

  const forgotPasswordCompleted: boolean = useAppSelector((state: { auth: { forgotPasswordCompleted: boolean } }): boolean => state.auth.forgotPasswordCompleted);

  if (!forgotPasswordCompleted) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(resetUserPassword({ password, token }))
      .unwrap()
      .then(() => {
        alert('Пароль успешно изменён!');
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ошибка при сбросе пароля:', error);
        alert('Не удалось изменить пароль. Попробуйте снова.');
      });
  };

  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center height_100">
          <div className="auth display_flex flex-direction_column align-items_center">
            <div className="auth-header mb-6">
              <h1 className="text text_type_main-medium">Восстановление пароля</h1>
            </div>
            <form onSubmit={handleUpdatePassword} className="auth-body display_flex flex-direction_column align-items_center mb-20">
              <PasswordInput
                onChange={handleChangePassword}
                value={password}
                name="password"
                extraClass="mb-6"
              />
              <Input
                type="text"
                placeholder="Введите код из письма"
                onChange={handleChangeToken}
                value={token}
                name="token"
                extraClass="mb-6"
              />
              <Button htmlType="submit" type="primary" size="medium">
                Сохранить
              </Button>
            </form>
            <div className="auth-footer">
              <p className="text text_type_main-default text_color_inactive text-align_center mb-4">
                Вспомнили пароль? 
                <Link to="/login" className="text text_type_main-default ml-2 link">Войти</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
