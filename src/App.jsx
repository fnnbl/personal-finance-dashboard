import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./sections/Footer/Footer";
import { useTheme } from "./common/ThemeContext";
import { useAuth } from "./common/AuthContext";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div id="app-wrapper">
      <Navbar onThemeToggle={toggleTheme} theme={theme} onLogout={logout} />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
