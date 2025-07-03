import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";

function Navbar({ onLogout, onThemeToggle, theme }) {
  return (
    <nav className={styles.navbar}>
      {/* Linksbündiger Titel */}
      <div className={styles.left}>
        <NavLink to="/" className={styles.titleLink}>
          Personal Finance Dashboard
        </NavLink>
      </div>
      {/* Zentrierte Navigation */}
      <div className={styles.center}>
        <div className={styles.navLinks}>
          <NavLink
            to="/finance-checks"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Einnahmen & Ausgaben Check
          </NavLink>
        </div>
      </div>
      {/* Rechts: Theme und Logout */}
      <div className={styles.right}>
        <img
          src={theme === "dark" ? moon : sun}
          className={styles.themeIcon}
          alt="Theme switch"
          onClick={onThemeToggle}
        />
        <button className="btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
