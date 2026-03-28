import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "./pages/Login.page";
import "./App.css";
import ChatPage from "./pages/Chat.page";
import SignupPage from "./pages/Signup.page";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./components/PageLoader";
import {Toaster} from 'react-hot-toast'

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Loginpage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster/>
    </>
  );
}

export default App;
