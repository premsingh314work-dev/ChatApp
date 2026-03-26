import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./pages/Login.page";
import "./App.css";
import ChatPage from "./pages/Chat.page";
import SignupPage from "./pages/Signup.page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default App;
