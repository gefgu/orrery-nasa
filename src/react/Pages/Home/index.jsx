import ContainerHome from "../../Components/ContainerHome";
import Header from "../../Components/Header";
import styles from "./home.module.css";

function Home() {
  return (
    <>
      <Header> </Header>
      <section className={styles.home}></section>
      <ContainerHome>
        <h1 class="home"> Space Engineers </h1>
      </ContainerHome>
    </>
  );
}
export default Home;
