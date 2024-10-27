import React from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalOverlay.module.css';
import { iModal } from '../../types/Modal';

const ModalOverlay: React.FC<iModal> = ({ isModalOpen, onClose }) => {
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
  
  return ReactDOM.createPortal(
    (
      <div className={styles.modal_overlay} onClick={onClickHandler}></div>
    ), modalRoot
  );
};

export default ModalOverlay;