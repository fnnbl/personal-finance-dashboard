import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./common/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import FinanceChecksPage from "./pages/FinanceChecksPage";
import FinanceCheckDetailPage from "./pages/FinanceCheckDetailPage";
import FinanceCheckCreatePage from "./pages/FinanceCheckCreatePage";
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
              <Route path="finance-checks" element={<FinanceChecksPage />} />
              <Route path="finance-checks/:checkId" element={<FinanceCheckDetailPage />} />
              <Route path="finance-checks/new" element={<FinanceCheckCreatePage />} />
              {/* Weitere Seiten */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);