import React from 'react';
import styles from './Login.module.css';
import { Button, EmailInput, PasswordInput, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../services/authReducer';
import { AppDispatch } from '../../services/store';

const Register = () => {
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ name, setName ] = React.useState('');

  const dispath: AppDispatch = useDispatch();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const handleRegister = async () => {
    try {
      await dispath(registerUser({ email, password, name }));
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center height_100">
          <div className="auth display_flex flex-direction_column align-items_center">
            <div className="auth-header mb-6">
              <h1 className="text text_type_main-medium">Регистрация</h1>
            </div>
            <div className="auth-body display_flex flex-direction_column align-items_center mb-20">
              <Input
                type="text"
                placeholder="Имя"
                onChange={handleChangeName}
                value={name}
                name="name"
                extraClass="mb-6"
              />
              <EmailInput
                onChange={handleChangeEmail}
                value={email}
                name={'email'}
                extraClass="mb-6"
              />
              <PasswordInput
                onChange={handleChangePassword}
                value={password}
                name={'password'}
                extraClass="mb-6"
              />
              <Button htmlType="button" type="primary" size="medium" onClick={handleRegister}>
                Зарегистрироваться
              </Button>
            </div>
            <div className="auth-footer">
              <p className="text text_type_main-default text_color_inactive text-align_center mb-4">
                Уже зарегистрированы? 
                <Link to="/login" className="text text_type_main-default ml-2 link">Войти</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register;