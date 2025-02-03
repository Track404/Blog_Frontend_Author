import styles from './LoadingScreen.module.css';
import { OrbitProgress } from 'react-loading-indicators';

function LoadingScreen() {
  return (
    <>
      <div>
        <div className={styles.loadingScreen}>
          <OrbitProgress
            variant="disc"
            dense
            color="#335ccb"
            size="large"
            text=""
            textColor=""
          />
        </div>
      </div>
    </>
  );
}

export default LoadingScreen;
