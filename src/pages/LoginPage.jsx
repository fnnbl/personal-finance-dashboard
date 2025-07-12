import { useState } from "react";
import { useAuth } from "../common/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useTheme } from "../common/ThemeContext";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import styles from "./AuthPage.module.css";

function LoginPage() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const { theme, toggleTheme } = useTheme();

  if (!loading && user) return <Navigate to="/" />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const { error } = await login(email, pw);
    if (error) setError(error.message);
  }

  return (
    <div className={styles.bg}>
      <div className={styles.themeSwitch}>
        <img
          className={styles.themeIcon}
          src={theme === "light" ? sun : moon}
          alt="Theme"
          onClick={toggleTheme}
        />
      </div>
      <div className={styles.centeredContainer}>
        <h1 className={styles.pageTitle}>PERSONAL FINANCE DASHBOARD</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Login</h2>
          <div className={styles.inputGroup}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail"
            />
            <input
              type="password"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Passwort"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className="btn">
              Login
            </button>
            <p className={styles.error}>{error}</p>
            <div className={styles.registerHint}>
              Noch kein Account?
              <Link to="/register" className={styles.registerLink}>
                Jetzt registrieren
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
