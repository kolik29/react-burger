import React from 'react';
import styles from './AppHeader.module.css';
import { Logo, BurgerIcon, ListIcon, ProfileIcon, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

  const [isButtonHovered, setIsButtonHovered] = React.useState({
    'constructor': false,
    'orders': false,
    'profile': false
  });
  
  const handleMouseEnter = (button: 'constructor' | 'orders' | 'profile'): void => {
    setIsButtonHovered((prev) => ({ ...prev, [button]: true }));
  };

  const handleMouseLeave = (button: 'constructor' | 'orders' | 'profile'): void => {
    setIsButtonHovered((prev: typeof isButtonHovered) => ({ ...prev, [button]: false }));
  };

  return (
    <div className={`wrapper ${styles.header_bg}`}>
      <header className={`container p-4 display_grid align-items_center ${styles.header_template}`}>
        <nav className='display_flex align-items_center'>
          <Button
            htmlType="button"
            type="secondary"
            size="small"
            extraClass="display_flex align-items_center text text_type_main-default text_color_inactive p-5"
            onMouseEnter={() => handleMouseEnter('constructor')}
            onMouseLeave={() => handleMouseLeave('constructor')}
            onClick={() => navigate('/')}
          >
            <BurgerIcon type={isButtonHovered.constructor ? 'primary' : 'secondary'} className={styles.button_transition} />
            <span className='ml-2'>
              Конструктор
            </span>
          </Button>
          <Button
            htmlType="button"
            type="secondary"
            size="small"
            extraClass="display_flex align-items_center text text_type_main-default text_color_inactive ml-2 p-5"
            onMouseEnter={() => handleMouseEnter('orders')}
            onMouseLeave={() => handleMouseLeave('orders')}
            onClick={() => navigate('/feed')}
          >
            <ListIcon type={isButtonHovered.orders ? 'primary' : 'secondary'} className={styles.button_transition} />
            <span className='ml-2'>
              Лента заказов
            </span>
          </Button>
        </nav>
        <div className='display_flex align-items_center'>
          <Logo />
        </div>
        <nav className='display_flex align-items_center justify-content_end'>
          <Button
            htmlType="button"
            type="secondary"
            size="small"
            extraClass="display_flex align-items_center text text_type_main-default text_color_inactive p-5"
            onMouseEnter={() => handleMouseEnter('profile')}
            onMouseLeave={() => handleMouseLeave('profile')}
            onClick={() => navigate('/profile')}
          >
            <ProfileIcon type={isButtonHovered.profile ? 'primary' : 'secondary'} className={styles.button_transition} />
            <span className='ml-2'>
              Личный кабинет
            </span>
          </Button>
        </nav>
      </header>
    </div>
  );
};

export default AppHeader;