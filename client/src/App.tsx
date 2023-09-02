import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/authContext";
import ProtectedRoute from "./componets/ProtectedRoutes";
import HomePage from "./pages/homePage/homePage";
import LoginPage from "./pages/loginPage/loginPage";
import RegisterPage from "./pages/registerPage/registerPage";
import ErrorPage from "./pages/errorPage/errorPage";

const App: React.FC = () => {
  const { user } = useAuth();
  console.log(user)

  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        {!user && (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegisterPage />} />
          </>
        )}
        
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
