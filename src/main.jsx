import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./common/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage"; // <--- NEU!
import FinanceChecksPage from "./pages/FinanceChecksPage";
import FinanceCheckDetailPage from "./pages/FinanceCheckDetailPage";
import FinanceCheckCreatePage from "./pages/FinanceCheckCreatePage";
import { ProtectedRoute } from "./common/ProtectedRoute";
import { ThemeProvider } from "./common/ThemeContext";
import Footer from "./sections/Footer/Footer";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth-Seiten (ohne Navbar) */}
            <Route
              path="/login"
              element={
                <>
                  <LoginPage />
                  <Footer />
                </>
              }
            />
            {/* Alle anderen Seiten im AppLayout */}
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="finance-checks"
                element={
                  <ProtectedRoute>
                    <FinanceChecksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="finance-checks/:checkId"
                element={
                  <ProtectedRoute>
                    <FinanceCheckDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="finance-checks/new"
                element={
                  <ProtectedRoute>
                    <FinanceCheckCreatePage />
                  </ProtectedRoute>
                }
              />
              {/* Weitere Seiten */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
