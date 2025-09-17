import { Route, Routes } from "react-router-dom";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const serverUrl = "http://localhost:3000";

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default App;
