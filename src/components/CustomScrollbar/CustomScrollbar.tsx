import React, { useEffect } from 'react';
import styles from './CustomScrollBar.module.css';
import { setTab } from '../../services/scrollbarTabsReduces';
import { useAppDispatch } from '../../services/hooks';

const CustomScrollBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispath = useAppDispatch();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const updateScrollHeight = () => {
        setScrollHeight(container.scrollHeight);
        setScrollTop(container.scrollTop);
        setContainerHeight(container.clientHeight);
      };

      const checkElementAtTop = () => {
        const containerRect = container?.getBoundingClientRect();
        const element = containerRect ? document.elementFromPoint(containerRect.left + 1, containerRect.top + 1) : null;
        const parentSection = element?.closest('section');
        const type = parentSection?.getAttribute('data-type');

        if (type) {
          dispath(setTab(type));
        }
      };

      const handleScroll = () => {
        updateScrollHeight();
        checkElementAtTop();
      };

      container.addEventListener('scroll', handleScroll);

      updateScrollHeight();

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const thumbHeight = Math.max((containerHeight / scrollHeight) * containerHeight, 30);
  const thumbTop = (scrollTop / (scrollHeight - containerHeight)) * (containerHeight - thumbHeight);

  const scrollThumbStyle = {
    height: `${thumbHeight}px`,
    transform: `translateY(${thumbTop}px)`,
  };

  return (
    <div className={styles['scroll-сontainer']}>
      {scrollHeight > containerHeight && (
        <div className={styles['scroll-bg']} />
      )}
      <div className={styles['scroll-content']} ref={containerRef}>
        {children}
      </div>
      {scrollHeight > containerHeight && (
        <div className={styles['scroll-thumb']} style={scrollThumbStyle} />
      )}
    </div>
  );
};

export default CustomScrollBar;
