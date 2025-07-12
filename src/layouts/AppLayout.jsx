import Navbar from "../components/Navbar";
import Footer from "../sections/Footer/Footer";
import { Outlet } from "react-router-dom";
import { useTheme } from "../common/ThemeContext.jsx";
import { useAuth } from "../common/AuthContext.jsx";

function AppLayout() {
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

export default AppLayout;
