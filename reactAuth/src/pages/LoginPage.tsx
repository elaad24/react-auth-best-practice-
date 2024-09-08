import React from "react";
import { login } from "../api/authRequests";

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    await login();
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>Login Page</h2>
      {/* Your login form logic */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
