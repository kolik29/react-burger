import React from 'react';
import styles from './CustomScrollBar.module.css';

const CustomScrollBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateScrollHeight = () => {
        setScrollHeight(container.scrollHeight);
        setScrollTop(container.scrollTop);
        setContainerHeight(container.clientHeight);
      };

      container.addEventListener('scroll', updateScrollHeight);
      updateScrollHeight();

      return () => {
        container.removeEventListener('scroll', updateScrollHeight);
      };
    }
  }, []);

  const thumbHeight = scrollHeight > 0 ? (containerHeight / scrollHeight) * containerHeight : 0;
  const thumbTop = scrollHeight > 0 ? (scrollTop / scrollHeight) * (containerHeight - thumbHeight) : 0;

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
