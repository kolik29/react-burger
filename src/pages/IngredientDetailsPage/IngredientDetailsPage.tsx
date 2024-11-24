import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IIngredient } from '../../types/Ingredient';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import styles from './IngredientDetailsPage.module.css';

const IngredientDetailsPage: React.FC = () => {
  const { id } = useParams();
  const ingredient = useSelector((state: any) =>
    state.ingredients.find((item: IIngredient) => item._id === id)
  );

  if (!ingredient) {
    return <p>Ингредиент не найден</p>;
  }

  return (
    <div className="text-align_center">
      <IngredientDetails />
    </div>
  );
};

export default IngredientDetailsPage;
