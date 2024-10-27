import React from 'react';
import { Tab, CurrencyIcon, Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import { iIngredient } from '../../types/Ingredient';
import CustomScrollBar from '../CustomScrollbar/CustomScrollbar.tsx';
import Modal from '../Modal/Modal.tsx';
import ModalOverlay from '../ModalOverlay/ModalOverlay.tsx';

const IngredientItem: React.FC<{ item: iIngredient, count: number, onClick: () => void }> = ({ item, count, onClick }) => (
  <div
    key={item._id}
    className={`${styles.ingredients_item} mr-3 ml-3 mb-8 position_relative`}
    onClick={onClick}
  >
    {
      count > 0 &&
      <Counter count={count} size="default" />
    }
    <div className='display_flex justify-content_center'>
      <img src={item.image} className='width_100' alt={item.name} width="240" height="120" />
    </div>
    <div className='display_flex justify-content_center mt-1 mb-1'>
      <bdi className='display_flex align-items_center text text_type_digits-default'>
        {item.price} <CurrencyIcon type="primary" className='ml-3' />
      </bdi>
    </div>
    <div className='display_flex justify-content_center'>
      <p className='text-align_center height_48px text text_type_main-default'>{item.name}</p>
    </div>
  </div>
)

const BurgerIngredients: React.FC<{ data: iIngredient[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text text_type_main-default text_color_inactive text-align_center">Нет ингредиентов</div>
    );
  }
  
  const [current, setCurrent] = React.useState('buns');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedIngredient, setSelectedIngredient] = React.useState<iIngredient | null>(null);

  const buns = data.filter((item: any) => item.type === 'bun');
  const sauces = data.filter((item: any) => item.type === 'sauce');
  const ingredients = data.filter((item: any) => item.type === 'main');

  const tabBuns = React.useRef<HTMLDivElement>(null);
  const tabSauces = React.useRef<HTMLDivElement>(null);
  const tabIngredients = React.useRef<HTMLDivElement>(null);

  const scrollToElement = (element: any) => {
    setCurrent(element);

    if (element === 'buns' && tabBuns.current) {
      tabBuns.current.scrollIntoView({ behavior: 'smooth' });
    } else if (element === 'sauces' && tabSauces.current) {
      tabSauces.current.scrollIntoView({ behavior: 'smooth' });
    } else if (element === 'ingedients' && tabIngredients.current) {
      tabIngredients.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenModal = (item: iIngredient) => {
    setIsModalOpen(true);
    console.log(item)
    setSelectedIngredient(item);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
  };

  const modal = (
    <>
      <ModalOverlay
        isOpen={isModalOpen}
        onClick={handleCloseModal}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {selectedIngredient ? (
          <div className="pt-10 pr-10 pl-10 pb-15">
            <div className={`${styles.modal_title} text text_type_main-large`}>Детали ингредиента</div>
            <img src={selectedIngredient.image} className='width_100' alt={selectedIngredient.name} width="480" height="240" />
            <p className='text-align_center height_48px text text_type_main-medium'>{selectedIngredient.name}</p>
            <div className="info display_flex justify-content_center text text_type_main-default text_color_inactive text-align_center">
              <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
                <div>Калории, ккал</div>
                <div>{selectedIngredient.calories}</div>
              </div>
              <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
                <div>Белки, г</div>
                <div>{selectedIngredient.proteins}</div>
              </div>
              <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
                <div>Жиры, г</div>
                <div>{selectedIngredient.fat}</div>
              </div>
              <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between`}>
                <div>Углеводы, г</div>
                <div>{selectedIngredient.carbohydrates}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text text_type_main-default text_color_inactive text-align_center">Ингредиент не выбран</div> // Сообщение, если ингредиент не выбран
        )}
      </Modal>
    </>
  );

  return (
    <>
      <section className='max-width_600px width_100 display_inline-flex flex-direction_column height_100 overflow_hidden'>
        <h1 className='text text_type_main-large mt-10 mb-5'>Соберите бургер</h1>
        <div className='ingredients-tab display_flex'>
          <Tab value="buns" active={current === 'buns'} onClick={() => scrollToElement('buns')}>
            Булки
          </Tab>
          <Tab value="sauces" active={current === 'sauces'} onClick={() => scrollToElement('sauces')}>
            Соусы
          </Tab>
          <Tab value="ingedients" active={current === 'ingedients'} onClick={() => scrollToElement('ingedients')}>
            Начинки
          </Tab>
        </div>
        <div className='ingredients-inner overflow-y_auto height_100'>
          <CustomScrollBar>
            <section className='mt-10' ref={tabBuns}>
              <h2 className='text text_type_main-medium'>Булки</h2>
              <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
                {
                  buns.map((item: any) => (
                    <IngredientItem
                      key={item._id}
                      item={item}
                      count={Math.floor(Math.random() * 5)}
                      onClick={() => handleOpenModal(item)}
                    />
                  ))
                }
              </div>
            </section>
            <section className='mt-10' ref={tabSauces}>
              <h2 className='text text_type_main-medium'>Соусы</h2>
              <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
                {
                  sauces.map((item: any) => (
                    <IngredientItem
                      key={item._id}
                      item={item}
                      count={Math.floor(Math.random() * 5)}
                      onClick={() => handleOpenModal(item)}
                    />
                  ))
                }
              </div>
            </section>
            <section className='mt-10' ref={tabIngredients}>
              <h2 className='text text_type_main-medium'>Начинки</h2>
              <div className='display_flex pr-1 pl-1 pt-6 pb-2 flex-wrap_wrap'>
                {
                  ingredients.map((item: any) => (
                    <IngredientItem
                      key={item._id}
                      item={item}
                      count={Math.floor(Math.random() * 5)}
                      onClick={() => handleOpenModal(item)}
                    />
                  ))
                }
              </div>
            </section>
          </CustomScrollBar>
        </div>
      </section>
      {modal}
    </>
  );
};

export default BurgerIngredients;