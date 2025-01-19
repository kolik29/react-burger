import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IIngredient } from '../../types/Ingredient';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import { setCurrentIngredient } from '../../services/currentIngredientReducer';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

const IngredientDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const ingredients: IIngredient[] = useAppSelector((state: { ingredients: IIngredient[] }) => state.ingredients);
  const ingredient: IIngredient | null = useAppSelector((state: { currentIngredient: IIngredient | null }) => state.currentIngredient);

  useEffect(() => {
    if (id && ingredients.length > 0) {
      const foundIngredient = ingredients.find((item: IIngredient) => item._id === id);
      if (foundIngredient) {
        dispatch(setCurrentIngredient(foundIngredient));
      }
    }
  }, [id, ingredients, dispatch]);

  if (!ingredient) {
    return <p className="text text_type_main-medium text-align_center mt-10">Ингредиент не найден</p>;
  }

  return (
    <div className="text-align_center">
      <IngredientDetails />
    </div>
  );
};

export default IngredientDetailsPage;
