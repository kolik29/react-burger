import React, { useEffect } from 'react';
import styles from './Profile.module.css';
import { Button, EmailInput, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';
import { getUser, logoutUser, updateUser } from '../../services/authReducer';

const Profile = () => {
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ name, setName ] = React.useState('');

  const navigate = useNavigate();

  const dispath: AppDispatch = useDispatch();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispath(logoutUser());
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await dispath(getUser()).unwrap();

        if (result.success) {
          setEmail(result.user.email || '');
          setName(result.user.name || '');
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    let data = {
      email,
      password,
      name
    }

    try {
      const result = await dispath(updateUser(data)).unwrap();

      if (result.success) {
        alert('Информация успешно обновлена!');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center">
          <div className="profile display_flex mt-30">
            <div className={styles['profile-left'] + ' mr-15 text text_type_main-default'}>
              <div className="display_flex flex-direction_column">
                <NavLink to="/profile" end className={({ isActive }) => (isActive ? styles['navlink-active'] : '') + ' ' + styles['navlink'] + ' text text_type_main-medium'}>Профиль</NavLink>
                <NavLink to="/profile/orders" end className={({ isActive }) => (isActive ? styles['navlink-active'] : '') + ' ' + styles['navlink'] + ' text text_type_main-medium'}>История заказов</NavLink>
                <NavLink to="/login" className={styles['navlink'] + ' text text_type_main-medium'} onClick={handleLogout}>Выход</NavLink>
              </div>
              <p className="mt-20 text_color_inactive">
                В этом разделе вы можете изменить свои персональные данные
              </p>
            </div>
            <div className="profile-right">
              <Input
                type="text"
                placeholder="Имя"
                onChange={handleChangeName}
                value={name}
                name="name"
                extraClass="mb-6"
                icon='EditIcon'
              />
              <EmailInput
                onChange={handleChangeEmail}
                value={email}
                name={'email'}
                extraClass="mb-6"
                icon='EditIcon'
              />
              <PasswordInput
                onChange={handleChangePassword}
                value={password}
                name={'password'}
                extraClass="mb-6"
              />
              <Button
                htmlType="button"
                onClick={handleSave}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile;