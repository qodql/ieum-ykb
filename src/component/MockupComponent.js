import Image from 'next/image';
import styles from '../styles/css/component/MockupComponent.module.scss';

const MockupComponent = ({ children }) => {
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
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default MockupComponent;
