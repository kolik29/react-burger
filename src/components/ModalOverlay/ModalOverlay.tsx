import React from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalOverlay.module.css';

const ModalOverlay: React.FC<{ isOpen: boolean, onClick: () => void }> = ({ isOpen, onClick }) => {
  const modalRoot = document.getElementById('modal-root');
  
  if (!isOpen || !modalRoot) {
    return null;
  }
  
  return ReactDOM.createPortal(
    (
      <div className={styles.modal_overlay} onClick={onClick}></div>
    ), modalRoot
  );
};

export default ModalOverlay;