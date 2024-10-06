import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <header className={styles.header}>
      <div className="header-left">
        <Link to="/">
          <span>StarWalkers</span>{" "}
        </Link>{" "}
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/LearnAbout">Learn About</Link>
        <Link to="/Project">Project</Link>
        <Link to="/Rogue">Rogue</Link>
      </nav>
    </header>
  );
}
export default Header;
