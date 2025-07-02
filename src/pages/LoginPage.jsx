import { useState } from "react";
import { useAuth } from "../common/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useTheme } from "../common/ThemeContext";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import styles from "./LoginPage.module.css";
import Footer from "../sections/Footer/Footer";

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
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="E-Mail"
        />
        <input
          type="password"
          required
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Passwort"
        />
        <button type="submit" className={styles.loginBtn}>Login</button>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.registerHint}>
          Noch kein Account?
          <Link to="/register" className={styles.registerLink}>Jetzt registrieren</Link>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default LoginPage;