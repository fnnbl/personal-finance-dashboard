import styles from "./FooterStyles.module.css";
import { useTheme } from "../../common/ThemeContext";
import githubDark from "../../assets/github-dark.svg";
import githubLight from "../../assets/github-light.svg";
import linkedinDark from "../../assets/linkedin-dark.svg";
import linkedinLight from "../../assets/linkedin-light.svg";

function Footer() {
  const { theme } = useTheme();

  const githubIcon = theme === "dark" ? githubDark : githubLight;
  const linkedinIcon = theme === "dark" ? linkedinDark : linkedinLight;

  return (
    <footer style={{ width: "100vw" }}>
      <div className={styles.divider} aria-hidden />
      <div className={styles.container}>
        <div className={styles.left}>
          <p>
            &copy; 2024 Fynn Blaurock. <br />
            All rights reserved.
          </p>
        </div>
        <div className={styles.socials}>
          <a
            href="https://github.com/fnnbl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img src={githubIcon} alt="GitHub" />
          </a>
          <a
            href="https://www.linkedin.com/in/fynn-blaurock-37723b218/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
