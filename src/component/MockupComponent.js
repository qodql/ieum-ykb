import Image from 'next/image';
import styles from '../styles/css/component/MockupComponent.module.scss';

const MockupComponent = ({ children, height = '900px' }) => {
  return (
    <div className={styles.container}>
      <Image
        src="/mockup.png"
        alt="Mockup"
        width={438}
        height={900}
        className={styles.mockupImage}
        priority
      />
      <div className={styles.content} style={{ height }}>
        {children}
      </div>
    </div>
  );
};

export default MockupComponent;
