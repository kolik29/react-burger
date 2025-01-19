import React from 'react';
import styles from './IngredientDetails.module.css';
import { IIngredient } from '../../types/Ingredient';
import { useAppSelector } from '../../services/hooks';

const IngredientDetails: React.FC = () => {
  const ingredient: IIngredient | null = useAppSelector((state: { currentIngredient: IIngredient | null }) => state.currentIngredient);

  let sessionIngredient: IIngredient | null = null;
  if (!ingredient) {
    const storedIngredient = sessionStorage.getItem('currentIngredient');
    if (storedIngredient) {
      sessionIngredient = JSON.parse(storedIngredient);
    }
  }

  const currentIngredient = ingredient || sessionIngredient;

  return (
    <>
      {currentIngredient ? (
        <div className="pt-10 pr-10 pl-10 pb-15">
          <div className={`${styles.modal_title} text text_type_main-large`}>Детали ингредиента</div>
          <img src={currentIngredient.image} alt={currentIngredient.name} width="480" height="240" />
          <p className='text-align_center height_48px text text_type_main-medium'>{currentIngredient.name}</p>
          <div className="info display_flex justify-content_center text text_type_main-default text_color_inactive text-align_center">
            <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
              <div>Калории, ккал</div>
              <div>{currentIngredient.calories}</div>
            </div>
            <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
              <div>Белки, г</div>
              <div>{currentIngredient.proteins}</div>
            </div>
            <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
              <div>Жиры, г</div>
              <div>{currentIngredient.fat}</div>
            </div>
            <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between`}>
              <div>Углеводы, г</div>
              <div>{currentIngredient.carbohydrates}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IngredientDetails;