import React from 'react';
import styles from './ResetPassword.module.css';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [ password, setPassword ] = React.useState('');
  const [ token, setToken ] = React.useState('');

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeToken = (e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value);

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch('https://norma.nomoreparties.space/api/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });
      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          location.href = '/login';
        } else {
          throw new Error('Ошибка при обработке данных');
        }
      } else {
        throw new Error('Ошибка при обработке данных');
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center height_100">
          <div className="auth display_flex flex-direction_column align-items_center">
            <div className="auth-header mb-6">
              <h1 className="text text_type_main-medium">Вход</h1>
            </div>
            <div className="auth-body display_flex flex-direction_column align-items_center mb-20">
              <PasswordInput
                onChange={handleChangePassword}
                value={password}
                name={'password'}
                extraClass="mb-6"
              />
              <Input
                type="text"
                placeholder="Введите код из письма"
                onChange={handleChangeToken}
                value={token}
                name="name"
                extraClass="mb-6"
              />
              <Button htmlType="button" type="primary" size="medium" onClick={handleUpdatePassword}>
                Сохранить
              </Button>
            </div>
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
  )
}

export default ResetPassword;