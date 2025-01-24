import { useMemo, useState } from 'react';
import { Button, ConstructorElement, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { IIngredient } from '../../types/Ingredient';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar.tsx';
import OrderDetails from '../OrderDetails/OrderDetails.tsx';
import { useModal } from '../../hooks/useModal.tsx';
import Modal from '../Modal/Modal.tsx';
import { setOrder } from '../../services/orderReducer.tsx';
import { useDrop, useDrag } from 'react-dnd';
import { setSelectedIngredients, removeSelectedIngredients, reorderSelectedIngredients, clearAllIngredients } from '../../services/burgerConstructorReducer.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { submitOrder } from '../../services/submitOrder.tsx';
import { useAppDispatch, useAppSelector } from '../../services/hooks.tsx';

const BunConstructorElement: React.FC<{ bun: IIngredient; type: 'top' | 'bottom' }> = ({ bun, type }) => (
  <div className="position_relative display_flex align-items_center justify-content_end pl-8 pr-4">
    <ConstructorElement
      type={type}
      isLocked={true}
      text={`${bun.name} (${type === 'top' ? 'верх' : 'низ'})`}
      price={bun.price}
      thumbnail={bun.image_mobile}
      key={bun.key}
    />
  </div>
);

const IngredientConstructorElement: React.FC<{ ingredient: IIngredient; index: number; onRemove: () => void; moveIngredient: (fromIndex: number, toIndex: number) => void }> = ({ ingredient, index, onRemove, moveIngredient }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        moveIngredient(item.index, index);
      }
    },
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`${styles['burger-ingredient']} position_relative display_flex align-items_center justify-content_end pl-8 pr-4 pb-2 pt-2`}
    >
      <DragIcon type="primary" className={`${styles['burger-dragdrop']} cursor_pointer position_absolute`} />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image_mobile}
        key={ingredient.key}
        handleClose={onRemove}
      />
    </div>
  );
};

const IngredientListWrapper: React.FC<{ ingredients: IIngredient[]; onRemove: (index: number) => void }> = ({ ingredients, onRemove }) => {
  const dispatch = useAppDispatch();

  const moveIngredient = (fromIndex: number, toIndex: number) => {
    const updatedIngredients = [...ingredients];
    const [movedItem] = updatedIngredients.splice(fromIndex, 1);
    updatedIngredients.splice(toIndex, 0, movedItem);
    dispatch(reorderSelectedIngredients(updatedIngredients));
  };

  return (
    <CustomScrollbar>
      {ingredients.map((item, index) => (
        <IngredientConstructorElement
          key={item.key}
          ingredient={item}
          index={index}
          onRemove={() => onRemove(index)}
          moveIngredient={moveIngredient}
        />
      ))}
    </CustomScrollbar>
  );
};

const BurgerConstructor: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const data = useAppSelector((state) => state.burgerConstructor) as IIngredient[];
  const { isModalOpen, openModal, closeModal } = useModal();
  const [, dropIngredientsRef] = useDrop({
    accept: 'ingredient',
    drop: (ingredient: IIngredient) => {
      dispatch(setSelectedIngredients({ ...ingredient, key: uuidv4() }));
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const hasBun: boolean = data.some((item: IIngredient) => item.type === 'bun');

  const handleSubmitOrder = () => {
    let accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('Отсутствует токен доступа');
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (!accessToken.startsWith('Bearer ')) {
      accessToken = `Bearer ${accessToken}`;
    }

    if (!hasBun) {
      alert('Добавьте булоку в заказ!');
      return;
    }

    const ingredientIds = data.map((ingredient: IIngredient) => ingredient._id);

    setIsLoading(true);
    dispatch(submitOrder({ ingredientIds, accessToken }))
      .unwrap()
      .then(() => {
        openModal();
      })
      .catch((error) => {
        console.error(error);
        alert('Ошибка при создании заказа');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCloseModal = () => {
    closeModal();
    dispatch(setOrder(''));
    dispatch(clearAllIngredients());
  };

  const handleRemoveIngredient = (index: number) => {
    dispatch(removeSelectedIngredients(index + 1));
  };

  const totalPrice = useMemo(() => {
    return data.reduce((sum: number, item: IIngredient) => {
      if (item.type === 'bun') {
        return sum + item.price * 2;
      }

      return sum + item.price;
    }, 0);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div
        className="display_flex justify-content_center align-items_center width_100 pt-10 pb-10"
        ref={dropIngredientsRef}
        data-testid="burger-constructor-dropzone"
      >
        <div className="text text_type_main-default text_color_inactive text-align_center">Нет ингредиентов</div>
      </div>
    );
  }

  const currentBuns = data.filter((item: IIngredient) => item.type === 'bun')[0];
  const currentIngredients = data.filter((item: IIngredient) => item.type !== 'bun');

  return (
    <>
      <section
        className={`${styles['burger-ingredients']} max-width_600px width_100 display_grid height_auto overflow_hidden mt-25`}
        ref={dropIngredientsRef}
        data-testid="burger-constructor-dropzone"
      >
        <div className={`display_grid ${styles.burger} overflow_hidden height_100`}>
          {currentBuns && <BunConstructorElement bun={currentBuns} type="top" />}
          <div className="mt-4 mb-4 height_auto overflow_hidden">
            <IngredientListWrapper ingredients={currentIngredients} onRemove={handleRemoveIngredient} />
          </div>
          {currentBuns && <BunConstructorElement bun={currentBuns} type="bottom" />}
        </div>
        <div className="display_flex align-items_start mt-10 mb-10 pr-4">
          <div className="display_flex justify-content_end width_100">
            <div className="mr-10 display_flex align-items_center">
              <bdi className="text text_type_digits-medium mr-2">
                {totalPrice} <CurrencyIcon type="primary" />
              </bdi>
            </div>
            <div className="create-order">
              <Button htmlType="button" type="primary" size="large" onClick={handleSubmitOrder} disabled={isLoading}>
                {isLoading ? 'Оформляем...' : 'Оформить заказ'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};

export default BurgerConstructor;
