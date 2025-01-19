import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { IModal } from '../../types/Modal';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

const Modal: React.FC<IModal> = ({ isModalOpen, onClose, children }) => {
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
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

  const onClickHandler = () => {
    onClose();
  }

  if (!modalRoot) {
    return null;
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