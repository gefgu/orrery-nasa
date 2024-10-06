import Header from '../../Components/Header';
import Container from '../../Components/Container';
import styles from './Learn.module.css';
import { Player } from '@lottiefiles/react-lottie-player'; // Lottie player

function LearnAbout() {
  return (
    <>
      <Header></Header>
      <section className={styles.learnabout}></section>
      <Container>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h1>Learn About the Project</h1>
            <p>
              We are excited to present our interactive web application
              'StarWalkers', developed for the Space Apps challenge. Our goal
              is to educate the public about our solar system while providing an
              engaging and visually appealing experience showcasing celestial
              bodies. Our interactive planetarium serves as both an educational
              tool and an invitation to explore the significance of our solar
              system.
               We hope to inspire future initiatives that leverage data
              and technology to connect the public with the wonders of the
              cosmos.
            </p>
          
          </div>
          <div className={styles.lottieAnimation}>
            <Player
              autoplay
              loop
              src='https://lottie.host/703eb12c-a6a1-4dff-a364-ed4feeaf9d22/PfpDOfjeew.json' 
              style={{ height: '400px', width: '400px' }}
            ></Player>
          </div>
        </div>
      </Container>
    </>
  );
}

export default LearnAbout;
