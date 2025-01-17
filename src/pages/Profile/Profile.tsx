import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { Button, EmailInput, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../services/store';
import { useDispatch } from 'react-redux';
import { getUser, logoutUser, updateUser } from '../../services/authReducer';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ошибка при выходе:', error);
        alert('Ошибка при выходе из системы');
      });
  };

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then((result) => {
        setEmail(result.user.email || '');
        setName(result.user.name || '');
      })
      .catch((error) => {
        console.error('Ошибка при получении пользователя:', error);
        alert('Ошибка при загрузке данных пользователя');
        navigate('/login');
      });
  }, [dispatch]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();

    dispatch(updateUser({ email, password, name }))
      .unwrap()
      .then(() => {
        alert('Информация успешно обновлена!');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении данных:', error);
        alert('Ошибка при обновлении данных пользователя');
        navigate('/login');
      });
  };

  return (
    <div className="wrapper overflow_hidden height_100">
      <main className="container display_flex flex-direction_column height_100">
        <div className="display_flex justify-content_center align-items_center">
          <div className="profile display_flex mt-30 width_100">
            <div className={styles['profile-left'] + ' mr-15 text text_type_main-default'}>
              <div className="display_flex flex-direction_column">
                <NavLink
                  to="/profile"
                  end
                  className={({ isActive }) =>
                    (isActive ? styles['navlink-active'] : '') + ' ' + styles['navlink'] + ' text text_type_main-medium'
                  }
                >
                  Профиль
                </NavLink>
                <NavLink
                  to="/profile/orders"
                  end
                  className={({ isActive }) =>
                    (isActive ? styles['navlink-active'] : '') + ' ' + styles['navlink'] + ' text text_type_main-medium'
                  }
                >
                  История заказов
                </NavLink>
                <NavLink to="/login" className={styles['navlink'] + ' text text_type_main-medium'} onClick={handleLogout}>
                  Выход
                </NavLink>
              </div>
              <p className="mt-20 text_color_inactive">
                В этом разделе вы можете изменить свои персональные данные
              </p>
            </div>
            <form onSubmit={handleSave} className="profile-right">
              <Input
                type="text"
                placeholder="Имя"
                onChange={handleChangeName}
                value={name}
                name="name"
                extraClass="mb-6"
                icon="EditIcon"
              />
              <EmailInput
                onChange={handleChangeEmail}
                value={email}
                name="email"
                extraClass="mb-6"
                icon="EditIcon"
              />
              <PasswordInput
                onChange={handleChangePassword}
                value={password}
                name="password"
                extraClass="mb-6"
              />
              <Button htmlType="submit">Сохранить</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
