import React from 'react';
import { Button, EmailInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword, setForgotPasswordCompleted } from '../../services/authReducer';
import { useAppDispatch } from '../../services/hooks';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(resetPassword({ email }))
      .unwrap()
      .then(() => {
        dispatch(setForgotPasswordCompleted(true));
        navigate('/reset-password');
      })
      .catch((error) => {
        console.error(error);
        alert('Не удалось отправить запрос на сброс пароля');
      });
  };

  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center height_100">
          <div className="auth display_flex flex-direction_column align-items_center">
            <div className="auth-header mb-6">
              <h1 className="text text_type_main-medium">Забыли пароль</h1>
            </div>
            <form onSubmit={handleResetPassword} className="auth-body display_flex flex-direction_column align-items_center mb-20">
              <EmailInput
                onChange={handleChangeEmail}
                value={email}
                name={'email'}
                extraClass="mb-6"
              />
              <Button htmlType="submit" type="primary" size="medium">
                Восстановить
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

export default ForgotPassword;
