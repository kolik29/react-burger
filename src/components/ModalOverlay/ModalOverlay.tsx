import React from 'react';
import styles from './ModalOverlay.module.css';
import { IModal } from '../../types/Modal';

const ModalOverlay: React.FC<IModal> = ({ onClose }) => {
  const onClickHandler = () => {
    onClose();
  }
  
  return (
      <div className={styles.modal_overlay} onClick={onClickHandler}></div>
  )
};

export default ModalOverlay;