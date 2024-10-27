import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { iModal } from '../../types/Modal';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

const Modal: React.FC<iModal> = ({ isModalOpen, onClose, children }: any) => {
  const modalRoot = document.getElementById('modal-root');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(isModalOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, onClose]);
  
  if (!isOpen || !modalRoot) {
    return null;
  }

  const onClickHandler = () => {
    setIsOpen(false);
    onClose();
  }
  
  return ReactDOM.createPortal(
    (
      <>
        <ModalOverlay isModalOpen={isModalOpen} onClose={onClose} />
        <div className={`${styles.modal} position_fixed position_fixed--centered`}>
          <div
            className={`${styles.modal_close} cursor_pointer`}
            onClick={onClickHandler}
          >
            <CloseIcon type="primary" />
          </div>
          {children}
        </div>
      </>
    ), modalRoot
  );
};

export default Modal;