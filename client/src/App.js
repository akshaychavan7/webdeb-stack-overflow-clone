import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import Login from "./components/Login/Login.js";
import SignUp from "./components/Login/SignUp/SignUp.js";
import { ApplicationContextProvider } from "./context/ApplicationContext.js";
import { AlertContextProvider } from "./context/AlertContext.js";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.js";
function App() {

  return (
    <ApplicationContextProvider>
      <AlertContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<FakeStackOverflow />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AlertContextProvider>
    </ApplicationContextProvider>
  );
}

export default App;
