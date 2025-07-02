import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./sections/Footer/Footer";
import { useTheme } from "./common/ThemeContext";
import { useAuth } from "./common/AuthContext";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div>
      <Navbar onThemeToggle={toggleTheme} theme={theme} onLogout={logout} />
      <Outlet /> {/* <-- Hier werden die Seiten-Inhalte (Pages) gerendert */}
      <Footer />
    </div>
  );
}

export default App;