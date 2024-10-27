import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { iModal } from '../../types/Modal';

const Modal: React.FC<iModal> = ({ isOpen, onClose, children }: any) => {
  const modalRoot = document.getElementById('modal-root');
  
  if (!isOpen || !modalRoot) {
    return null;
  }
  
  return ReactDOM.createPortal(
    (
      <div className={styles.modal + ' position_fixed position_fixed--centered'}>
        <div
          className={styles.modal_close + ' cursor_pointer'}
          onClick={onClose}
        >
          <CloseIcon type="primary" />
        </div>
        {children}
      </div>
    ), modalRoot
  );
};

export default Modal;