import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";
import styles from "../styles/AuthPage.module.css";
import { useTheme } from "../contexts/ThemeContext";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Passwort muss mindestens 8 Zeichen lang sein, eine Zahl, einen Groß- und einen Kleinbuchstaben enthalten."
      );
      return;
    }

    if (password !== repeatPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (
        error.message.toLowerCase().includes("email") &&
        error.message.toLowerCase().includes("invalid")
      ) {
        setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      } else {
        setError(error.message);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.themeSwitch}>
        <img
          className={styles.themeIcon}
          src={theme === "light" ? sun : moon}
          alt="Theme Icon"
          onClick={toggleTheme}
        />
      </div>

      <h1 className={styles.pageTitle}>PERSONAL FINANCE DASHBOARD</h1>

      <div className={styles.centeredContainer}>
        <form className={styles.form} onSubmit={handleRegister}>
          <h2 className={styles.formTitle}>Registrieren</h2>

          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Passwort wiederholen"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className="btn">
              Registrieren
            </button>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.registerHint}>
              Bereits ein Konto?
              <Link to="/login" className={styles.registerLink}>
                Zum Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
