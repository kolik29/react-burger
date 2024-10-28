import React from 'react';
import styles from './ModalOverlay.module.css';
import { IModal } from '../../types/Modal';

const ModalOverlay: React.FC<IModal> = ({ isModalOpen, onClose }) => {
  const modalRoot = document.getElementById('modal-root');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(isModalOpen);
  }, [isModalOpen]);

  if (!isOpen || !modalRoot) {
    return null;
  }

  const onClickHandler = () => {
    setIsOpen(false);
    onClose();
  }
  
  return (
      <div className={styles.modal_overlay} onClick={onClickHandler}></div>
  )
};

export default ModalOverlay;