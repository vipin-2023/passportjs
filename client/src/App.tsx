import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import HomePage from "./pages/homePage/homePage";
import LoginPage from "./pages/loginPage/loginPage";
import RegisterPage from "./pages/registerPage/registerPage";
import ErrorPage from "./pages/errorPage/errorPage";
import { Protected, Authrized } from "./componets/ProtectedRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
            <Authrized>
              <LoginPage />
            </Authrized>
          }/>
        <Route path="/signup" element={
            <Authrized>
              <RegisterPage />
            </Authrized>
          } />
        <Route path="/"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }/>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
