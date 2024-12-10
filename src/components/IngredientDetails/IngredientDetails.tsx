import React, { useEffect } from 'react';
import styles from './IngredientDetails.module.css';
import { useSelector } from 'react-redux';

const IngredientDetails: React.FC = () => {
  let ingredient = useSelector((state: any) => {
    return state.currentIngredient
  });

  if (!ingredient) {
    ingredient = sessionStorage.getItem('currentIngredient');
    
    if (ingredient) {
      ingredient = JSON.parse(ingredient);
    }
  }

  return (
    <>
    {ingredient ? (
      <div className="pt-10 pr-10 pl-10 pb-15">
        <div className={`${styles.modal_title} text text_type_main-large`}>Детали ингредиента</div>
        <img src={ingredient.image} alt={ingredient.name} width="480" height="240" />
        <p className='text-align_center height_48px text text_type_main-medium'>{ingredient.name}</p>
        <div className="info display_flex justify-content_center text text_type_main-default text_color_inactive text-align_center">
          <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
            <div>Калории, ккал</div>
            <div>{ingredient.calories}</div>
          </div>
          <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
            <div>Белки, г</div>
            <div>{ingredient.proteins}</div>
          </div>
          <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between mr-5`}>
            <div>Жиры, г</div>
            <div>{ingredient.fat}</div>
          </div>
          <div className={`${styles.info_item} display_flex flex-direction_column justify-content_space-between`}>
            <div>Углеводы, г</div>
            <div>{ingredient.carbohydrates}</div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  )
}

export default IngredientDetails;