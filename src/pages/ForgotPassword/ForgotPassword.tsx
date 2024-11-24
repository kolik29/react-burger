import React from 'react';
import styles from './ForgotPassword.module.css';
import { Button, EmailInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [ email, setEmail ] = React.useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleResetPassword = async () => {
    try {
      const response = await fetch('https://norma.nomoreparties.space/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          location.href = '/reset-password';
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
              <EmailInput
                onChange={handleChangeEmail}
                value={email}
                name={'email'}
                extraClass="mb-6"
              />
              <Button htmlType="button" type="primary" size="medium" onClick={handleResetPassword}>
                Восстановить
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

export default ForgotPassword;