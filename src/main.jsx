import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./common/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import FinanceChecksPage from "./pages/FinanceChecksPage";
import { ProtectedRoute } from "./common/ProtectedRoute";
import { ThemeProvider } from "./common/ThemeContext";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            >
              {/* Alle Unterseiten mit Navbar+Footer */}
              <Route
                path="finance-checks"
                element={<FinanceChecksPage />}
              />
              {/* Du kannst hier noch weitere Seiten einbinden */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);