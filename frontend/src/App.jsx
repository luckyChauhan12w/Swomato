import React from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";

export const serverUrl = "http://localhost:3000";

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
};

export default App;
